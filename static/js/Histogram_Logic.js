//////////////////////////// SVG DIMENSIONS
var svgWidth = 900;
var svgHeight = 500;
// set the dimensions and margins of the graph

var margin = {top: 20, right: 40, bottom: 100, left: 100},
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// x labels
var xlabelsGroup = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);


//////////////////////////////////////////////
// FUNCTION FOR Y-SCALE
//////////////////////////////////////////////
// Y axis: scale and draw:
function yScale(chosenBins) {
  var y = d3.scaleLinear()
  .range([height, 0])
  .domain([0, 1.25*d3.max(chosenBins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  return y
}
// Render new y axis
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

//////////////////////////////////////////////
// FUNCTION FOR PLOTTING BARS ON HISTOGRAM
//////////////////////////////////////////////
// function plotBars(bins1, selection, x, y, showTooltip, moveTooltip, hideTooltip) {
//   var bar = svg.selectAll(".bar")
//     .data(bins1)
//     .enter()
//     .append("g")
//     .attr("class","bar");
        
//   bar.append("rect")
//     .attr("x", 1)
//     .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
//     .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
//     .attr("height", function(d) { return height - y(d.length); })
//     .style("fill", "#69b3a2")
//     .style("opacity", 0.6)
//     // Show tooltip on hover
//     .on("mouseover", showTooltip )
//     .on("mousemove", moveTooltip )
//     .on("mouseleave", hideTooltip )
    
//   // percents labels above bars      
//   bar.append("text")
//     .style("fill","black")
//     .attr("dy", ".75em")
//     .attr("y", -30)
//     .attr("x", 15)
//     .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
//     .style ("fill", "red")
//     .text(function(d) { if (d.length > 0) { 
//       // return formatPercent(d.length/total_good.length)
//       return formatPercent(d.length/selection.length)
//     }; 
//     });

//   // counts labels above bars 
//   bar.append("text")
//     .style("fill","black")
//     .attr("dy", ".75em")
//     .attr("y", -14)
//     .attr("x", 18)
//     .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
//     .style ("fill", "blue")
//     .text(function(d) { if (d.length > 0) { 
//       return formatCount(d.length) 
//     };
//     });
// }

//////////////////////////////////////////////
// FUNCTION TO RENDER HISTOGRAM & ANALYSIS
//////////////////////////////////////////////
function renderHistogram(Behavior, FES) {
  var behavior = Behavior;
  var url = `/data/${behavior}`;

  // Grab all data from json
  d3.json(url).then(function(data){

       
    // Need logic for user input to select d.ST to be used in bins1 and bins2 below
    // Need logic for user input to select d.Behavior to be used in bins1 and bins2 below
    // Need logic for user input to select d.FES to be used in bins1 and bins2 below
    

    //////////////////////////////////////////////
    // ANALYSIS
    //////////////////////////////////////////////

    // calculate total number of data points for given selection 
    var total_good = totalFesPresent(data, behavior)
    console.log(`total datapts w/ FES Present: ${total_good.length}`)
    // console.log(total_good)
    // calculate total number of data points for given selection but opposite FES
    var total_bad = totalNoFesPresent(data, behavior)
    console.log(`total datapts w/o FES: ${total_bad.length}`)
    // calculate total number of data points for given selection less FES
    var total_combined = totalDataPoints(data, behavior)
    // console.log(state_total.length)
    console.log(`total combined: ${total_combined.length}`)
    
    // STATS FOR FES PRESENT
    var receivedGood = 0
    total_good.forEach(store => receivedGood += parseInt(store["Received"]))
    console.log(receivedGood)
    
    var possibleGood = 0
    total_good.forEach(store => possibleGood += parseInt(store["Possible"]))
    console.log(possibleGood)

    var statPercentGood = receivedGood / possibleGood
    console.log(`stat percent good ${statPercentGood}`)

    // STATS FOR NO FES PRESENT
    var receivedBad = 0
    total_bad.forEach(store => receivedBad += parseInt(store["Received"]))
    // console.log(receivedBad)
    
    var possibleBad = 0
    total_bad.forEach(store => possibleBad += parseInt(store["Possible"]))
    // console.log(possibleBad)

    var statPercentBad = receivedBad / possibleBad
    console.log(`stat percent bad ${statPercentBad}`)

    // STATS FOR COMBINED FES PRESENT AND NO FES PRESENT
    var received = 0
    total_combined.forEach(store => received += parseInt(store["Received"]))
    // console.log(received)
    
    var possible = 0
    total_combined.forEach(store => possible += parseInt(store["Possible"]))
    // console.log(possible)

    var statPercent = received / possible
    console.log(`stat percent total combined ${statPercent}`)

    // Hypothesis Test Calcs
    var stanDev = ((((statPercent)*(1-statPercent))/total_good.length) + (((statPercent)*(1-statPercent))/total_bad.length))**0.5
    console.log(`stdev: ${stanDev}`)

    var zScore = ((statPercentGood - statPercentBad) - 0)/stanDev
    console.log(`zscore: ${zScore}`)

    // Calculate significance with the assumption that n is large.
    if(zScore >= 1.96) {
        significant= 'significant'}
    else if (zScore <-1.96) {
        significant= 'significant'}
    else {significant= 'not significant'}

    
    //////////////////////////////////////////////
    // PLOTTING HISTOGRAM
    //////////////////////////////////////////////

    // X axis: scale and draw:
    var x = d3.scaleLinear()
    .domain([0,105])
    .range([0, width]);
    
    // add x-axis to svg
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Create the histogram format
    var histogram = d3.histogram()
    .value(d => {return +d.Percent*100})   // value to bin
    .domain(x.domain())  // then the domain of the graphic
    .thresholds(x.ticks(21)); // numbers of bins

    // Determines whether the histogram should plot FES Present data vs No FES Present data
    if (FES == "FES Present") {
      var selection = total_good;
    }
    else {
      var selection = total_bad;
    }

    // Create histogram based on FES Present data vs No FES Present data
    var bins1 = histogram(selection);
    
    // create y scale & y axis
    var y = yScale(bins1);
    svg.append("g")
      .call(d3.axisLeft(y))

    // // Add a tooltip
    //   var tooltip = d3.select("#my_dataviz")
    //     .append("div")
    //     .style("opacity", 0)
    //     .attr("class", "tooltip")
    //     .style("background-color", "black")
    //     .style("color", "white")
    //     .style("border-radius", "5px")
    //     .style("padding", "10px")

    //   // A function that change this tooltip when the user hover a point.
    //   // Its opacity is set to 1: we can now see it. Plus it set the text 
    //   // and position of tooltip depending on the datapoint (d)
    //   var showTooltip = function(d) {
    //     tooltip
    //       .transition()
    //       .duration(100)
    //       .style("opacity", 1)
    //     tooltip
    //       .html("Range: " + d.x0 + " - " + d.x1)
    //       .style("left", (d3.mouse(this)[0]+2) + "px")
    //       .style("top", (d3.mouse(this)[1]) + "px")
    //   }
    //   var moveTooltip = function(d) {
    //     tooltip
    //     .style("left", (d3.mouse(this)[0]+2) + "px")
    //     .style("top", (d3.mouse(this)[1]) + "px")
    //   }
    //   var hideTooltip = function(d) {
    //     tooltip
    //       .transition()
    //       .duration(100)
    //       .style("opacity", 0)
    //   }

    // var bars = plotBars(bins1, selection, x, y, showTooltip, moveTooltip, hideTooltip);

    // append the bars for series 1
    var bar = svg.selectAll(".bar")
        .data(bins1)
        .enter()
        .append("g")
        .attr("class","bar");
        
    bar.append("rect")
          .attr("x", 1)
          .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
          .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", "#69b3a2")
          .style("opacity", 0.6)
          // Show tooltip on hover
          // .on("mouseover", showTooltip )
          // .on("mousemove", moveTooltip )
          // .on("mouseleave", hideTooltip )
    
    // percents labels above bars      
    bar.append("text")
      .style("fill","black")
      .attr("dy", ".75em")
      .attr("y", -30)
      .attr("x", 10)
      .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      .style ("fill", "red")
      .text(function(d) { if (d.length > 0) { 
        return formatPercent(d.length/selection.length)
      }; 
      });

    // counts labels above bars 
      bar.append("text")
      .style("fill","black")
      .attr("dy", ".75em")
      .attr("y", -14)
      .attr("x", 10)
      .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      .style ("fill", "blue")
      .text(function(d) { if (d.length > 0) { 
        return formatCount(d.length) 
      };
      });
    //////////////////////////// Axis labels //////////////////////////
    //////////////////////////// Y AXIS LABEL
    // now add titles to the axes
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (-50) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .style ("font-size","20px")
        .style ("fill", "blue")
        .text("Number/Percent of Stores");

    //////////////////////////// X AXIS LABELS
      var xlabelsGroup = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
      var fesPresentLabel = xlabelsGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "FES Present") // value to grab for event listener
        // .classed("active", true)
        .text("Average Time Selected Behavior is Observed when FES Present");
    
      var noFesPresentLabel = xlabelsGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "No FES Present") // value to grab for event listener
        // .classed("inactive", true)
        .text("Average Time Selected Behavior is Observed when No FES Present");

    // Legend
    svg.append("circle").attr("cx",width/15).attr("cy",0).attr("r", 6).style("fill", "#69b3a2")
    svg.append("circle").attr("cx",width/15).attr("cy",20).attr("r", 6).style("fill", "#69b3a2")
    svg.append("circle").attr("cx",width/15).attr("cy",40).attr("r", 6).style("fill", "#404080")
    svg.append("text").attr("x", width/13).attr("y", 0)
      .text(`Average Percent of Time ${behavior} Demonstrated if FES Present: ${formatPercent(statPercentGood)}.`)
      .style("font-size", "15px")
      .attr("alignment-baseline","middle")
    svg.append("text").attr("x", width/13).attr("y", 20)
      .text(`Average Percent of Time ${behavior} Demonstrated if No FES Present: ${formatPercent(statPercentBad)}.`)
      .style("font-size", "15px")
      .attr("alignment-baseline","middle")
    svg.append("text").attr("x", width/13).attr("y", 40)
      .text(`The difference in performance with and without FES is ${significant} at the 95% confident level (zScore = ${Math.round(100*zScore)/100}).`)
      .style("font-size", "15px").attr("alignment-baseline","middle")
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////// X AXIS LABELS EVENT LISTENER TO CHANGE FROM FES PRESENT TO NO FES PRESENT ////////////////
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        ////X AXIS get value of selection 
        var xValue = d3.select(this).attr("value");
        console.log(`behavior: ${behavior}`)
        // Changes the FES selection if opposite xlabel is clicked
        if (xValue !== FES) {

          // replaces chosenXAxis with value
          FES = xValue;

          console.log(`New FES Selection: ${FES}`)
          
          // Clear data from existing html
          svg.html("")

          // Render the histogram again based on behavior and new fes selection
          histogram = renderHistogram(`${behavior}`, `${FES}`)
          

          // Changes the formatting/class of the xlabel text
          if (FES === "No FES Present") {
            fesPresentLabel
              .classed("active", false)
              .classed("inactive", true);
            noFesPresentLabel
              .classed("active", true)
              .classed("inactive", false);
          }
          else if (FES === "No FES Present") {
            fesPresentLabel
              .classed("active", true)
              .classed("inactive", false);
            noFesPresentLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }
      });

  });
};


