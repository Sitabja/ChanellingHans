	document.addEventListener('DOMContentLoaded', function() {
			isPlay = false;
			var current_year_idx = 0
			currentCountry=''
			currentRegion = ''
			hoveredCountry = ''
			// d3.selectAll('circle').on("mouseenter",function(d){
			// 	console.log('here')
			// 	d3.select(this)
			// 	.attr('cursor','pointer')
			// })
			body = d3.select("body")
			points = d3.selectAll("circle")




			body.on("mouseover",function(){
				regions = d3.selectAll(".regionRect")
				govts = d3.selectAll(".govtRect")
				points = d3.selectAll(".countryCircle")
				trace = d3.selectAll('.trace')

				regions.on("mouseover",function(){
					d3.select(this)
					.style('cursor','pointer')
				})

				points.on("mouseover",function(d){
					hoveredCircle = this
					hoveredCountry = d
					d3.select(this)
					.style('cursor','pointer')
					d3.selectAll('.countryCircle')
						.attr("opacity",function(d1){
							return (this != hoveredCircle && d1.Country != currentCountry.Country) ? 0.1 : 1
						})
					d3.selectAll('#countryName')
						.style("display",function(d1){
							return d1.Country == d.Country ? "block" : "none"
						})
					
				})

				points.on("mouseout",function(d){
					hoveredCountry = ''
					d3.select(this)
					.style('cursor','pointer')

					d3.selectAll('.countryCircle')
						.attr("opacity",function(d1){
							return currentCountry ? 
								   currentCountry.Country == d1.Country ? 1 : 0.1 
								   : 1
						})

					d3.selectAll('#countryName')
						.style("display","none")

				})

				trace.on('mouseover',function(d){
					selectedTrace = this
					d3.select(this)
					  .style('cursor','pointer')
					 

					d3.selectAll('.trace')
						.style('opacity',function(){
							return this != selectedTrace ? 0.1 : 1
						})
					

				 	//var trace_year_text = d3.select('#year-'+this.id)
				 	//bring to the front of the plane
				 	console.log('data',this.GDP)
				 	var info = this.id.split('-')
				 	showTraceYear(info[0],info[1],info[2])
				})

				trace.on('mouseout',function(){
					d3.selectAll('.trace')
						.style('opacity',1)

					d3.select('.trace-text').remove()
				})



			})




			body.on("click",function(){
				regions = d3.selectAll(".regionRect")
				points = d3.selectAll(".countryCircle")
				govts = d3.selectAll(".govtRect")
				//region bar click handler
				regions.on("click",function(region){
					var clickedRegion = this
					//reset selected Country
					currentCountry = ''
					currentRegion = region
					d3.select('#selected_country')
							.text('')

						d3.select('#life_exp')
							.text("")

						d3.select('#gdp')
							.text("")

					d3.selectAll(".regionRect")
					.style("opacity",function(){
							return (this != clickedRegion) ? 0.1 : 1
						})

					d3.selectAll('.countryCircle')
						.style("opacity",function(d){
							return (d.Region != region.key) ? 0.1 : 1
						})

					d3.selectAll('#countryName')
						.transition()
						.duration(500)
						.style("display","none")
				})

				//govts click handler
				// govts.on("click",function(govts){
				// 	var clickedGovt = this
				// 	//reset selected Country
				// 	currentCountry = ''
				// 	d3.select('#selected_country')
				// 			.text('')

				// 		d3.select('#life_exp')
				// 			.text("")

				// 		d3.select('#population')
				// 			.text("")

				// 	d3.selectAll(".govtRect")
				// 	.attr("opacity",function(){
				// 			return (this != clickedGovt) ? 0.1 : 1
				// 		})
				// 	d3.selectAll('circle')
				// 		.attr("opacity",function(d){
				// 			return (d.Government != govts.key) ? 0.1 : 1
				// 		})
				// })

				points = d3.selectAll('.countryCircle')
				points.on("click",function(d){
						currentRegion = ''
						d3.select(this)
						.transition()
						.duration(500)
						.style('cursor','pointer')
						d3.selectAll('.countryCircle')
						.style("opacity",function(d1){
							return (d.Country != d1.Country) ? 0.1 : 1
						})

						if(currentCountry.Country != d.Country){
							d3.selectAll('.trace').remove()
						} 

						currentCountry = d

						d3.select('#selected_country')
							.text(d.Country)

						d3.select('#life_exp')
							.text("Life Expectency :" +d.LifeExp)

						d3.select('#gdp')
							//number with commas
							.text("GDP :" +d.GDP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))



					})
			})

	//region selector
	// d3.selectAll('.regionRect').on('click',function(){
	// 	console.log('ajgfjhagdsj')
	// })

	// play button 
	d3.select(".play-animation-button").on("click",function(){
		isPlay = !isPlay;
		if(isPlay){
			d3.select('.play')
			  .style("display","none")
			d3.select(".pause")
			   .style("display","block")
			startPlaying()
		} else {
			d3.select('.play')
			  .style("display","block")
			d3.select(".pause")
			   .style("display","none")
			progressBar.style('background-position',(100-(current_year_idx/years.length)*100)+"%")
			clearInterval(myInterval)
		}
	})

	//reset-button
	d3.select(".reset-button").on('click',function(){
		d3.selectAll('.trace').remove()
		d3.selectAll('.countryCircle').style("opacity",1)
		d3.selectAll('.regionRect').style('opacity',1)
		currentCountry=''
		currentRegion = ''
		hoveredCountry = ''
		d3.select('#selected_country')
							.text('')

						d3.select('#life_exp')
							.text("")

						d3.select('#gdp')
							.text("")



	})

	myInterval = ''
	var progressBar = d3.select(".progress-bar")
	function startPlaying(){
		    var idx = current_year_idx
			myInterval = setInterval(function() {
					if(current_year_idx==0){
						d3.selectAll('.trace').remove()
					}
					current_year =  years[idx];
					current_year_idx = idx
					showGraphs(current_year);
				  	progressBar.style('background-position',(100-(current_year_idx/years.length)*100)+"%")
					if(idx == years.length - 1){
						//d3.selecteAll('.trace').remove()
						progressBar.style('background-position',"0%")
						clearInterval(myInterval)
						current_year_idx = 0
						d3.select('.play')
						  .style("display","block")
						d3.select(".pause")
						   .style("display","none")
						isPlay = false;
					}
					idx++;
				  	
				}, 200);
	}



})
