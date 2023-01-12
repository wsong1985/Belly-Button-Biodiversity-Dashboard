function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  })
}


// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var sample_array = data.samples;

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var selected_sample = sample_array.filter(item => item.id === sample);

    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var selected_metadata = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var first_sample = selected_sample[0];
    console.log("first sample: ",first_sample.otu_ids);

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var first_metadata = selected_metadata[0];
    console.log("first metadata: ", first_metadata);

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var firstsample_otu_ids = first_sample.otu_ids;
    var firstsample_otu_labels = first_sample.otu_labels;
    var firstsample_sample_values = first_sample.sample_values;

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wfreq = parseInt(first_metadata.wfreq);
    console.log("the washing frequency: ", wfreq);

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = [];
    firstsample_otu_ids.slice(0,10).reverse().map(item => yticks.push("OTU " + `${item}`));

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
        x: firstsample_sample_values.slice(0,10).reverse(),
        y: yticks,
        text: firstsample_otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
    }];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found"
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    var desired_maximum_marker_size = 40;
    var bubbleData = [{
        x: firstsample_otu_ids,
        y: firstsample_sample_values,
        mode: 'markers',
        marker: {
          symbol: 'circle',
          color: firstsample_otu_ids,
          size: firstsample_sample_values,
          colorscale: firstsample_sample_values,
          sizemode: 'area',
          sizeref: 2 * firstsample_sample_values /(desired_maximum_marker_size**2)
        },
        text:  firstsample_otu_labels,
        type: 'scatter'
    }];

    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      margin: {
        l: 40,
        r: 40,
        t: 40,
        b: 40
      },
      hovermode: 'closest'
    };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout);

    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeData = [{
        value: wfreq,
        type: 'indicator',
        mode: 'gauge+number',
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2,4], color: "orange"},
            { range: [4,6], color: "yellow"},
            { range:[6,8], color: "lightgreen"},
            { range: [8, 10], color: "green" }
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 1,
            value: 10
        }
      }
    }];

    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugelayout = {
      width: 450,
      height: 350,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "darkblue", family: "Arial" }
    };

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugelayout);
  });
}
