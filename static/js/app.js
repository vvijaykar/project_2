
//////////////////////////////
//////////// CREATE DROP DOWN FOR STATE FILTER 
//////////////////////////////
function init() {
  // Grab a reference to the dropdown select element
  var behaviorSelector = d3.select("#selBehavior");

  // Use the list of ST names to populate the select options
  d3.json("/behaviors").then((behaviorNames) => {
    behaviorNames.forEach((b) => {
        behaviorSelector
            .append("option")
            .text(b)
            .property("value", b);
        // console.log(b);
    });

    // Use the first ST from the list to build the initial plots
    const firstBehavior = behaviorNames[2];
    console.log(`First rendered: ${firstBehavior}`)
    renderHistogram(`${firstBehavior}`, `FES Present`);
    // buildCharts(firstSt);
    // buildMetadata(firstSt);
  });
}

init()

function optionChanged(newBehavior, FES) {
  // Clear data from existing html
  svg.html("")
  // Fetch new data each time a new sample is selected
  renderHistogram(`${newBehavior}`, `${FES}`)
};


