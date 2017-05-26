// Sven Guijt, student nr. 10597751
// Data Processing, Minor Programmeren, UvA

// Create margins on each side and calculate appropriate width and height
var margin = {top: 30, right: 50, bottom: 40, left: 50},
    width = 920 - margin.left - margin.right,
    height = 590 - margin.top - margin.bottom;

// Set x scale for months
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

// Set y scale for rain data
var y = d3.scale.linear()
    .range([height, 0]);

var y2 = d3.scale.linear()
    .range([height, 0]);

// Create x axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// Create y axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var yAxis2 = d3.svg.axis()
    .scale(y2)
    .orient("right");

// Create variable chart by selecting chart class from html file
var chart = d3.select(".chart")

    // Attribute width and height to chart
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load data from JSON data file and declare x- and y domain
d3.json("JSONtotaldata.json", function(data) {
  x.domain(["LifeExp","WaterQ", "Safe", "EmpRate"]);
  y.domain([0, 100]);
  y2.domain([0, 10]);

  // Append x axis to chart
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // Append y axis to chart, including legend
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Percentage (%)");

    chart.append("g")
      .attr("class", "y axis 2")
      .attr("transform", "translate(" + width + " ,0)")
      .call(yAxis2)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -12)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Score (1-10)");


  // Create bars and calculate height for each
  chart.append("rect")
      .attr("class", "bar")
      .attr("x", x("LifeExp"))
      .attr("y", y(data.ISR.LifeExp))
      .attr("height", function(d) { return height - y(data.ISR.LifeExp); })
      .attr("width", x.rangeBand());

  chart.append("rect")
    .attr("class", "bar")
    .attr("x", x("WaterQ"))
    .attr("y", y(data.ISR.WaterQ))
    .attr("height", function(d) { return height - y(data.ISR.WaterQ); })
    .attr("width", x.rangeBand());

  chart.append("rect")
    .attr("class", "bar")
    .attr("x", x("Safe"))
    .attr("y", y(data.ISR.Safe))
    .attr("height", function(d) { return height - y(data.ISR.Safe); })
    .attr("width", x.rangeBand());

  chart.append("rect")
    .attr("class", "bar")
    .attr("x", x("EmpRate"))
    .attr("y", y(data.ISR.EmpRate))
    .attr("height", function(d) { return height - y(data.ISR.EmpRate); })
    .attr("width", x.rangeBand());

      console.log(data.ISR.LifeExp)



});