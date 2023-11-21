// Read in data


// based on this answer: https://stackoverflow.com/a/14220323
async function getData() {
    const samplesUrl = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';
    const samplesData = await d3.json(samplesUrl);
    console.log(samplesData)
    return samplesData
};

console.log(getData());
