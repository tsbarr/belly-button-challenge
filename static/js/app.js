// Declare variables
const url =
  'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'


// Run initial function
initOrUpdate('940', initial=true);

// Declare and define variable for dropdown
const dropdown = d3.select("#selDataset");

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
* -----------------
* --- Functions ---
* -----------------
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
      
      // if initial is true
      if (initial) {
        // Add options to dropdown
        displayOptions(ids)
        // Draw initial plots
        initPlots(sampleId, sampleData)
      } else { // If not initial, just update plots
        updatePlots(sampleId, sampleData)
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
    // Append to html -> key: value
    metadataHtml += `<p><strong>${key}:</strong> ${sampleMetadata[key]}</p>`;
  }
  // Display html in metadata panel
  metadataPanel.html(metadataHtml);
}


function getTop10(sampleObject) {

}


function initPlots(idString, sample) {
  const top10 = getTop10(sample);


  let trace1 = {
    y: [], 
    x: [],
    type: 'bar',
    orientation: 'h'
  };
  let data = [trace1];
  let layout = {
    title : 'title'
  };
  let config = {
    responsive: true
  };
  Plotly.newPlot("bar", data, layout, config);

}

// This function is called when a dropdown menu item is selected
function updatePlots(idString, samplesObj) {
  // // Set values array
  // let data_update = {
  //   values: [Object.values(dataSet[country])]
  // };
  // let layout_update = {
  //   'title': `${country}'s 2017 Government Expenditure`
  // };
  // // Update both data and layout at the same time
  // Plotly.update('pie', data_update, layout_update);
}
