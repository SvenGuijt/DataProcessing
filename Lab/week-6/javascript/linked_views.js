d3.queue()
  .defer(d3.json, "data_files/JSONtotaldata.json")
  .defer(d3.json, "data_files/JSONdataMEN.json")
  .defer(d3.json, "data_files/JSONdataWOMEN.json")
  .await(function(error, data1, data2, data3){
    if (error) throw error;
    makeMap(data1, data2, data3);
  });

// Actual makeMap function with passed datasets
function makeMap(data1, data2, data3){

  // Initialize datamap with corresponding attributes
  var map = new Datamap({
    element: document.getElementById('container'),
    projection: 'mercator',
    height: 500,
    width: 700,

    // Define fillKeys
    fills: {
        "<76": "#f1eef6",
        "77": "#d4b9da",
        "78": "#c994c7",
        "79": "#df65b0",
        "80": "#e7298a",
        "81": "#ce1256",
        "82>": "#91003f",
        defaultFill: "#000000"
    },

    // Default dataset is dataset 1: Total
    data: data1,

    // Create tooltip for each country with data
    geographyConfig: {
        popupTemplate: function(geo, data1) {
            return ['<div class="hoverinfo"><strong>',
                    geo.properties.name + ': <br>Life expectancy: <font color="red">',
                    data1.LifeExp + ' years</font><br>',
                    'Years of Education: <font color="red">' + data1.YearsEdu + ' years</font>',
                    '<br>Air Pollution: <font color="red">' + data1.AirPol + ' μg/m3</font>',
                    '<br>Water Quality: <font color="red">' + data1.WaterQ + '%</font>',
                    '<br>Homocide Rate: <font color="red">' + data1.HomRate + ' (ratio)</font>',
                    '<br>Personal Earnings: <font color="red">$' + data1.pEarn + '</font>',
                    '</strong></div>'].join('');
        }
    },

    // Create event for clicking on country for updating bar chart
    done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
              if(data1.hasOwnProperty(geography.id)) {
                update_barchart(geography.id, data1);
              }
            });
    }

  });

  // Create legend for map
  map.legend();


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

  // Create right-hand y-axis
  var yAxis2 = d3.svg.axis()
      .scale(y2)
      .orient("right");

  // Set data titles for bar chart
  var data_titles = ["DWBF (%)", "QOSN (%)", 
                     "Self-Reported Health (%)", "Safety (%)", "Employment Rate (%)", "Life Satisfaction (1-10)"];

  // Create tooltip variable for bar chart
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>" + d.Var + ":</strong> <span style='color:red'>" + d.Value + "</span>";
    })

  // Create variable chart by selecting chart class from html file
  var chart = d3.select(".chart")

      // Attribute width and height to chart
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Connect tooltip to bar chart
  chart.call(tip);

  // Load data from JSON data file and declare x- and y domain (both y-axes)
  x.domain(data_titles);
  y.domain([0, 100]);
  y2.domain([0, 10]);

  // Append x axis to chart
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // Append first y axis to chart (percentages)
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Percentage (%)");

  // Append second y axis to chart (scores)
  chart.append("g")
      .attr("class", "y axis 2")
      .attr("transform", "translate(" + width + ", 0)")
      .call(yAxis2)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -12)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Score (1-10)");

  // Create bars and calculate height for each
  chart.selectAll(".bar")
      .data(extract_data("BEL",data1))
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Var); })
      .attr("y", function(d) { return y(d.Value); })
      .attr("height", function(d) { return height - y(d.Value); })
      .attr("width", x.rangeBand())
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);


  // Define function for updating bar chart if clicked on corresponding country
  function update_barchart(country_code, data1) {

    var bars = chart.selectAll(".bar").data(data1)

    bars.exit().remove()

    chart.selectAll(".bar").data(extract_data(country_code, data1))
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.Var); })
        .attr("y", function(d) { return y(d.Value); })
        .attr("height", function(d) { return height - y(d.Value); })
        .attr("width", x.rangeBand())
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
  }

  // Define function for extracting data from dataset based on preferred variables
  function extract_data(country_code, data1) {
    var data_variables = ["DWBF","QOSN", "SRHealth", "Safe", "EmpRate", "LifeSatis"];
    var data_titles = ["DWBF (%)", "QOSN (%)", 
                       "Self-Reported Health (%)", "Safety (%)", "Employment Rate (%)", "Life Satisfaction (1-10)"];
    var extracted_data = [];
    for (i in data_titles) {
      extracted_data[i] = {};
      extracted_data[i]["Var"] = data_titles[i];
      extracted_data[i]["Value"] = data1[country_code][data_variables[i]];
    };
    return extracted_data;
  }

  // Create jQuery event for clicking on dropdown menu
  $(".dropdown-menu li a").click(function() {
    var selText = $(this).text();
    if (selText == "Total") {
      map.updateChoropleth(data1);
    }
    else if (selText == "Men") {
      map.updateChoropleth(data2);
    }
    else if (selText == "Women") {
      map.updateChoropleth(data3);
    }

  });


};



