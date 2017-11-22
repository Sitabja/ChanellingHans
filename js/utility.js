
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
			.attr("height", '180px')
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

			d3.selectAll('rect')
				.on('mouseenter',function(){
					d3.select(this)
					.transition()
					.duration(500)
					.style('cursor','pointer')
					.attr('fill','#000')
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
					d3.select(this)
					.transition()
					.duration(500)
					.attr('fill','#eee')
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
			if(year_view*12 < years.length){
				year_view++;
				showYears();
			}
		}
	}

	showYearSelector = function(){
		isYearSelectorVisible = !isYearSelectorVisible
		d3.select('.year-selector-panel')
		   .style('opacity',function(){
		   		return isYearSelectorVisible ? '1' : '0'
		   })
	}

})