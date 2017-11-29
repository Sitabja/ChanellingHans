
document.addEventListener('DOMContentLoaded', function() {
	isYearSelectorVisible= false
	var year_selected = ''

	getColorForEachCountry = function(regionList){
		var colorMap = []
		colors = ["#FF5872","#00D5E9","#FFE700","#7FEB00","#ba60f7","#f780f5","#ff0f0f","#444afc"]
		for (var regionIndex = 0 ; regionIndex< regionList.length ; regionIndex++){
			colorMap[regionList[regionIndex]] = colors[regionIndex]
		}
		return colorMap
	}

	populateYearSelector = function(){
		var svg = d3.select(".years")
			.append("svg")
			.attr("width", '200px')
			.attr("height", '170px')
			.style('margin','10px 20px 20px 10px')
			.attr('transform','translate(15)')

		//page number of year selector
		var year_view  = 0
		function showYears(){
			yearDiv = svg.selectAll('text').data(years.slice(year_view*12,(year_view+1)*12),function key(d){
									return d
								})
			//year buttons
			yearDiv.enter()
					.append('rect')
					.attr('y',function(d,i){ 
							return (parseInt(i/4))*60  + 8
						})
					.attr('x',function(d,i){ 
							return (i%4)*50+5
						})
					.attr('width','45px')
					.attr('height','35px')
					.attr('fill','#000')
					.attr('class','year-selector')

			d3.selectAll('.year-selector')
				.on('mouseover',function(){
					d3.selectAll('.year-selector')
					.attr('fill',function(d){
						return year_selected == d ? '#888' : "#000"
					})

					d3.select(this)
					.transition()
					.duration(500)
					.style('cursor','pointer')
					.attr('fill','#777')
				})
				.on('mouseout',function(d){
					d3.select(this)
					.transition()
					.duration(500)
					.style('cursor','pointer')
					.attr('fill',function(d){
						return year_selected == d ? '#888' : "#000"
					})
				})
				.on('click',function(d){
					year_selected = d
					d3.selectAll('.year-selector')
					.attr('fill','#000')
					d3.select(this)
					.transition()
					.duration(500)
					.attr('fill','#888')
					clearInterval(myInterval)
					d3.select('.play')
						  .style("display","block")
						d3.select(".pause")
						   .style("display","none")
					isPlay = false
					showYearSelector()
					generateVis(d)
				})

			d3.selectAll('text')
					.on('mouseenter',function(){
					d3.select(this)
					.style('cursor','pointer')
				})
			yearDiv.enter()
					.append('text')
					.attr('y',function(d,i){ 
							return (parseInt(i/4))*60 + 30
						})
					.attr('x',function(d,i){ 
							return (i%4)*50+10
						})

					.text(function(d){return d})
					.attr('fill','#ccc')

			yearDiv.append('text')
					.attr('y',function(d,i){ 
							return (parseInt(i/4))*60 + 30
						})
					.attr('x',function(d,i){ 
							return (i%4)*50+10
						})

					.text(function(d){return d})
					.attr('fill','#ccc')

			yearDiv.exit().remove();
		}

		showYears()

		onLeftArrowClick = function(){
			if(year_view > 0){
				year_view--;
				showYears();
			}
		}
		onRightArrowClick = function(){
			console.log(year_view," ",years.length)
			if((year_view + 1)*12 < years.length){
				year_view++;
				showYears();
			}
		}
	}

	showYearSelector = function(){
		isYearSelectorVisible = !isYearSelectorVisible
		d3.select('.year-selector-panel')
		   .style('display',function(){
		   		return isYearSelectorVisible ? 'block' : 'none'
		   })
	}

	populateCountrySelector = function(){
		var svg = d3.select(".countries")
			.append("svg")
			.attr("width", '240px')
			.attr("height", '6250px')
			.style('margin','10px 0px 20px 0px')

		countryDiv = svg.selectAll('.countries-text')
						.data(countryList)
		//year buttons
		countryDiv.enter()
					.append('rect')
					.attr('y',function(d,i){ 
							return i*35
						})
					.attr('x',function(d,i){ 
							return 0
						})
					.attr('width','100%')
					.attr('height','35px')
					.attr('fill','transparent')
					.attr('class','country-div')

		countryDiv.enter()
				  .append('text')
				  .attr('y',function(d,i){ 
							return i*35 + 20
						})
					.attr('x',function(d,i){ 
							return 0
						})
					.attr('class','countries-text')
					.text(function(d){return d.Country})
					.attr('fill','#ccc')
					.attr('transform','translate(25)')

		countryDiv.append('text')
				  .attr('y',function(d,i){ 
							return i*35 + 20
						})
					.attr('x',function(d,i){ 
							return 0
						})
					.attr('class','countries-text')
					.text(function(d){return d.Counrty})
					.attr('fill','#ccc')

			d3.selectAll('.country-div')
				.on('mouseover',function(){
					d3.select(this)
					.transition()
					.duration(500)
					.style('cursor','pointer')
					.attr('fill','#444')
				})
				.on('mouseout',function(){
					d3.select(this)
					.transition()
					.duration(500)
					.attr('fill',function(d){
						return currentCountry && currentCountry.Country == d.Country ? '#444' : '#000'
					})
				})

				.on('click',function(d){
					currentCountry = d
					d3.selectAll('.country-div')
					.transition()
					.duration(500)
					.attr('fill',function(d1){
						return currentCountry && currentCountry.Country == d1.Country ? '#444' : '#000'
					})
					d3.selectAll('.trace').remove()
					showCountySelector()
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

	}
	var isCountrySelectorVisible = false
	showCountySelector = function(){
		isCountrySelectorVisible = !isCountrySelectorVisible
		d3.select('.country-selector')
		   .style('transform',function(){
		   		return isCountrySelectorVisible ? 'translateY(0)' : 'translateY(-300px)'
		   })
	}

	//populateCountrySelector()



})