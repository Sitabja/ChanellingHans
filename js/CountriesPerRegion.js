document.addEventListener('DOMContentLoaded', function() {

		// Define margins
	var margin = {top: 10, right: 10, bottom: 25, left: 140};

	//Width and height
	var outer_width = 450;
	var outer_height = 280;
	var svg_width = outer_width - margin.left - margin.right;
	var svg_height = outer_height - margin.top - margin.bottom;


	//Create SVG element as a group with the margins transform applied to it
	var svg = d3.select(".countriesPerRegion")
				.append("svg")
				.attr("width", svg_width + margin.left + margin.right)
				.attr("height", svg_height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
				.attr("class", "chart");
	
	
	// Create a scale to scale populations share values nicely for bar heights
	var xScale =  d3.scaleLinear()
                     .range([0, svg_width]);


    // Create a scale object to nicely take care of positioning bars along the horizontal axis
	var yScale = d3.scaleBand()
					.range([0, svg_height], 0.1)
					.paddingInner(0.05)
					.paddingOuter(0.05);

    // Create an x-axis connected to the x scale
	var xAxis = d3.axisBottom()
			  .scale(xScale)
			  .ticks(4);

//Define Y axis
var yAxis = d3.axisLeft()
				  .scale(yScale)
				  .ticks()
			  
// Do everything but call the x-axis
svg.append("g")
	.attr("class", "axis")
	.attr("id", "x-axis")
	.attr("transform", "translate(0," + svg_height + ")");
	
// Do everyhting but call the y-axis
svg.append("g")
	.attr("id", "y-axis")
	.attr("class", "axis");

// Define a fucntion to draw a simple bar chart
generateVisCountryPerRegion = function(display_year,dataset,countryColorMap){
	// Filter the data to only include the current year
	var filtered_dataset = dataset.filter(function yearFilter(value){
			return (value.Year == display_year)
		});

	var countryCount = d3.nest()
					  .key(function(d) { return d.Region; })
					  .rollup(function(c) { return c.length; })
					  .entries(filtered_dataset);
	// Update the axis domains based on the loaded data
	xScale.domain([0,d3.max(countryCount, function(d) { return +d.value;}) ])
	yScale.domain(countryCount.map(function(d) {
		return d.key; }));
	// Call the axes objects
	svg.select("#x-axis").call(xAxis);
	svg.select("#y-axis").call(yAxis);

	/******** PERFORM DATA JOIN ************/
  	// Join new data with old elements, if any.
  	var bars = 	svg.selectAll(".regionRect")
	   .data(countryCount, function key(d) {
								return d.key;
							});

	 
 	/******** HANDLE UPDATE SELECTION ************/
  	// Update the display of existing elelemnts to mathc new data
  	bars
  	.attr("width",0)
  	.attr("y",function(d, i) {
		   		return yScale(d.key);
		   })
		   .attr("x",0)
  	.transition()
	   .duration(500)
		   .attr("width", function(d, i) {
		   		return xScale(d.value);	
		   })
		   .attr("height", function(d) {
		   		return yScale.bandwidth();
		   })
		   .attr("class","regionRect")
		   .style("fill", function(d){return countryColorMap[d.key]})
	   

	/******** HANDLE ENTER SELECTION ************/
  	// Create new elements in the dataset
  	bars.enter()
	   .append("rect")
	   .transition()
	   .duration(500)
	   .attr("y",function(d, i) {
		   		return yScale(d.key);
		   })
		   .attr("x",0)
		   .attr("width", function(d, i) {
		   		return xScale(d.value);	
		   })
		   .attr("height", function(d) {
		   		return yScale.bandwidth();
		   })
	   .attr("class","regionRect")
	   .style("fill", function(d){return countryColorMap[d.key]})
	   
	  
	/******** HANDLE EXIT SELECTION ************/
	// Remove bars that not longer have a matching data eleement
	bars.exit().remove();
  		
	// Set the year label
	d3.select(".year-header").text(display_year)
}



// // Load the file data.csv and generate a visualisation based on it
// d3.csv("../data/Gapminder_All_Time.csv", function(error, data){

// 	var regionList = d3.map(data, function(d){return d.Region}).keys();

// 		countryColorMap = getColorForEachCountry(regionList)	
// 	// handle any data loading errors
// 	if(error){
// 		console.log("Something went wrong");
// 		console.log(error);
// 	}else{
// 		console.log("Data Loaded");
		
// 		// Assign  the data object loaded to the global dataset variable
// 		dataset = data;

// 		// Generate the visualisation
// 		generateVis();

// 		// Set up an interval callback to iterate through the avialble years
// 		setInterval(function() {
// 			display_year = display_year + 1;
// 			if(display_year > 2015){
// 				display_year = 2005;
// 			}
// 		  	generateVis();
// 		}, 4000);
// 	}
// });


	
})


