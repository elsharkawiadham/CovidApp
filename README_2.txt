----- script.js ----------
Promise.all([
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    fetch("/data/scatter").then(res => res.json())
]).then(([geoData, data]) => {

I used Promise.all to load both the geographic data and the COVID dataset asynchronously, 
ensuring that the visualization is created only after both are available.


const svg = d3.select("#map")
👉 Creates the SVG canvas where the map will be drawn

        .append("svg")
        // 👉 Append an SVG element inside it
        .attr("viewBox", `0 0 ${width} ${height}`)
        // 👉 Makes it responsive

const g = svg.append("g");
👉 Creates an empty group element

const dataMap = new Map(data.map(d => [d.entity, d]));
The data is retrieved from the database using Flask, converted into JSON,
and then fetched in the frontend where it is processed and visualized.

const initialContinent = urlParams.get("continent") || "All";
👉 Gets the value:
	•	“Europe” if present
	•	“All” if not


const zoom = d3.zoom()
👉 Creates a zoom behavior in D3

    .scaleExtent([1, 8])
    .on("zoom", (event) => {
        g.attr("transform", event.transform);
    });

    svg.call(zoom);
    👉 Activates zoom on the SVG

why always .d3
d3 is the main object of the D3.js library,
and it provides all the functions needed to create and manipulate data visualizations.

d3.select("#resetZoom").on("click", () => {

I could have used 
document.getElementById("resetZoom").addEventListener("click", ...)
but we are already using D3 everywhere

So:
	•	consistent style ✅
	•	same API for selection & events ✅
	•	cleaner integration with D3 code ✅

const projection = d3.geoNaturalEarth1()
    .scale(width / 6)
    .translate([width / 2, height / 2]);
const path = d3.geoPath().projection(projection);

The projection converts geographic coordinates into screen coordinates,
and the geoPath function generates the SVG paths used to draw the map