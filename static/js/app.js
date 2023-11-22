// Declare variables
const url =
  'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'


// Run initial function
initOrUpdate('940', initial=true);

// Listen for change in dropdown option
d3.select("#selDataset").on("change", 
  // when dropdrown changes
  () => {
    // Get value of selected id
    let newId = d3.select("#selDataset").property("value");
    // Update page
    initOrUpdate(newId, initial=false);
  }
);

// --- Functions ---
// Function that will display metadata and plots for selected id
// If initial=true, it also sets the dropdown options
function initOrUpdate(selectedId, initial) {
  d3.json(url).then(
    // if promise is fulfilled:
    (data) => handleData(selectedId, data, initial),
    // if promise is rejected:
    () => { console.log('data failed to load') });
}

function handleData(sampleId, dataSet, initial=false) {
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
      } else { // Otherwise, just update plots
        updatePlots(sampleId, sampleData)
      }
      // Finally, display metadata
      displayMetadata(sampleId, sampleMetadata);
    }
  }
}

function displayOptions(idObject) {
  // add options to selectElement
  let options = '';
  // how to use for...of loops: https://www.w3schools.com/js/js_loop_forof.asp
  for (const id of idObject) {
    // Append to options
    options += `<option value = "${id}">${id}</option>`;
  }
  d3.select('#selDataset').html(options);
}

function displayMetadata(idString, metadata) {
  const metadataPanel = d3.select('#sample-metadata');
  let metadataHtml = '';
  console.log('Displaying metadata for id: ' + idString);
  const theKeys = Object.keys(metadata)
  const theValues = Object.values(metadata)

  for (let j = 0; j < theKeys.length; j++) {
    let theIndex = theKeys[j];
    let theValue = theValues[j];
    metadataHtml += `<p><strong>${theIndex}:</strong> ${theValue}</p>`;
  }

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
  Plotly.newPlot("plotArea", data, layout, config);

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
