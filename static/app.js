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
var metadataURL = `/metadata/AK`

// function to calculate total number of data points for given selection so we can calc percentages
d3.json(metadataURL).then(function(data) {
    // console.log(data)
    var fesScores = []
    data.map((d, i) => {
        if (d.Behavior === "Genuine Thank" && d.FES === "No FES Present") {
                d.Percent = +d.Percent;
                var score = d.Percent
                fesScores.push(score)
                console.log(score)
        }
    })
    // Add all the values in the array together
    var sumFesScores = sum(fesScores)

    //Display results
    console.log(`Total: ${sumFesScores}`)
    console.log(`Denominator: ${fesScores.length}`)
    console.log(`Avg: ${formatPercent(sumFesScores/fesScores.length)}`)
    console.log(fesScores)

})