////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// ANALYSIS FOR EACH BEHAVIOR //////////////////////////////////////
// var behaviorUrl = "/behaviors"
// // determine significance for each behavior
// d3.json(behaviorUrl).then(function(behavior){

//   behavior.forEach(function(b) {
//     var behaviorData = `/data/${b}`

//     d3.json(behaviorData).then(function(data) {
//       // calculate total number of data points for given selection 
//       var total_good = totalFesPresent(data, b)
//       console.log(`total datapts w/ FES Present: ${total_good.length}`)
//       // console.log(total_good)
//       // calculate total number of data points for given selection but opposite FES
//       var total_bad = totalNoFesPresent(data, b)
//       console.log(`total datapts w/o FES: ${total_bad.length}`)
//       // calculate total number of data points for given selection less FES
//       var total_combined = totalDataPoints(data, b)
//       // console.log(state_total.length)
//       console.log(`total combined: ${total_combined.length}`)

//       // Stats for state_total_good for hypothesis test
//       var receivedGood = 0
//       total_good.forEach(store => receivedGood += parseInt(store["Received"]))
//       console.log(receivedGood)

//       var possibleGood = 0
//       total_good.forEach(store => possibleGood += parseInt(store["Possible"]))
//       console.log(possibleGood)

//       var statPercentGood = receivedGood / possibleGood
//       // console.log(statPercentGood)

