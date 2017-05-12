//Sven Guijt, studentnummer 10597751
//Data Processing, Minor Programmeren, UvA

// Define svg element and set margins
var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create variable to parse time
var parseTime = d3.timeParse("%Y%m%d");

// Create scales for x,y axes
var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

// Set line drawing function
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.humidMean); });

// Attributes for drawing circles
var circleAttrs = {
	  cx: function(d) { return xScale(d.x); },
	  cy: function(d) { return yScale(d.y); },
	  r: 5
	};

// Read in data from json data file
d3.json("JSONDATAweek5.json", type, function(error, data) {
  if (error) throw error;

// This variable contains a mapping of the data
  var humidities = data.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {date: d.date, humidity: d[id]};
      })
    };
  });

// Set the x domain attribute
  x.domain(d3.extent(data, function(d) { return d.date; }));

// Set the y domain attribute
  y.domain([
    d3.min(humidities, function(c) { return d3.min(c.values, function(d) { return d.humidMin; }); }),
    d3.max(humidities, function(c) { return d3.max(c.values, function(d) { return d.humidMax; }); })
  ]);

// Set the z domain attribute
  z.domain(humidities.map(function(c) { return c.id; }));

// Create x axis
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

// Create y axis
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.69em")
      .attr("fill", "#000")
      .text("Humidity, %");

// Create g elements with class humidity
  var humidity = g.selectAll(".humidity")
    .data(humidities)
    .enter().append("g")
      .attr("class", "humidity");

// Draw path among humidity mean measures
  humidity.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.humidMean); })
      .style("stroke", function(d) { return z(d.id); });

// Draw path among humidity min measures
  humidity.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.humidMin); })
      .style("stroke", function(d) { return z(d.id); });

// Draw path among humidity max measures
  humidity.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.humidMax); })
      .style("stroke", function(d) { return z(d.id); });

// Set text for humidity elements
  humidity.append("text")
      .datum(function(d) { return {id: d.id, value: d.humidMean[d.humidMean.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.humidMean.date) + "," + y(d.value.humidMean) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });


      // Create circles for mouse events
	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr(circleAttrs)
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut);

		// Define mouse events for interactivity
  function handleMouseOver(d, i) {

        d3.select(this).attr({
          fill: "orange",
          r: radius * 2
        });

        svg.append("text").attr({
           id: "t" + d.date + "-" + d.humidMean + "-" + i,
            x: function() { return x(d.x) - 30; },
            y: function() { return y(d.y) - 15; }
        })
        .text(function() {
          return [d.date, d.humidMean];
        });
      }

  function handleMouseOut(d, i) {
        d3.select(this).attr({
          fill: "black",
          r: radius
        });
        d3.select("#t" + d.date + "-" + d.humidMean + "-" + i).remove();
      }

// Draw dots on data points and define mouse events and dragit events
  var dot = svg.append("g")
      .attr("class", "dots")
    .selectAll(".dot")
      .data(interpolateData(1800))
    .enter().append("circle")
      .attr("class", "dot")
      .style("fill", function(d) { return colorScale(d); })
      .call(position)
      .on("mousedow", function(d, i) {
      })
      .on("mouseup", function(d, i) {
        dot.classed("selected", false);
        d3.select(this).classed("selected", !d3.select(this).classed("selected"));
        dragit.trajectory.display(d, i, "selected");

      })
      .on("mouseenter", function(d, i) {
        clear_demo();
        if(dragit.statemachine.current_state == "idle") {
          dragit.trajectory.display(d, i)
          dragit.utils.animateTrajectory(dragit.trajectory.display(d, i), dragit.time.current, 1000)
          d.humidMean.text(d.plaats);
          dot.style("opacity", .4)
          d3.select(this).style("opacity", 1)
          d3.selectAll(".selected").style("opacity", 1)
        }
      })
      .on("mouseleave", function(d, i) {
        if(dragit.statemachine.current_state == "idle") {
          d.humidMean.text("");
          dot.style("opacity", 1);
        }
        dragit.trajectory.remove(d, i);
      })
      .call(dragit.object.activate)

});

// Function for parsing data variables into right formats
function type(d, _, columns) {
  d.date = parseTime(d.date);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}

// Update function for interactivity
function update(v, duration) {
	dragit.time.current = v || dragit.time.current;
	displayYear(dragit.time.current)
	d3.select("#slider-time").property("value", dragit.time.current);
}

