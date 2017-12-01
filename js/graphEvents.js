	document.addEventListener('DOMContentLoaded', function() {
			isPlay = false;
			var current_year_idx = 0
			currentCountry=''
			currentRegion = ''
			hoveredCountry = ''
	
			body = d3.select("body")
			points = d3.selectAll("circle")

			body.on("mouseover",function(){
				regions = d3.selectAll(".regionRect")
				govts = d3.selectAll(".govtRect")
				points = d3.selectAll(".countryCircle")
				trace = d3.selectAll('.trace')
				//change the opcaity of other regions = 0.5 
				//and display the country count of the selected region
				regions.on("mouseover",function(region){
					var hoveredRegion = this
					d3.select(this)
					.style('cursor','pointer')

					d3.selectAll(".regionRect")
					.style("opacity",function(d){
							if(currentRegion){
								if(d.key == currentRegion.key){
									return 1
								} 
							}
							return this != hoveredRegion ? 0.5 : 1
						
						})

					d3.selectAll('.countryCount')
					.style("display",function(d){
							return (d.key != region.key) ? 'none' : 'block'
						})


				})
				//remove the country count shown
				// and all the regions visible, i.e opacity = 1
				// if any region is already selected then make the opacity of other regions = 0.1 
				regions.on("mouseout",function(){
					d3.selectAll(".regionRect")
					.style("opacity",function(d){
							return currentRegion ? d.key!= currentRegion.key ? 0.1 : 1 : 1
						})

					d3.selectAll('.countryCount')
					.style("display",function(d){
							return currentRegion ? d.key != currentRegion.key ? 'none' : 'block' : 'none'
						})
				})
			    //onhover make the opacity of all other bubble = 0.1 except the hovered country 
			    //and the country already selected 
				points.on("mouseover",function(d){
					hoveredCircle = this
					hoveredCountry = d
					d3.select(this)
					.style('cursor','pointer')
					d3.selectAll('.countryCircle')
						.style("opacity",function(d1){
							return (this == hoveredCircle || d1.Country == currentCountry.Country) ? 1 : 0.1
						})
					d3.selectAll('#countryName')
						.style("display",function(d1){
							return d1.Country == d.Country ? "block" : "none"
						})
					
				})
				//make opacity of all the bubble = 1 except the selected Country
				points.on("mouseout",function(d){
					hoveredCountry = ''
					d3.select(this)
					.style('cursor','pointer')

					d3.selectAll('.countryCircle')
						.style("opacity",function(d1){
							return currentCountry ? 
								   currentCountry.Country == d1.Country ? 1 : 0.1 
								   : 1
						})

					d3.selectAll('#countryName')
						.style("display","none")

				})
			    //on hover of any bubble of the trace will show the corresponding year 
			    // and make opacity of all the bubbles in the trace = 0.1
				trace.on('mouseover',function(d){
					selectedTrace = this
					d3.select(this)
					  .style('cursor','pointer')
					 

					d3.selectAll('.trace')
						.style('opacity',function(){
							return this != selectedTrace ? 0.1 : 1
						})
				 	
				 	//bring to the front of the plane
				 	showTraceYear(d.Year,d.GDP,d.LifeExp)
				})
				//make opcaity of all the bubbles in the trace = 1 
				//and remove the yer shown for the hovered bubble in teh trace  
				trace.on('mouseout',function(){
					d3.selectAll('.trace')
						.style('opacity',1)
					d3.select('.trace-text').remove()
				})



			})



			
			

			body.on("click",function(){
				regions = d3.selectAll(".regionRect")
				points = d3.selectAll(".countryCircle")

				//region bar click handler
				// make the opacity of selected bar = 1 and others = 0.1
				//make the countries bubbles corresponding to the region selected prominant 
				//whereas opacity of others = 0.1
				regions.on("click",function(region){
					d3.selectAll('.trace').remove()
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
					d3.selectAll('.countryCount')
					.style("display",function(d){
							return (d.key != region.key) ? 'none' : 'block'
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
				//make the slected country prominant using opacity
				//show the details of the country selected
				// make the show trace button visible
				points.on("click",function(d){
					currentRegion = ''
					d3.selectAll('.regionRect').style('opacity',1)
					d3.selectAll('.countryCount').style('display','none')
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

					showTrace()

				})

				if(currentCountry){
					d3.select('.show-trace').style('display','flex')
				} else {
					document.getElementById('checkbox').checked = false;
					d3.select('.show-trace').style('display','none')
				}
			})

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
		isShowTrace = false
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
