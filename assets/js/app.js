// initial setup
var svgWidth = 1000;
var svgHeight = 600;

// define margins
var margin = {
  top: 50 ,
  right: 100,
  bottom: 50,
  left: 100
};

// define canvas using margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// select scatter div
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

// create chart group

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// get data
// d3.csv("assets/data/data.csv", function(error, csvdata) {
//     if (error) throw error;
//     console.log(csvdata);

// d3.csv("assets/data/data.csv").then(function (err, csvdata) {
//   if (err) throw err;

d3.csv("assets/data/data.csv").then(function (csvdata) {

    csvdata.forEach(function (data) {
        data.income = parseInt(data.income/1000);
        data.smokes = parseInt(data.smokes);
  });

  // scales
  var xLinearScale = d3.scaleLinear()
    .domain([2, d3.max(csvdata, d => d.smokes)])
    .range([2, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(csvdata, d => d.income)])
    .range([height, 20]);

  // axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  chartGroup.append("g")
    .attr("transform", `translate(6, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

    // dots
  var circlesGroup = chartGroup.selectAll("circle")
  .data(csvdata)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.smokes))
  .attr("cy", d => yLinearScale(d.income))
  .attr("r", "20")
  .attr("fill", "green")
  .attr("opacity", ".7")

  // dot labels
  var textGroup = chartGroup.selectAll("#circleText")
  .data(csvdata)
  .enter()
  .append("text")
  .text(d => d.abbr)
  .attr("id", "circleText")
  .attr("x", d => xLinearScale(d.smokes-0.25))
  .attr("y", d => yLinearScale(d.income-0.5))
  .attr("stroke-width", "1")
  .attr("fill", "white")
  .attr("font-size", 15);

  // axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 30)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Income ($K's)");

  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top - 10})`)
    .attr("class", "axisText")
    .text("Smokers (%)");
});
