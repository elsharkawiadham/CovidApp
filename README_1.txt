---- app.py ----

from flask import Flask, render_template, jsonify, request
👉 You are importing tools from Flask:
	•	Flask → creates the web app
	•	jsonify → sends data as JSON (for your map) to D3.js
	•	request → reads data from user (forms, URL, etc.)

🧠 WHAT IS D3.js? 

👉 D3.js = JavaScript library for data visualization
	•	Turns data → visual elements
	•	Uses HTML, SVG, CSS
	•	Creates interactive charts and maps

app = Flask(__name__)
	•	Flask(...) → builds the web app
	•	__name__ → tells Flask where the app is located

continent = request.args.get("continent", "All")
👉 Gets a value from the URL parameters

    if request.method == "POST":
        name = request.form.get("name")

🔹 POST (method)
👉 How data is sent

🔹 get() (function)
👉 How you read the data

cursor = conn.cursor()
👉 The cursor is what lets you:
	•	run SQL queries
	•	fetch data from the databas

if __name__ == "__main__":
    app.run(debug=True)

👉 Means:
	•	“this file is being run directly”
	•	not imported from another file


@app.route("/data/scatter")
def data():

👉 Creates a route (URL endpoint) in your Flask app
👉 This route is used by your JavaScript:
fetch("/data/scatter")


---- create_db.py -----
reader = csv.DictReader(file)
👉 Reads a CSV file and converts each row into a dictionary

why? 👉 Because:
	•	easier to access data by column name
	•	no need to remember positions

conn.commit()
👉 Saves changes to the database permanently


--- index.html -------

function goTo(continent) {
    window.location.href = "/visualization?continent=" + encodeURIComponent(continent);
    🔹 encodeURIComponent(continent)
        👉 Makes the value safe for URLs
        Example: "North America" → "North%20America"

👉 avoids errors in URL
}

---- visualization.html ----

<script src="/static/script.js"></script>
If you put it in <head>:
👉 JS runs before the HTML is loaded
so: d3.select("#map")
👉 ❌ #map does NOT exist yet
👉 💥 error or nothing happens

<script src="https://d3js.org/d3.v7.min.js"></script>
👉 This loads the D3.js library into your project
You used D3 to:
	•	draw the map (SVG paths) 🌍
	•	color countries 🎨
	•	handle interactions (hover, zoom) 🖱

👉 It’s loaded from a CDN (Content Delivery Network)
→ faster, no need to install locally




---- contact.html ----

form.addEventListener("submit", async (e) => {
    // (e) is the event object that contains info about the submit action
    // => 👉 arrow function (short way to write functions)
    // async 👉 allows you to use await inside the function


    e.preventDefault();
    // prevent page load to keep a smooth UX

    const formData = new FormData(form);
    // 👉 FormData is a class (blueprint)
    // 👉 new = create an instance (object) from that class
    // this is OOP
    // collect data from the form

    const response = await fetch("/contact", {
        method: "POST",
        body: formData
    });
    // fetch 👉 sends a request to the server
    // sends the data to backend (app.py)

    if (response.ok) {
        successMsg.style.display = "block";
        form.reset();
    }
    // 👉 Shows message + clears form
});

I used a quantile color scale where the domain is based on the dataset values, and each value is mapped to a color to represent intensity.