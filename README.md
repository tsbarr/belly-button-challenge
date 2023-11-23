# Module 14 Challenge

**See result GitHub Pages:** [https://tsbarr.github.io/belly-button-challenge/](https://tsbarr.github.io/belly-button-challenge/)

## Background

In this assignment, you will build an interactive dashboard to explore the [Belly Button Biodiversity dataset](https://robdunnlab.com/projects/belly-button-biodiversity/), which catalogs the microbes that colonize human navels.

The dataset reveals that a small handful of microbial species (also called operational taxonomic units, or OTUs, in the study) were present in more than 70% of people, while the rest were relatively rare.

## Instructions

Complete the following steps:

1. Use the D3 library to read in `samples.json` from the URL `https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json`.

2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.

    - Use `sample_values` as the values for the bar chart.

    - Use `otu_ids` as the labels for the bar chart.

    - Use `otu_labels` as the hovertext for the chart.

    ![https://static.bc-edx.com/data/dl-1-2/m14/lms/img/hw01.jpg](https://static.bc-edx.com/data/dl-1-2/m14/lms/img/hw01.jpg)

    > **Requirements (30 points)**  
    > 
    > - Chart initializes without error (10 points)
    > 
    > - Chart updates when a new sample is selected (5 points)
    > 
    > - Chart uses Top 10 sample values as values (5 points)
    > 
    > - Chart uses `otu_ids` as the labels (5 points)
    > 
    > - Chart uses `otu_labels` as the tooltip (5 points)

1. Create a bubble chart that displays each sample.

    - Use `otu_ids` for the x values.

    - Use `sample_values` for the y values.

    - Use `sample_values` for the marker size.

    - Use `otu_ids` for the marker colors.

    - Use `otu_labels` for the text values.

    ![https://static.bc-edx.com/data/dl-1-2/m14/lms/img/bubble_chart.jpg](https://static.bc-edx.com/data/dl-1-2/m14/lms/img/bubble_chart.jpg)

    > **Requirements (40 points)**  
    > 
    > - Chart initializes without error (10 points)
    > 
    > - Chart updates when a new sample is selected (5 points)
    > 
    > - Chart uses `otu_ids` for the x values (5 points)
    > 
    > - Chart uses `otu_ids` for marker colors (5 points)
    > 
    > - Chart uses `sample_values` for the y values (5 points)
    > 
    > - Chart uses `sample_values` for the marker size (5 points)
    > 
    > - Chart uses `otu_labels` for text values (5 points)

2. Display the sample metadata, i.e., an individual's demographic information.

3. Display each key-value pair from the metadata JSON object somewhere on the page.

    ![https://static.bc-edx.com/data/dl-1-2/m14/lms/img/hw03.jpg](https://static.bc-edx.com/data/dl-1-2/m14/lms/img/hw03.jpg)

    > **Requirement (10 points)**  
    > 
    > - Metadata initializes without error.

4. Update all the plots when a new sample is selected. Additionally, you are welcome to create any layout that you would like for your dashboard. An example dashboard is shown as follows:

    ![https://static.bc-edx.com/data/dl-1-2/m14/lms/img/hw02.jpg](https://static.bc-edx.com/data/dl-1-2/m14/lms/img/hw02.jpg)

    > **Requirement (10 points)**  
    > 
    > - Metadata updates when a new sample is selected.

5. Deploy your app to a free static page hosting service, such as GitHub Pages. Submit the links to your deployment and your GitHub repo. Ensure that your repository has regular commits and a thorough README.md file

    > **Requirement (10 points)**  
    > 
    > - App Successfully Deployed to Github Pages.

## Advanced Challenge Assignment (Optional with no extra points earning)

The following task is advanced and therefore optional.

- Adapt the Gauge Chart from [https://plot.ly/javascript/gauge-charts/](https://plot.ly/javascript/gauge-charts/) to plot the weekly washing frequency of the individual.

- You will need to modify the example gauge code to account for values ranging from 0 through 9.

- Update the chart whenever a new sample is selected.

    ![https://static.bc-edx.com/data/dl-1-2/m14/lms/img/gauge.jpg](https://static.bc-edx.com/data/dl-1-2/m14/lms/img/gauge.jpg)

## Hints

- Use `console.log` inside of your JavaScript code to see what your data looks like at each step.

- Refer to the [Plotly.js documentation](https://plotly.com/javascript/) when building the plots.

---

## References
Hulcr, J. et al. (2012) *A Jungle in There: Bacteria in Belly Buttons are Highly Diverse, but Predictable.* Retrieved from: [http://robdunnlab.com/projects/belly-button-biodiversity/results-and-data/](http://robdunnlab.com/projects/belly-button-biodiversity/results-and-data/)

Challenge instructions and starter files, as well as some code sections that were adapted from the UofT SCS EdX Data Bootcamp class activities:

© 2022 edX Boot Camps LLC. Confidential and Proprietary. All Rights Reserved.

Some other code sections were adapted from other sources, specific explanations are found within the code comments.
