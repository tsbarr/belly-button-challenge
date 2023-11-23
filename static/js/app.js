// Declare variables
const url =
  'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'


// Run initial function
initOrUpdate('940', initial=true);

// Declare and define variable for dropdown
const dropdown = d3.select("#selDataset");
// Declare and define where plot titles go
const barTitle = d3.select("#bar-title").select('h4');
const bubbleTitle = d3.select("#bubble-title").select('h4');
const gaugeTitle = d3.select("#gauge-title");

// Listen for change in dropdown option
dropdown.on("change", 
  // when dropdrown changes
  () => {
    // Get value of selected id
    let newId = dropdown.property("value");
    // Update page
    initOrUpdate(newId, initial=false);
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
    () => { console.log('data failed to load') });
}

/**
 * Function for use within a .then() call, handles the data returned from a d3 promise
 * @param {string} sampleId - The id of sample to display
 * @param {Object} dataSet - Data Object returned from the d3.json() promise, with elements: names, metadata and samples
 * @param {boolean} initial - Is this the call that initiates the site? 
 *                            If true (default): it sets the dropdown options and draws the plots
 *                            If false: it will only update the plots
 */
function handleData(sampleId, dataSet, initial=true) {
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
        initBar(sampleId, top10);
        initBubble(sampleData);
        initGauge(sampleId, sampleMetadata.wfreq);
      } else { // If not initial, just update plots
        updateBar(sampleId, top10);
        updateBubble(sampleData);
        updateGauge(sampleId, sampleMetadata.wfreq)
      }
      // Finally, display metadata
      displayMetadata(sampleMetadata);
      // We have found the sample's data, so break out of the loop
      break;
    }
  }
}

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

// ---
function getTop10(sampleObject, reversed=true) {
  // Create an array that contains 3 arrays: 
  // 1 array for each: otu_ids, sample_values and otu_labels
  const idValueLabel = Object.values(sampleObject).slice(1);
  // Transpose to create an array of arrays, one per otu
  // Based on: https://stackoverflow.com/a/17428705
  const otus = idValueLabel[0].map(
    (_, colIndex) => idValueLabel.map(row => row[colIndex])
  );
  // Sort desc otus based on sample_values (middle value of each otu array)
  otus.sort((a, b) => b[1] - a[1]);
  // Get top 10
  const top10 = otus.slice(0, 10);
  // If reversed=true, use reversed top10
  if (reversed) {
    top10.reverse();
  }

  const top10Object = {
    otu_ids: top10.map(x => `OTU ${x[0]}`),
    sample_values: top10.map(x => x[1]),
    otu_labels: top10.map(x => x[2])
  };

  return top10Object;
}

// ---
function initBar(sampleId, top10) {
  let data = [{
    y: top10.otu_ids, 
    x: top10.sample_values,
    text: top10.otu_labels.map(x => x.replaceAll(';','<br>')),
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
  barTitle.text(`Top 10 OTUs* sampled from Test Subject ${sampleId}`)
}

// This function is called when a dropdown menu item is selected
function updateBar(sampleId, top10) {
  // Set data update
  let data_update = {
    y: [top10.otu_ids],
    x: [top10.sample_values],
    text: [top10.otu_labels.map(x => x.replaceAll(';', '<br>'))]
  };
  // Update both data
  Plotly.restyle('bar', data_update);
  barTitle.text(`Top 10 OTUs* sampled from Test Subject ${sampleId}`)
}

// ---
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
  bubbleTitle.text(`All OTUs* sampled from Test Subject ${sampleData.id}`)
}

// This function is called when a dropdown menu item is selected
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
  bubbleTitle.text(`All OTUs* sampled from Test Subject ${sampleData.id}`)
}

// ---
function initGauge(sampleId, wfreq) {
  let data = [
    {
      domain: { y: [0] },
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
  let layout = { margin: { t: 0 } };
  let config = { responsive: true };
  Plotly.newPlot('gauge', data, layout, config);
  gaugeTitle.html(`<h4>Test Subject ${sampleId}'s Belly Button Washing Frequency</h4>`
    + '<h5>Scrubs per Week</h5>')
}

// This function is called when a dropdown menu item is selected
function updateGauge(sampleId, wfreq) {
  // Set data update
  let data_update = {
    value: [wfreq]
  };
  // Update data trace
  Plotly.restyle('gauge', data_update);
  gaugeTitle.html(`<h4>Test Subject ${sampleId}'s Belly Button Washing Frequency</h4>`
    + '<h5>Scrubs per Week</h5>')
}
