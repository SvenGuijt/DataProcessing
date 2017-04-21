// Sven Guijt, student nr. 10597751
// Data Processing, Minor Programmeren, UvA

// Create margins on each side and calculate appropriate width and height
var margin = {top: 30, right: 40, bottom: 40, left: 50},
    width = 920 - margin.left - margin.right,
    height = 590 - margin.top - margin.bottom;

// Set x scale for months
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

// Set y scale for rain data
var y = d3.scale.linear()
    .range([height, 0]);

// Create x axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// Create y axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// Create variable chart by selecting chart class from html file
var chart = d3.select(".chart")

    // Attribute width and height to chart
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load data from JSON data file and declare x- and y domain
d3.json("JSONDATA.json", function(data) {
  x.domain(data.map(function(d) { return d.Month; }));
  y.domain([0, d3.max(data, function(d) { return d.Rain; })]);

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
      .text("Total rain (mm)");

  // Create bars and calculate height for each
  chart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Month); })
      .attr("y", function(d) { return y(d.Rain); })
      .attr("height", function(d) { return height - y(d.Rain); })
      .attr("width", x.rangeBand());
});