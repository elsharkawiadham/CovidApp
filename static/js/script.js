Promise.all([
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    fetch("/data/scatter").then(res => res.json())
]).then(([geoData, data]) => {

    const width = window.innerWidth;
    const height = window.innerHeight - 70;

    const svg = d3.select("#map")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("width", "100%")
        .style("height", "100%");

    const g = svg.append("g");

    const dataMap = new Map(data.map(d => [d.entity, d]));

    const urlParams = new URLSearchParams(window.location.search);
    const initialContinent = urlParams.get("continent") || "All";

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });

    svg.call(zoom);

    d3.select("#resetZoom").on("click", () => {
        svg.transition()
            .duration(800)
            .call(zoom.transform, d3.zoomIdentity);

        d3.select("#continent").property("value", "All");
        d3.select("#metric").property("value", "cases");

        currentMetric = "cases";

        updateMap();
    });
    
    const projection = d3.geoNaturalEarth1()
        .scale(width / 6)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    let currentMetric = "cases";

    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "#05668D")
        .style("color", "#F0F3BD")
        .style("padding", "6px")
        .style("border-radius", "6px")
        .style("font-size", "12px")
        .style("opacity", 0);

    function getValue(d) {
        const value = currentMetric === "cases" ? d.cases : d.deaths;
        return value === 0 ? 1 : value;
    }

    function updateMap() {

        const selectedContinent = d3.select("#continent").node().value;

        const filtered = selectedContinent === "All"
            ? data
            : data.filter(d => d.continent === selectedContinent);

        const colorScale = d3.scaleQuantile()
            .domain(filtered.map(d => getValue(d)))
            .range([
                "#f0ff00",
                "#ffce00",
                "#ff9a00",
                "#ff5a00",
                "#ff0000"
            ]);

        g.selectAll("path")
            .data(geoData.features)
            .join("path")
            .attr("d", path)
            .attr("fill", d => {
                const country = dataMap.get(d.properties.name);

                if (!country) return "#eee";

                if (selectedContinent !== "All" && country.continent !== selectedContinent) {
                    return "#eee";
                }

                return colorScale(getValue(country));
            })
            .attr("stroke", "#ccc")

            .on("mouseover", (event, d) => {
                const country = dataMap.get(d.properties.name);

                tooltip.style("opacity", 1)
                    .html(country
                        ? `<strong>${country.entity}</strong><br>
                           Cases: ${country.cases}<br>
                           Deaths: ${country.deaths}`
                        : "No data"
                    );
            })

            .on("mousemove", (event) => {
                tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 15) + "px");
            })

            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });
    }

    d3.select("#continent").property("value", initialContinent);
    updateMap();

    d3.select("#metric").on("change", function () {
        currentMetric = this.value;
        updateMap();
    });

    d3.select("#continent").on("change", function () {
        updateMap();
    });

});


window.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const closeBtn = document.getElementById("closePopup");

    if (popup && closeBtn) {
        closeBtn.addEventListener("click", () => {
            popup.style.display = "none";
        });
    }
});

window.addEventListener("resize", () => {
    location.reload();
});