//////////////////////////// A formatter for counts and percent
var formatPercent = d3.format(".1%");
var formatCount = d3.format(",.0f")

//////////////////////////// ADD VALUES IN AN ARRAY
// starting value = 0 (helper function for avg function below)
function sum(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += parseInt(arr[i])
    }
    return sum
}
//////////////////////////// FIND AVERAGE VALUES
function avg(arr) {
    var total = sum(arr);
    var denominator = arr.length;
    var avg = total/denominator;
    return formatPercent(avg)
}

//////////////////////////// X-SCALE
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
}
//////////////////////////// Y-SCALE
function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[chosenYAxis]) * 1.2])
    .range([height, 0]);
  
    return yLinearScale; 
}

//////////////////////////// ANALYSIS FUNCTIONS
// Function to find length/total data points for filtered array
function totalFesPresent(data, behavior) {
    var fesPresent = data.filter( function(d) { return (d.Behavior === behavior && d.FES === "FES Present") })
    fesPresent.forEach(function(d){
        d.Received = +d.Received
        d.Possible = +d.Possible
        d.Percent = +d.Percent
    })
    return fesPresent
}

function totalNoFesPresent(data, behavior) {
    var noFesPresent = data.filter( function(d) { return (d.Behavior === behavior && d.FES === "No FES Present") })
    return noFesPresent
}

function totalDataPoints(data, behavior) {
    var allFesData = data.filter( function(d) { return (d.Behavior === behavior) })
    return allFesData
}

