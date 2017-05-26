d3.queue()
  .defer(d3.json, "data_files/JSONtotaldata.json")
  .defer(d3.json, "data_files/JSONdataMEN.json")
  .defer(d3.json, "data_files/JSONdataWOMEN.json")
  .await(function(error, data1, data2, data3){
    if (error) throw error;
    makeMap(data1, data2, data3);
  });

function makeMap(data1, data2, data3){

// console.log(data1)
// for (var i = 0; i < data1.length; i++) {
//   console.log(i)
// }

  var map = new Datamap({
    element: document.getElementById('container'),
    projection: 'mercator',
    height: 500,
    width: 700,
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

    data: data1,

    geographyConfig: {
        popupTemplate: function(geo, data1) {
          // if(data1.hasOwnProperty(geography.id)){
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
        //   else {
        //     return ['<div class="hoverinfo"><strong>',
        //             'No Data',
        //             '</strong></div>'].join('');
        //   }
        // }
    },

    done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
              if(data1.hasOwnProperty(geography.id)) {
                update_barchart(geography.id, data1);
              }
            });
    }

  });
//----------- END OF VARIABLE MAP ----------------//

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

var data_titles = ["Dwellings without basic facilities (%)", "Quality of Supported Network (%)", "Self-Reported Health (%)", "Safety (%)", "Employment Rate (%)", "Life Satisfaction (1-10)"]

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>"+d.Var+":</strong> <span style='color:red'>" + d.Value + "</span>";
  })



// Create variable chart by selecting chart class from html file
var chart = d3.select(".chart")

    // Attribute width and height to chart
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chart.call(tip);

// Load data from JSON data file and declare x- and y domain
  x.domain(data_titles);
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
      .attr("transform", "translate(" + width + ", 0)")
      .call(yAxis2)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -12)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Score (1-10)");


var extracted_data = extract_data("BEL",data1);

  // Create bars and calculate height for each
  chart.selectAll(".bar")
      .data(extracted_data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Var); })
      .attr("y", function(d) { return y(d.Value); })
      .attr("height", function(d) { return height - y(d.Value); })
      .attr("width", x.rangeBand())
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);


function update_barchart(country_code, data1) {

    var extracted_data = extract_data(country_code, data1)

    var bars = chart.selectAll(".bar").data(data1)

    bars.exit().remove()

    chart.selectAll(".bar").data(extracted_data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.Var); })
          .attr("y", function(d) { return y(d.Value); })
          .attr("height", function(d) { return height - y(d.Value); })
          .attr("width", x.rangeBand())
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);
}


function extract_data(country_code, data1) {
    var data_variables = ["DWBF","QOSN", "SRHealth", "Safe", "EmpRate", "LifeSatis"];
    var data_titles = ["Dwellings without basic facilities (%)", "Quality of Supported Network (%)", "Self-Reported Health (%)", "Safety (%)", "Employment Rate (%)", "Life Satisfaction (1-10)"]

    var extracted_data = [];
    for (i in data_titles) {
      extracted_data[i] = {};
      extracted_data[i]["Var"] = data_titles[i];
      extracted_data[i]["Value"] = data1[country_code][data_variables[i]];
    };
    return extracted_data;
}

// function updateMap() {
// console.log(data2)
// map.updateChoropleth(data2)
// };


$(".dropdown-menu li a").click(function() {
  var selText = $(this).text();
  if (selText == "data1") {
    map.updateChoropleth(data1);
  }
  else if (selText == "data2") {
    map.updateChoropleth(data2);
  }
  else if (selText == "data3") {
    map.updateChoropleth(data3);
  }
  console.log(selText);

  //updateMap();
});


};
//--------END OF FUNCTION MAKEMAP-------//



// $(".dropdown-menu li a").click(function(){
//   var selText = $(this).text();
//   console.log(selText);
//   updateMap();
//map.updateChoropleth(selText)



  // makeMap(selText)
//});

// function updateMap(data1) {



// };


// function addFillKey(data1) {

// }



