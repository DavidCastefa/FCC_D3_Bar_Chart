// Much of the JavaScript used in this project is based on Ganesh H's YouTube walkthrough
// at https://www.youtube.com/watch?v=w5vxVj8g3cs

let dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
let req = new XMLHttpRequest

let data = ""
let values = []
let datesArray

let heightScale 
let xScale 
let xAxisScale 
let yAxisScale 


let height = window.innerHeight * 0.9;
let width = window.innerWidth * 0.92;
let padding = 60

let svg = d3.select("svg")

let drawCanvas = () => {
  svg.attr("height", height)
  svg.attr("width", width)
}

let generateScales = () => {
  heightScale = d3.scaleLinear()
                  .domain([0, d3.max(values, dataItem => dataItem[1])])
                  .range([0, height - 2 * padding])
  xScale = d3.scaleLinear()
             .domain([0, values.length -1])
             .range([padding, width - padding])
  xAxisScale = d3.scaleTime()
                 .domain([d3.min(datesArray), d3.max(datesArray)])
                 .range([padding, width - padding])
  yAxisScale = d3.scaleLinear()
                .domain([0, d3.max(values, dataItem => dataItem[1])])
                .range([height - padding, padding])                                         
}

let generateAxes = () => {
  let xAxis = d3.axisBottom(xAxisScale)
  svg.append("g")
     .attr("id", "x-axis")
     .call(xAxis)
     .attr("transform", "translate(0, " + (height - padding) + ")");

  let yAxis = d3.axisLeft(yAxisScale)   
  svg.append("g")
     .attr("id", "y-axis")
     .call(yAxis)
     .attr("transform", "translate(" + padding + ", 0)");
} 

let drawBars = () => {

  let tooltip = d3.select("body")
                  .append("div")
                  .attr("id", "tooltip")
                  .style("opacity", 0)

  // prepare to convert "2001-11-25" date format into "Nov 2001" format
  // for visualizing with the tooltip             
  let dataDateFormat = d3.timeParse("%Y-%m-%d");
  let tooltipFormatDate = d3.timeFormat("%b %Y");

  svg.selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", (width - 2* padding ) / values.length)
    .attr("data-date", item => item[0])
    .attr("data-gdp", item => item[1])
    .attr("height", item => heightScale(item[1]))
    .attr("x", (item, index) => xScale(index))
    .attr("y", item => height - padding - heightScale(item[1]))
    .on("mouseover", (event, item) => {
      tooltip.style("opacity", 1)
             .attr("data-date", item[0])
             .html(tooltipFormatDate(dataDateFormat(item[0])) 
              + "<br/>"  + "$" + item[1] + " Billion")
      })
    .on("mouseleave", (event, item) => {
      tooltip.style("opacity", 0);
      })
}

req.open("GET", dataUrl, true)
req.onload = () => {
  rawData = JSON.parse(req.responseText)
  values = rawData.data

  // convert date strings into datetimes to generate the xAxisScale
  datesArray = values.map(item => new Date(item[0]))

  drawCanvas()
  generateScales()
  generateAxes()
  drawBars()
}
req.send()
