// Declare variables
const url =
  'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'


// Run initial function
initOrUpdate('940', initial = true);

// Declare and define variable for dropdown
const dropdown = d3.select("#selDataset");
// Declare and define all spots where we should add the id (for plot titles)
const labelId = d3.selectAll('.sampleID');

// Listen for change in dropdown option
dropdown.on("change",
  // when dropdrown changes
  () => {
    // Get value of selected id
    let newId = dropdown.property("value");
    // Update page
    initOrUpdate(newId, initial = false);
  }
);

/*
* ----------------------------------------------------------------
* --- Functions --------------------------------------------------
* ----------------------------------------------------------------
*/
/**
 * Function that will display metadata and plots for selected id
 * @param {string} selectedId - The id of sample to display
 * @param {boolean} initial - is this the call that initiates the site? to pass to handleData()
 */
function initOrUpdate(selectedId, initial) {
  d3.json(url).then(
    // if promise is fulfilled:
    (data) => handleData(selectedId, data, initial),
    // if promise is rejected:
    () => {
      console.log('data failed to load');
      d3.selectAll('.plot-title')
        .html('<h4>error: data failed to load</h4>');
    }
  );
}
// ---

/**
 * Function for use within a .then() call, handles the data returned from a d3 promise
 * @param {string} sampleId - The id of sample to display
 * @param {Object} dataSet - Data Object returned from the d3.json() promise, with elements: names, metadata and samples
 * @param {boolean} initial - Is this the call that initiates the site? 
 *                            If true (default): it sets the dropdown options and draws the plots
 *                            If false: it will only update the plots
 */
function handleData(sampleId, dataSet, initial = true) {
  labelId.text(sampleId);
  // Access data ids
  const ids = dataSet.names;
  // Loop through ids to find selected sample
  // how to use for...in loops: https://www.w3schools.com/js/js_loop_forin.asp
  for (const i in ids) {
    // if id corresponds to selected, extract info
    if (ids[i] == sampleId) {
      const sampleMetadata = dataSet.metadata[i];
      const sampleData = dataSet.samples[i];
      const top10 = getTop10(sampleData);
      // if initial is true
      if (initial) {
        // Add options to dropdown
        displayOptions(ids);
        // Draw initial plots
        initBar(top10);
        initBubble(sampleData);
        initGauge(sampleMetadata.wfreq);
      } else { // If not initial, just update plots
        updateBar(top10);
        updateBubble(sampleData);
        updateGauge(sampleMetadata.wfreq)
      }
      // Finally, display metadata
      displayMetadata(sampleMetadata);
      // We have found the sample's data, so break out of the loop
      break;
    }
  }
}
// ---
/**
 * Function to add the ids to the dropdown menu, called by initOrUpdate when initial=true.
 * @param {string[]} idsObject - An array of strings that represent the sample ids,
 * a dropdown option will be created for each of them.
 */
function displayOptions(idsObject) {
  // Initialize optionsHtml to add to dropdown
  let optionsHtml = '';
  // how to use for...of loops: https://www.w3schools.com/js/js_loop_forof.asp
  for (const id of idsObject) {
    // Append to options
    optionsHtml += `<option value = "${id}">${id}</option>`;
  }
  dropdown.html(optionsHtml);
}
// ---
/**
 * Function that takes a sample's metadata object and displays it in the html element with id=sample-metadata
 * @param {Object} sampleMetadata - An object containing a sample's metadata as key:value pairs
 */
function displayMetadata(sampleMetadata) {
  // Find html element to display metadata
  const metadataPanel = d3.select('#sample-metadata');
  // Initialize html
  let metadataHtml = '';
  // loop through the keys of sampleMetadata
  for (const key in sampleMetadata) {
    let open = '', close = '';
    if (key === 'bbtype') {
      open = '<a href="#" title="belly button type (innie or outie)" class="silent-link">';
      close = '**</a>';
    } else if (key === 'wfreq') {
      open = '<a href="#" title="wash frequency (scrubs per week)" class="silent-link">';
      close = '***</a>';
    }
    // Append to html -> key: value
    metadataHtml += `<p>${open}<strong>${key}:</strong> ${sampleMetadata[key]}${close}</p>`;
  }
  // Display html in metadata panel
  metadataPanel.html(metadataHtml);
}
/**
 * Function to calculate top 10 otus by value found in the selected sample
 * @param {Object} sampleObject - object containing the selected sample's otu data
 * @param {boolean} reversed - whether to reverse the top10 output 
 *                            (default true for use in horizontal plotly bar charts)
 * @returns Object containing the top 10 otus found in the sample by values, 
 * as 3 named arrays: otu_ids, sample_values and otu_labels. 
 * otu_ids are strings with 'OTU ' added before the otu id number
 */
