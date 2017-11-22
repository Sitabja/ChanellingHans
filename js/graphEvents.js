	document.addEventListener('DOMContentLoaded', function() {
			var isPlay = false;
			var current_year_idx = 0
			clickedCircle = ''
			currentCountry=''
			// d3.selectAll('circle').on("mouseenter",function(d){
			// 	console.log('here')
			// 	d3.select(this)
			// 	.attr('cursor','pointer')
			// })
			body = d3.select("body")
			

			body.on("mouseover",function(){
				regions = d3.selectAll(".regionRect")
				govts = d3.selectAll(".govtRect")
				points = d3.selectAll("circle")

				regions.on("mouseover",function(){
					d3.select(this)
					.style('cursor','pointer')
				})

				points.on("mouseover",function(){
					d3.select(this)
					.style('cursor','pointer')
				})

				// govts.on("mouseover",function(){
				// 	d3.select(this)
				// 	.style('cursor','pointer')
				// })


			})




			body.on("click",function(){
				regions = d3.selectAll(".regionRect")
				points = d3.selectAll("circle")
				govts = d3.selectAll(".govtRect")

				//region bar click handler
				regions.on("click",function(region){
					var clickedRegion = this
					//reset selected Country
					currentCountry = ''
					d3.select('#selected_country')
							.text('')

						d3.select('#life_exp')
							.text("")

						d3.select('#population')
							.text("")

					d3.selectAll(".regionRect")
					.attr("opacity",function(){
							return (this != clickedRegion) ? 0.1 : 1
						})
					d3.selectAll('circle')
						.attr("opacity",function(d){
							return (d.Region != region.key) ? 0.1 : 1
						})
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

				points = d3.selectAll('circle')
				points.on("click",function(d){
						clickedCircle = this
						d3.select(this)
						.transition()
						.duration(500)
						.style('cursor','pointer')
						d3.selectAll('circle')
						.attr("opacity",function(){
							return (this != clickedCircle) ? 0.1 : 1
						})
						d3.selectAll('#countryName')
						.attr("opacity",function(d){
							return clickedCircle.id != d.Country ? 0.2 : 1
						})
						.style("font-size",function(d){
							return clickedCircle.id == d.Country ? "20px" : "8px"
						})

						currentCountry = d
						d3.select('#selected_country')
							.text(d.Country)

						d3.select('#life_exp')
							.text("Life Expectency :" +d.LifeExp)

						d3.select('#population')
							//number with commas
							.text("Population :" +d.Population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))


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
			console.log('curremt index',current_year_idx)
			progressBar.style('background-position',(100-(current_year_idx/years.length)*100)+"%")
			clearInterval(myInterval)
		}
	})

	var myInterval = ''
	var progressBar = d3.select(".progress-bar")
	function startPlaying(){
		    var idx = current_year_idx
			myInterval = setInterval(function() {
					current_year =  years[idx];
					current_year_idx = idx
					showGraphs(current_year);
				  	progressBar.style('background-position',(100-(current_year_idx/years.length)*100)+"%")
					if(idx == years.length - 1){
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
