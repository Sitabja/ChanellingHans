document.addEventListener('DOMContentLoaded', function() {
// Define margins
var margin = {top: 20, right: 0, bottom: 50, left: 50};

//Width and height
var outer_width = 925;
var outer_height = 550;
var svg_width = outer_width - margin.left - margin.right;
var svg_height = outer_height - margin.top - margin.bottom;
var populationRange = Math.sqrt(svg_height*6)


years = []
countryList = []
//Define a date parser
var formatDate = d3.timeParse("%d/%m/%y");

// The global data set object
var dataset;

var countryColorMap = []
var clickedCircle = ''

// Set up the scale to be used on the x axis
xScale = d3.scaleLog()
				.range([0, svg_width+10]);

// Set up the scale to be used on the y axis
yScale = d3.scaleLinear()
				.range([svg_height, 0]);

//Define Z axis
zScale = d3.scaleLinear()
				.range([0,populationRange]) 	

//Define text size scale
sScale = d3.scaleLinear()
				.range([8,20])

// Create an x-axis connected to the x scale
var xAxis = d3.axisBottom()
			  	.scale(xScale)
				.ticks(15,"d");

function make_x_gridlines() {		
	return d3.axisBottom()
			  	.scale(xScale)
				.ticks(15,"d");
}

//Define Y axis
var yAxis = d3.axisLeft()
				  .scale(yScale)
				  .ticks(10);

function make_y_gridlines() {		
return d3.axisLeft()
				  .scale(yScale)
				  .ticks(10);
							  
}

//Create SVG element as a group with the margins transform applied to it
var svg = d3.select(".graph")
			.append("svg")
			.attr("width", svg_width + margin.left + margin.right)
			.attr("height", svg_height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var year = svg.append("text")
			.attr('x',svg_width/4)
			.attr('y',svg_height - 250)
			.attr("opacity",0.1)
			.attr("id","year")
			.attr('font-size', 250)
			.attr('fill','#ccc')

var selectedCountry = svg.append("text")
			.attr('x',2*svg_width/3)
			.attr('y',svg_height - 150)
			.attr("opacity",0.1)
			.attr("id","year")
			.attr('font-size', 40)
			.attr('fill','#ccc')

var LifeExp = svg.append("text")
			.attr('x',2*svg_width/3)
			.attr('y',svg_height - 110)
			.attr("opacity",0.1)
			.attr("id","year")
			.attr('font-size', 20)
			.attr('fill','#ccc')

var gdp = svg.append("text")
			.attr('x',2*svg_width/3)
			.attr('y',svg_height - 90)
			.attr("opacity",0.1)
			.attr("id","year")
			.attr('font-size', 20)
			.attr('fill','#ccc')
			
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function getLifeExpOfSelectedCountry(filtered_dataset){
				var text = ''
				filtered_dataset.map((data,i)=>{
					if(data.Country == currentCountry.Country){
						text = Math.round(data.LifeExp,2)
						return
					}
				})
				return text
			}

function getGDPOfSelectedCountry(filtered_dataset){
				var text = ''
				filtered_dataset.map((data,i)=>{
					if(data.Country == currentCountry.Country){
						//Number with commas
						text = data.GDP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
						return
					}
				})
				return text
			}

function getModifiedCurrentCountry(filtered_dataset){
	filtered_dataset.map((data,i)=>{
		if(data.Country == currentCountry.Country){
			currentCountry = data; 
			return
		}
	})
}
generateVis = function (display_year){

		// Filter the data to only include the current year
		var filtered_dataset = dataset.filter(function yearFilter(value){
			return (value.Year == display_year)
		});
		
		/******** PERFORM DATA JOIN ************/
	  	// Join new data with old elements, if any.
		var points = svg.selectAll(".countryCircle")
							.data(filtered_dataset, function key(d){
								return d.Country
							});

		
		var countryName = svg.selectAll("#countryName")
							 .data(filtered_dataset, function key(d){
							 	return d.Country
							 });

				 

	    year
	    	.transition()
	    	.duration(100)
	    	.text(display_year)
	    	.attr("opacity",0.2)


	    selectedCountry
	    	.transition()
	    	.duration(100)
	    	.attr('id','selected_country')
	    	.attr("opacity",0.5)

	    LifeExp
	    	.transition()
	    	.duration(100)
	    	.attr('id','life_exp')
	    	.attr("opacity",0.5)
			.text(currentCountry ? "Life Expectency :"+getLifeExpOfSelectedCountry(filtered_dataset)  : '')

	    gdp
	    	.transition()
	    	.duration(100)
	    	.attr('id','gdp')
	    	.attr("opacity",0.5)
	    	.text(currentCountry ? "GDP :"+getGDPOfSelectedCountry(filtered_dataset)  : '')




		/******** HANDLE ENTER SELECTION ************/
	  	// Create new elements in the dataset
	  	// Perform a data join and add points to the chart
		points.enter()
			.append("circle")
			.attr("cy",svg_height)
			.transition()
			.duration(500)
				.attr("cx", function(d){
									return xScale(+d.GDP);
								})
				.attr("cy", function(d){
									return yScale(+d.LifeExp);
								})
				.attr("id",function(d){return d.Country})
				.attr("class","countryCircle")
				.attr("r", function(d){return zScale(Math.sqrt(+d.Population/Math.PI))})
				.style("fill", function(d){return countryColorMap[d.Region]})
				.style("stroke","#ccc")

		countryName.enter()
				   .append("text")
				   .attr("y",svg_height)
				   .style('display','none')
				   .transition()
				   .duration(500)
				   .attr('x',function(d){
									return xScale(+d.GDP);
								})
				   .attr('y',function(d){
									return yScale(+d.LifeExp);
								})
				    .text(function(d){ 
				    	return d.Country
				    })
				    .attr("id","countryName")
				    .attr('font-size', 20)
				    .attr('fill','#ccc')
				    //onhover the country name will be visible
				    




	 	/******** HANDLE UPDATE SELECTION ************/
	  	// Update the display of existing elelemnts to mathc new data
	  	// Perform a data join and add points to the chart
			points
			.style("opacity",function(d){
					if(currentCountry){
						return currentCountry.Country == d.Country ? 1 : 0.2
					}
					else if(hoveredCountry){
						console.log('asfasf',hoveredCountry.Country)
						return hoveredCountry.Country == d.Country ? 1 : 0.2
					}
					else if(currentRegion){
						return currentRegion.key == d.Region ? 1 : 0.2
					}
					return 1
				})
				.transition()
				.duration(500)
				.attr("cx", function(d){
									return xScale(+d.GDP);
								})
				.attr("cy", function(d){
									return yScale(+d.LifeExp);
								})
				.attr("id",function(d){return d.Country})
				.attr("r", function(d){return zScale(Math.sqrt(+d.Population/Math.PI))})
				.style("fill", function(d){return countryColorMap[d.Region]})
				
		
				//.on("mouseout",handleMouseOut)

			countryName
				   .attr('x',function(d){
									return xScale(+d.GDP);
								})
				   .attr('y',function(d){
									return yScale(+d.LifeExp);
								})
				    .text(function(d){ 
				    	return d.Country
				    })
				    //onhover the country name will be visible
				    //.style('opacity',0)

	
		/******** HANDLE EXIT SELECTION ************/
		// Remove elements that not longer have a matching data eleement
		points.exit().remove();
		countryName.exit().remove()
		//trace 
		if(currentCountry){
			getModifiedCurrentCountry(filtered_dataset)
			var trace = svg.append('g')
			trace.append('circle')
			.transition()
			.duration(500)
				.attr("cx", xScale(+currentCountry.GDP))
				.attr("cy", yScale(+currentCountry.LifeExp))
				.attr("id",display_year+"-"+currentCountry.GDP+"-"+currentCountry.LifeExp)
				.attr("class","trace")
				.attr("r", zScale(Math.sqrt(+currentCountry.Population/Math.PI)))
				.style("fill", countryColorMap[currentCountry.Region])
				.style("stroke","#777")

			// trace.append('text')
			// 	.attr("x", xScale(+currentCountry.GDP))
			// 	.attr("y", yScale(+currentCountry.LifeExp))
			// 	.attr("id",'year-'+currentCountry.Country)
			// 	.attr("class","trace-text")
			// 	.text(display_year)
			// 	.style("fill",'#ccc')
			// 	.style('opacity',0)

		}
}
	
  showTraceYear= function(year,GDP,LifeExp){
  	d3.select('.trace-text').remove()
  	svg.append('text')
				.attr("x", xScale(+GDP))
				.attr("y", yScale(+LifeExp))
				.attr("class","trace-text")
				.text(year)
				.style("fill",'#ccc')
				.style('opacity',1)
  }
  showGraphs = function(current_year){
		// Generate the visualisation
			generateVis(current_year);
			generateVisCountryPerRegion(current_year,dataset,countryColorMap)
			generateVisCountryPerGovt(current_year,dataset,countryColorMap)
	}

// Load the file data.csv and generate a visualisation based on it
	d3.csv("../data/Gapminder_All_Time.csv", function(error, data){
		years = d3.map(data, function(d){return d.Year}).keys();
		
		current_year = years[0]
		populateYearSelector()
		var regionList = d3.map(data, function(d){return d.Region}).keys();
		countryList = d3.map(data, function(d){return d.Country}).values();
		populateCountrySelector()

		countryColorMap = getColorForEachCountry(regionList)
		// handle any data loading errors
		if(error){
			console.log("Something went wrong");
			console.log(error);
		}else{
			console.log("Data Loaded");

			// Assign  the data object loaded to the global dataset variable
			dataset = data;

			// Set the domains of the x and y scales using the data
			var max_GDP = d3.max(dataset, function(d) { return +d.GDP;} );
			var min_GDP = d3.min(dataset, function(d) { return +d.GDP;} );
			var max_LifeExp = d3.max(dataset, function(d) { return +d.LifeExp;} );
			var min_LifeExp = d3.min(dataset, function(d) { return +d.LifeExp;} );
			var min_population = Math.sqrt(d3.min(dataset, function(d) { return +d.Population;})/Math.PI);
			var max_population = Math.sqrt(d3.max(dataset, function(d) { return +d.Population;})/Math.PI);

			xScale.domain([min_GDP, max_GDP]);
			yScale.domain([min_LifeExp - 10, max_LifeExp]);
			zScale.domain([min_population, max_population])
			sScale.domain([min_population, max_population])

			// Create the x-axis
			svg.append("g")
				.attr("class", "grid")
				.attr("id", "x-grid")
				.attr("transform", "translate(0," + svg_height + ")")
				.call(make_x_gridlines()
					  .tickSize(-svg_height)
          			  );


				
			// Create the y axis
			svg.append("g")
				.attr("class", "grid")
				.attr("id", "y-grid")
				.call(make_y_gridlines()
					  .tickSize(-svg_width) 
          			  )
				.append("text")
				      .attr("transform", "rotate(-90)")
				      .attr("y", 6)
				      .attr("dy", ".71em")
				      .style("text-anchor", "end")
				      .text(" Life Expentency");

			svg.append("g")
				.attr("class", "axis")
				.call(xAxis)
				.attr("transform", "translate(0," + svg_height + ")")
				.append("text")
				      .attr("x", svg_width)
				      .attr("y", -10)
				      .attr("dy", ".71em")
				      .style("text-anchor", "end")
				      .text(" GDP");

			svg.append("g")
				.attr("class", "axis")
				.attr("id", "y-grid")
				.call(yAxis)
				.append("text")
				      .attr("transform", "rotate(-90)")
				      .attr("y", 6)
				      .attr("dy", ".71em")
				      .style("text-anchor", "end")
				      .text(" Life Expentency");


			showGraphs(current_year)
		}
	})
})