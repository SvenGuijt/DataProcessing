// Sven Guijt, student nr. 10597751
// Data Processing, Minor Programmeren, UvA

// Define margins
var margin = {top: 20, right: 80, bottom: 50, left: 100},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// Define x-scale
var x = d3.scale.linear()
  .range([0, width]);

// Define y-scale
var y = d3.scale.linear()
  .range([height, 0]);

// Initiate colors
var color = d3.scale.category10();

// Make x-axis
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

// Make y-axis
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

// Create svg-element and define height and width
var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create tooltip-element
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:Black'>" + d.Country + "</span>";
  })

// Link tooltip to svg
svg.call(tip);

// Read in data for scatter plot
d3.tsv("ScatterData60.tsv", function(error, data) {
if (error) throw error;

// Change TSV string into number format
data.forEach(function(d) {
  d.gdpPerson = +d.gdpPerson;
  d.EmploymentPop = +d.EmploymentPop;
});

// Set domains for x and y
x.domain(d3.extent(data, function(d) { return d.EmploymentPop; })).nice();
y.domain(d3.extent(data, function(d) { return d.gdpPerson; })).nice();

// Create x-axis element
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", 40)
    .style("text-anchor", "end")
    .text("Employment to population (15+) ratio");

// Create y-axis element
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", -88)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("GDP per person")

// Create dots for scatter plot:
// Labor dependent size of dots is also given in comment line (94),
// but for layout reasons is not chosen for. 
svg.selectAll(".dot")
    .data(data)
  .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 3.5)
    //.attr("r", function(d) { return d.Labor * 0.00000005; })
    .attr("cx", function(d) { return x(d.EmploymentPop); })
    .attr("cy", function(d) { return y(d.gdpPerson); })
    .style("fill", function(d) { return color(d.Continent); })
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide)

// Create legend element
var legend = svg.selectAll(".legend")
    .data(color.domain())
  .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

// Create color rectangles
legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

// Create continent descriptions for colors
legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });
});