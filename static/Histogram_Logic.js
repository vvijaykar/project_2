// set the dimensions and margins of the graph
var margin = {top: 200, right: 30, bottom: 70, left: 500},
    width = 1600 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data



// A formatter for counts and percent
var formatCount = d3.format(",.0f")
var formatPercent = d3.format(".0%");

  // X axis: scale and draw:
  var x = d3.scaleLinear()
      .domain([0,105])
      .range([0, width]);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // set the parameters for the histogram
  var histogram = d3.histogram()
      .value(function(d) { return +d.Percent; })   // value to bin
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(21)); // numbers of bins

      
// Need logic for user input to select d.ST to be used in bins1 and bins2 below
// Need logic for user input to select d.Behavior to be used in bins1 and bins2 below
// Need logic for user input to select d.FES to be used in bins1 and bins2 below
  
// Set min and max so we can use a colorScale      
  // var yMax = d3.max()
  //     .value(function(d){return d.length});
  // var yMin = d3.min()
  //     .value(function(d){return d.length});
  // var colorScale = d3.scale.linear()
  //             .domain([yMin, yMax])
  //             .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

  
  // calculate total number of data points for given selection 
  var state_total_good = data.filter( function(d) { return (d.ST === "CA" && d.Behavior === "Genuine Thank" && d.FES === "Yes") })
  console.log(state_total_good.length)
   // calculate total number of data points for given selection but opposite FES
   var state_total_bad = data.filter( function(d) { return (d.ST === "CA" && d.Behavior === "Genuine Thank" && d.FES === "No") })
  console.log(state_total_bad.length)
   // calculate total number of data points for given selection less FES
   var state_total = data.filter( function(d) { return (d.ST === "CA" && d.Behavior === "Genuine Thank") })
  console.log(state_total.length)
  
  // Stats for state_total_good for hypothesis test
  var receivedGood = 0
  state_total_good.forEach(state => receivedGood += parseInt(state["Received"]))
  console.log(receivedGood)
  
  var possibleGood = 0
  state_total_good.forEach(state => possibleGood += parseInt(state["Possible"]))
  console.log(possibleGood)

  var statPercentGood = receivedGood / possibleGood
  console.log(statPercentGood)

  // Stats for state_total_bad for hypothesis test
  var receivedBad = 0
  state_total_bad.forEach(state => receivedBad += parseInt(state["Received"]))
  console.log(receivedBad)
  
  var possibleBad = 0
  state_total_bad.forEach(state => possibleBad += parseInt(state["Possible"]))
  console.log(possibleBad)

  var statPercentBad = receivedBad / possibleBad
  console.log(statPercentBad)

  // Stats for state_total for hypothesis test
  var received = 0
  state_total.forEach(state => received += parseInt(state["Received"]))
  console.log(received)
  
  var possible = 0
  state_total.forEach(state => possible += parseInt(state["Possible"]))
  console.log(possible)

  var statPercent = received / possible
  console.log(statPercent)

  // Hypothesis Test Calcs
  var stanDev = ((((statPercent)*(1-statPercent))/state_total_good.length) + (((statPercent)*(1-statPercent))/state_total_bad.length))**0.5
  console.log(stanDev)

  var zScore = ((statPercentGood - statPercentBad) - 0)/stanDev
  console.log(zScore)

  // Calculate significance with the assumption that n is large.
  if(zScore >= 1.96) {
      significant= 'significant'}
    else if (zScore <-1.96) {
      significant= 'significant'}
    else {significant= 'not significant'}


  // select rows with the desired filters
   var bins1 = histogram(data.filter( function(d) {return (d.ST === "CA" && d.Behavior === "Genuine Thank" && d.FES === "Yes") } ));

  // select rows with desired state and behavior but opposite FES
  var bins2 = histogram(data.filter( function(d) {return (d.ST === "CA" && d.Behavior === "Genuine Thank" && d.FES === "No") } ));

  // Y axis: scale and draw:
  var y = d3.scaleLinear()
      // .tickFormat(formatPercent)
      .range([height, 0]);
      y.domain([0, 1.25*d3.max(bins1, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  svg.append("g")
      .call(d3.axisLeft(y));

  // Y axis: scale and draw:
  var y2 = d3.scaleLinear()
      // .tickFormat(formatPercent)
      // .orient("right")
      .range([height, 0]);
      y2.domain([0, 1.25*d3.max(bins1, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  svg.append("g")
      .call(d3.axisRight(y2))
  // svg.axis().scale(y2).orient("right")
      ;
    // d3.svg.axis().scale(y1)
    // .orient("right").ticks(5)

  // Add a tooltip
    var tooltip = d3.select("#my_dataviz")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("color", "white")
      .style("border-radius", "5px")
      .style("padding", "10px")

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text 
    // and position of tooltip depending on the datapoint (d)
    var showTooltip = function(d) {
      tooltip
        .transition()
        .duration(100)
        .style("opacity", 1)
      tooltip
        .html("Range: " + d.x0 + " - " + d.x1)
        .style("left", (d3.mouse(this)[0]+20) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var moveTooltip = function(d) {
      tooltip
      .style("left", (d3.mouse(this)[0]+20) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
    }
    var hideTooltip = function(d) {
      tooltip
        .transition()
        .duration(100)
        .style("opacity", 0)
    }

  // append the bars for series 1
  var bar = svg.selectAll(".bar")
      .data(bins1)
      .enter()
      .append("g")
      .attr("class","bar")
      ;
      
  bar.append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "#69b3a2")
        .style("opacity", 0.6)
        // Show tooltip on hover
        .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip )
  
  // percents labels above bars      
  bar.append("text")
    .style("fill","black")
    .attr("dy", ".75em")
    .attr("y", -30)
    .attr("x", 15)
    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    .style ("fill", "red")
    .text(function(d) { if (d.length > 0) { 
      return formatPercent(d.length/state_total_good.length)
    }; 
    });

  // counts labels above bars 
    bar.append("text")
    .style("fill","black")
    .attr("dy", ".75em")
    .attr("y", -14)
    .attr("x", 18)
    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    .style ("fill", "blue")
    .text(function(d) { if (d.length > 0) { 
      return formatCount(d.length) 
    };
    });
  
  // now add titles to the axes
  svg.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ (-50) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
      .style ("font-size","20px")
      .style ("fill", "blue")
      .text("Number of Stores in Chosen State");

  svg.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ (width/2) +","+(height+(50))+")")  // centre below axis
      .style ("font-size","20px")
      .style ("fill", "black")
      .text("Average Observed Percentage of Selected Behavior");

  // Legend
  svg.append("circle").attr("cx",300).attr("cy",0).attr("r", 6).style("fill", "#69b3a2")
  svg.append("circle").attr("cx",300).attr("cy",20).attr("r", 6).style("fill", "#69b3a2")
  svg.append("circle").attr("cx",130).attr("cy",40).attr("r", 6).style("fill", "#404080")
  svg.append("text").attr("x", 320).attr("y", 0)
    .text(`Observed Behavior Percentage with FES: ${Math.round(10000*statPercentGood)/100}%.`)
    .style("font-size", "20px")
    .attr("alignment-baseline","middle")
  svg.append("text").attr("x", 320).attr("y", 20)
    .text(`Observed Behavior Percentage without FES: ${Math.round(10000*statPercentBad)/100}%.`)
    .style("font-size", "20px")
    .attr("alignment-baseline","middle")
  svg.append("text").attr("x", 150).attr("y", 40)
    .text(`The difference between FES and not FES is ${significant} at the 95% confident level (zScore = ${Math.round(100*zScore)/100}).`)
    .style("font-size", "20px").attr("alignment-baseline","middle")

});
