from flask import Flask, render_template, jsonify, request
import sqlite3

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/visualization")
def visualization():
    continent = request.args.get("continent", "All")
    return render_template("visualization.html", continent=continent)

@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")

        with open("messages.txt", "a", encoding="utf-8") as f:
            f.write("----- NEW MESSAGE -----\n")
            f.write(f"Name: {name}\n")
            f.write(f"Email: {email}\n")
            f.write(f"Message: {message}\n\n")

        return {"status": "success"}

    return render_template("contact.html")

@app.route("/data/scatter")
def data():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT c.entity, c.continent, c.cases, c.deaths, c.population
        FROM covid c
        JOIN (
            SELECT entity, MAX(date) as max_date
            FROM covid
            GROUP BY entity
        ) latest
        ON c.entity = latest.entity AND c.date = latest.max_date
    """)

    rows = cursor.fetchall()
    conn.close()

    return jsonify([
        {
            "entity": r[0],
            "continent": r[1],
            "cases": r[2],
            "deaths": r[3],
            "population": r[4]
        } for r in rows
    ])

if __name__ == "__main__":
    app.run(debug=True)