function getTop10(sampleObject, reversed = true) {
  // Create an array that contains 3 arrays: 
  // 1 array for each: otu_ids, sample_values and otu_labels
  const sampleArray = Object.values(sampleObject).slice(1);
  // Transpose to create an array of arrays, one per otu
  // Based on: https://stackoverflow.com/a/17428705
  const otus = sampleArray[0].map(
    (_, colIndex) => sampleArray.map(row => row[colIndex])
  );
  // Sort desc otus based on sample_values (middle value of each otu array)
  otus.sort((a, b) => b[1] - a[1]);
  // Get top 10
  const top10 = otus.slice(0, 10);
  // If reversed=true, use reversed top10
  if (reversed) {
    top10.reverse();
  }
  // Build object to return by separating each value type in 3 different arrays
  const top10Return = {
    otu_ids: top10.map(x => `OTU ${x[0]}`),
    sample_values: top10.map(x => x[1]),
    otu_labels: top10.map(x => x[2])
  };
  return top10Return;
}
// ---
/**
 * Function to initialize the horizontal bar chart
 * @param {Object} top10 - Object returned by getTop10(), contains the data to plot
 */
function initBar(top10) {
  let data = [{
    y: top10.otu_ids,
    x: top10.sample_values,
    text: top10.otu_labels.map(x => x.replaceAll(';', '<br>')),
    hoverinfo: 'text',
    type: 'bar',
    orientation: 'h',
    marker: {
      color: '#7d40bf'
    }
  }];
  let layout = { margin: { t: 0 } };
  let config = { responsive: true };
  Plotly.newPlot('bar', data, layout, config);
}
/**
 * Function to initialize the bubble plot
 * @param {Object} sampleData - Object containing the selected sample's otu data
 */
function initBubble(sampleData) {
  let data = [{
    x: sampleData.otu_ids,
    y: sampleData.sample_values,
    text: sampleData.otu_labels.map(x => x.replaceAll(';', '<br>')),
    hoverinfo: 'text',
    mode: 'markers',
    marker: {
      color: sampleData.otu_ids,
      size: sampleData.sample_values,
      colorscale: 'Bluered'
    }
  }];
  let layout = { margin: { t: 0 } };
  let config = { responsive: true };
  Plotly.newPlot('bubble', data, layout, config);
}
/**
 * Function to initialize the gauge (i.e. indicator) plot
 * @param {number} wfreq - value to use in gauge, from the sample's metadata
 */
function initGauge(wfreq) {
  let data = [
    {
      domain: { x: [0, 1], y: [0.4, 0.9] },
      value: wfreq,
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {
          range: [0, 9],
          dtick: 1
        },
        bar: {
          color: '#7e2a54'
        },
        bgcolor: '#d9bfcc'
      }
    }
  ];
  let layout = {
    margin: { t: 0 }
  };
  let config = { responsive: true };
  Plotly.newPlot('gauge', data, layout, config);
}
// ---
/**
 * Function that updates the horizontal bar plot
 * It is called when a new dropdown menu item is selected
 * @param {Object} top10 - Object returned by getTop10(), contains the data to update the plot
 */
function updateBar(top10) {
  // Set data update
  let data_update = {
    y: [top10.otu_ids],
    x: [top10.sample_values],
    text: [top10.otu_labels.map(x => x.replaceAll(';', '<br>'))]
  };
  // Update both data
  Plotly.restyle('bar', data_update);
}
/**
 * Function that updates the bubble plot
 * It is called when a new dropdown menu item is selected
 * @param {Object} sampleData - Object containing the selected sample's otu data
 */
function updateBubble(sampleData) {
  // Set data update
  let data_update = {
    x: [sampleData.otu_ids],
    y: [sampleData.sample_values],
    text: [sampleData.otu_labels.map(x => x.replaceAll(';', '<br>'))],
    marker: {
      color: sampleData.otu_ids,
      size: sampleData.sample_values
    }
  };
  // Update both data and layout
  Plotly.restyle('bubble', data_update);
}
/**
 * Function that updates the gauge (i.e. indicator) plot
 * It is called when a new dropdown menu item is selected
 * @param {number} wfreq - value to use in gauge, from the sample's metadata
 */
function updateGauge(wfreq) {
  // Set data update
  let data_update = {
    value: [wfreq]
  };
  // Update data trace
  Plotly.restyle('gauge', data_update);
}
// ---
