//////////////////////////// Chart Dimensions //////////////////////////
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//////////////////////////// SVG wrapper, append an SVG group that will hold chart //////////////////////////
// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//////////////////////////// Initial Params//////////////////////////
var chosenXAxis = "FES Present";
var chosenYAxis = "Associate Appearance";

//////////////////////////// Functions for x and y axis //////////////////////////
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

//////////////////////////// Updating axis depending on which is clicked //////////////////////////
// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

//////////////////////////// Circle Transitions //////////////////////////
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

//////////////////////////// Circle State Name Transitions //////////////////////////

function renderLabels(labelsGroup, chosenXAxis, chosenYAxis, newXScale, newYScale) {

  labelsGroup.transition()
    .duration(1000)
    // .append("text")
    .attr("dx", d => newXScale(d[chosenXAxis]))
    .attr("dy", d => newYScale(d[chosenYAxis]))

  return labelsGroup
}
//////////////////////////// Functions for Tooltip //////////////////////////
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    // Labels for x axis
    if (chosenXAxis === "poverty") {
        var xlabel = "In Poverty (%):";
    }
    else if (chosenXAxis === "income") {
        var xlabel = "Household Income (Median):"
    }
    else {
        var xlabel = "Age (Median):";
    }
    // Labels for y axis
    if (chosenYAxis === "healthcare") {
        var ylabel = "Lacks Healthcare (%):";
    }
    else if (chosenYAxis === "smokes") {
        var ylabel = "Smokes (%):"
    }
    else {
        var ylabel = "Obese (%):";
    }
    // Create tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
        return (`<strong>${d.state}</strong><br>${xlabel} ${d[chosenXAxis]} <br>${ylabel} ${d[chosenYAxis]} `);
        });

    circlesGroup.call(toolTip);
    // Event listener for tooltip
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
    toolTip.hide(data);
    });

  return circlesGroup;
}

var url = `/data`;
//////////////////////////// Functions for Extracting data and visualization //////////////////////////
// Retrieve data from the CSV file and execute everything below
d3.json(url).then(function(data) {

  // parse data
  data.forEach(function(d) {
    d.Received = +d.Received,
    d.Possible = +d.Possible
    d.Percent = +d.Percent});

    //////////////////////////// Setting X and Y Scale/Axis //////////////////////////
  var xLinearScale = xScale(data, chosenXAxis);
  var yLinearScale = yScale(data, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale).ticks();
  var leftAxis = d3.axisLeft(yLinearScale).ticks();

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("aText", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("aText", true)
    .call(leftAxis);

  //////////////////////////// Add initial circles //////////////////////////
  var circlesGroup = chartGroup.selectAll("circle")
    .attr('transform',' translate(0,5)')
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("value", d => d.abbr)
    .attr("class", "stateCircle")

    ////////////////////////// Add labels to circles based on the tags that were added ////////////////////
  var labelsGroup = chartGroup.selectAll("foo")
    .attr('transform', 'translate(0.5)')
    .data(data)
    .enter()
    .append("text")
    .classed("stateText", true)
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]))
    .text(function(d) { return d.abbr });

  //////////////////////////// Axis labels //////////////////////////
  //////////////////////////// X AXIS
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

 var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

    //////////////////////////// Y AXIS
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", `rotate(-90)`);

    var healthcareLabel = ylabelsGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("active", true)
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)");

    var obesityLabel = ylabelsGroup.append("text")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("inactive", true)
        .attr("value", "obesity")
        .text("Obese (%)");

    var smokesLabel = ylabelsGroup.append("text")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("inactive", true)
        .attr("value", "smokes")
        .text("Smokes (%)");

  //////////////////////////// Tooltip Function //////////////////////////
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  //////////////////////////// X AXIS LABELS EVENT LISTENER //////////////////////////
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      ////X AXIS get value of selection 
      var xValue = d3.select(this).attr("value");
      if (xValue !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = xValue;

        console.log(`New X Axis: ${chosenXAxis}`)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);
        
        // render the state labels on each circle
        labelsGroup = renderLabels(labelsGroup, chosenXAxis, chosenYAxis, xLinearScale, yLinearScale);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
            povertyLabel
                .classed("active", true)
                .classed("inactive", false);
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else if (chosenXAxis === "age") {
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            ageLabel
                .classed("active", true)
                .classed("inactive", false);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else {
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", true)
                .classed("inactive", false);
        }
      }

    });
    //////////////////////////// Y AXIS LABELS EVENT LISTENER //////////////////////////
    ylabelsGroup.selectAll("text")
        .on("click", function() {
    /// Y AXIS get value of selection
        var yValue = d3.select(this).attr("value");
        if (yValue !== chosenYAxis) {

            // replaces chosenYAxis with value
            chosenYAxis = yValue;

            console.log(`New Y Axis: ${chosenYAxis}`)

            // functions here found above csv import
            // updates y scale for new data
            yLinearScale = yScale(data, chosenYAxis);

            // updates y axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

            // updates circles with new y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // render the state labels on each circle
            labelsGroup = renderLabels(labelsGroup, chosenXAxis, chosenYAxis, xLinearScale, yLinearScale);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenYAxis === "healthcare") {
                healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenYAxis === "obesity") {
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
    });
});
