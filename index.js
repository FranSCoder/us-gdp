const w = 900;
const h = 400;
const padding = 45;



fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(response => response.json())
  .then(data => {
  
    const dataLength = data.data.length;
  
    var div = d3.select("body").append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);
  
    const xScale = d3.scaleTime()
      .domain([new Date(data.data[0][0]), new Date(data.data[dataLength - 1][0])])
      .range([padding, w - padding]);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data.data, (d) => d[1])])
      .range([h - padding, padding]);
  
    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);
  
    const quarters = function(i) {
      if (i[0].substring(5,7) == "01") {
        return "Q1"
      }
      if (i[0].substring(5,7) == "04") {
        return "Q2"
      }
      if (i[0].substring(5,7) == "07") {
        return "Q3"
      }
      if (i[0].substring(5,7) == "10") {
        return "Q4"
      }
    }
  
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
    
    svg.append("text")
      .attr('transform', 'rotate(-90)')
      .attr('x', -310)
      .attr('y', 65)
      .text('Gross Domestic Product (Billions)');
  
    svg.selectAll("rect")
      .data(data.data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("fill", "#007bff")
      .attr("width", 3)
      .attr("height", (d) => h - padding - yScale(d[1]))
      .attr("x", (d, i) => padding + (w - 2 * padding) / dataLength * i)
      .attr("y", (d) => yScale(d[1]))
      .on("mouseover", (d, i) => {
        div.transition()		
          .duration(50)
          .style("opacity", .9)
        div.html(i[0].substring(0, 4) + " " + quarters(i) + "<br>" + "$" + parseFloat(i[1]/1000).toFixed(2) + " Billion(s)")
          .attr('data-date', i[0])
          .style("left", (d.pageX - 30) + "px")	
          .style("top", 400 + "px");
      })					
      .on("mouseout", function(d, i) {
        div.transition()
          .duration(500)		
          .style("opacity", 0);	
      });
  
    svg.append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .attr("id", "x-axis")
      .call(xAxis);
  
    svg.append("g")
      .attr("transform", "translate(" + padding + ", 0)")
      .attr("id", "y-axis")
      .call(yAxis);
  
  });
    
