
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
    const firstBehavior = behaviorNames[0];
    console.log(`First rendered: ${firstBehavior}`)
    renderHistogram('CA', `${firstBehavior}`, `No FES Present`);
    // buildCharts(firstSt);
    // buildMetadata(firstSt);
  });
}

init()

function optionChanged(newBehavior) {
    // Fetch new data each time a new sample is selected
    renderHistogram('CA', `${newBehavior}`, `FES Present`)
};
// filterPercent('CA', 'Genuine Thank', 'FES Present')


// 1. initialize pg with first behavior/st
// 2. use drop down or filter selection to choose st
// 3. query data for that state
// 4. event listener if behavior is changed
// 5. event listener to toggle between FES Present and no fes present
// 6. function to build histogram
// 7. function for stats analysis of selected data
// 8. tooltip that summarizes each bin 


// // URL to access data by ST -- can replace AK with ${ST} for production
// // function to create endpoint for the specific state
// function createStateUrl(ST) {
//     var url = `/metadata/${ST}`
//     return url
// }

// // function to calculate total number of data points for given selection so we can calc percentages
// // function to get data from a specific state
// //////////////////////////////
// //////////// PULL DATA FOR CHART BY STATE 
// //////////////////////////////
// function filterPercent(ST, Behavior, FES) {
//     // Create endpoint to query data
//     var endpoint = createStateUrl(ST);
//     // Empty arrays to hold the data
//     var filteredScores = []
//     var cities = []
//     var stores = []
//     // pull data from json object
//     d3.json(endpoint).then(function(data) {
//         // console.log(data)

//         // iterate through the list of objects to find the percentages 
//         data.map((d, i) => {
//             if (d.Behavior === Behavior && d.FES === FES) {
//                     // get the score
//                     d.Percent = +d.Percent;
//                     var score = d.Percent
//                     filteredScores.push(score)
//                     // get the unique store
//                     var store = d.StoreID
//                     stores.push(store)
//                     // get the city
//                     var city = d.City
//                     cities.push(city)
//                     //Display data on the screen
//                     // console.log(`${city}: ${store}: ${formatPercent(score)}`)
//             }
//         })
//         // Avg all the values in the array together
//         // console.log(`Avg: ${formatPercent(avg(filteredScores))}`)
//     })

//     // Hold the filtered data so that the values are all in equally sized arrays
//     var filteredData = {
//         filteredScores: filteredScores,
//         cities: cities,
//         stores: stores
//     }
//     // Check it out on the console
//     console.log(filteredData);

//     return filteredData
// }