//       // Stats for state_total_bad for hypothesis test
//       var receivedBad = 0
//       total_bad.forEach(store => receivedBad += parseInt(store["Received"]))
//       // console.log(receivedBad)

//       var possibleBad = 0
//       total_bad.forEach(store => possibleBad += parseInt(store["Possible"]))
//       // console.log(possibleBad)

//       var statPercentBad = receivedBad / possibleBad
//       // console.log(statPercentBad)

//       // Stats for state_total for hypothesis test
//       var received = 0
//       total_combined.forEach(store => received += parseInt(store["Received"]))
//       // console.log(received)

//       var possible = 0
//       total_combined.forEach(store => possible += parseInt(store["Possible"]))
//       // console.log(possible)

//       var statPercent = received / possible
//       // console.log(statPercent)

//       // Hypothesis Test Calcs
//       var stanDev = ((((statPercent)*(1-statPercent))/total_good.length) + (((statPercent)*(1-statPercent))/total_bad.length))**0.5
//       console.log(`stdev: ${stanDev}`)

//       var zScore = ((statPercentGood - statPercentBad) - 0)/stanDev
//       console.log(`zscore: ${zScore}`)

//       var analysis = d3.select(".article")
//       // .append("p")
//       // Calculate significance with the assumption that n is large.
//       if(zScore >= 1.96) {
//           significant= 'significant'
//           analysis.append("html")
//             .html(`<b>${b}</b> <br>When FES Present: ${formatPercent(statPercentGood)}. 
//               <br> When No FES Present: ${formatPercent(statPercentBad)}. 
//               <br> At the 95% confident level (zScore = ${Math.round(100*zScore)/100}).`)
//       }
//       else if (zScore <-1.96) {
//           significant= 'significant'
//           analysis.append("html")
//             .html(`<b>${b}</b> <br>When FES Present: ${formatPercent(statPercentGood)}. 
//               <br> When No FES Present: ${formatPercent(statPercentBad)}. 
//               <br> At the 95% confident level (zScore = ${Math.round(100*zScore)/100}).`)
//       }
//       else {significant= 'not significant'
//         analysis.append("html")
//         .html(`<b>NOT SIGNIFICANT: ${b}</b> <br>When FES Present: ${formatPercent(statPercentGood)}. 
//           <br> When No FES Present: ${formatPercent(statPercentBad)}. 
//           <br> At the 95% confident level (zScore = ${Math.round(100*zScore)/100}).`)
//       }
      
      
//     });
//     })
//   })
    

  