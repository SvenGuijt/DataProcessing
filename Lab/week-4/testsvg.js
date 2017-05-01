var colors = ["#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"];


d3.xml("test.svg", "image/svg+xml", function(error, xml) { if (error) throw error; 
		document.body.appendChild(xml.documentElement)


d3.select("#kleur1").style("fill", colors[0])
d3.select("#kleur2").style("fill", colors[1])
d3.select("#kleur3").style("fill", colors[2])

for (var i = 1; i < 3; i++){
		d3.select("svg").append("rect")
	      .attr("id", "tekst"+(i+4))
	      .attr("class", "st2")
	      .attr("x", 46.5)
	      .attr("y", 138.7 + i * 41.9)
	      .attr("height", 29)
	      .attr("width", 119.1)
	}

for (var i = 0; i < 3; i++){
		d3.select("svg").append("rect")
	      .attr("id", "kleur"+(i+4))
	      .attr("class", "st1")
	      .attr("x", 13)
	      .attr("y", 138.7 + i * 41.9)
	      .attr("height", 29)
	      .attr("width", 21)
	      .style("fill", colors[3+i]);
	}
	
for (var i = 0; i < 6; i++){
	d3.select("svg").append("text")
      .attr("x", 100)
      .attr("y", 37 + 41.5 * i)
      .style("text-anchor", "end")
      .text("Color "+(i+1));
}

d3.selectAll(".st2").style("stroke", "#ffffff");

});

