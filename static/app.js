// A formatter for counts and percent
var formatCount = d3.format(",.0f")
var formatPercent = d3.format(".1%");

// function to avg values in an array, starting value = 0
function avg(arr) {
    var sum = arr.reduce((a, b) => a + b, 0);
    var length = arr.length;
    return sum/length
}

// URL to access data by ST -- can replace AK with ${ST} for production
// function to create endpoint for the specific state
function createStateUrl(ST) {
    var url = `/metadata/${ST}`
    return url
}

// function to calculate total number of data points for given selection so we can calc percentages
// function to get data from a specific state
//////////////////////////////
//////////// PULL DATA FOR CHART BY STATE 
//////////////////////////////
function filterPercent(ST, Behavior, FES) {
    // Create endpoint to query data
    var endpoint = createStateUrl(ST);
    // Empty arrays to hold the data
    var filteredScores = []
    var cities = []
    var stores = []
    // pull data from json object
    d3.json(endpoint).then(function(data) {
        // console.log(data)

        // iterate through the list of objects to find the percentages 
        data.map((d, i) => {
            if (d.Behavior === Behavior && d.FES === FES) {
                    // get the score
                    d.Percent = +d.Percent;
                    var score = d.Percent
                    filteredScores.push(score)
                    // get the unique store
                    var store = d.StoreID
                    stores.push(store)
                    // get the city
                    var city = d.City
                    cities.push(city)
                    //Display data on the screen
                    // console.log(`${city}: ${store}: ${formatPercent(score)}`)
            }
        })
        // Avg all the values in the array together
        // console.log(`Avg: ${formatPercent(avg(filteredScores))}`)
    })
<<<<<<< HEAD

    // Hold the filtered data so that the values are all in equally sized arrays
    var filteredData = {
        filteredScores: filteredScores,
        cities: cities,
        stores: stores
    }
    // Check it out on the console
    console.log(filteredData);

    return filteredData
}

//////////////////////////////
//////////// CREATE DROP DOWN FOR STATE FILTER 
//////////////////////////////
function init() {
  // Grab a reference to the dropdown select element
  var stSelector = d3.select("#selST");

  // Use the list of ST names to populate the select options
  d3.json("/states").then((stNames) => {
    stNames.forEach((st) => {
        stSelector
            .append("option")
            .text(st)
            .property("value", st);
        console.log(st);
    });

    // Use the first ST from the list to build the initial plots
    const firstSt = stNames[0];
    console.log(`First rendered: ${firstSt}`)
    // buildCharts(firstSt);
    // buildMetadata(firstSt);
  });
}

// init()
// filterPercent('CA', 'Genuine Thank', 'FES Present')
=======
    // Add all the values in the array together
    var sumFesScores = sum(fesScores)

    //Display results
    console.log(`Total: ${sumFesScores}`)
    console.log(`Denominator: ${fesScores.length}`)
    console.log(`Avg: ${formatPercent(sumFesScores/fesScores.length)}`)
    console.log(fesScores)

})
>>>>>>> 74689506bf77dceb18f8718bc571be1d4f3d43a4
