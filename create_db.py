import sqlite3
import csv

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

cursor.execute("DROP TABLE IF EXISTS covid")

cursor.execute("""
CREATE TABLE covid (
    entity TEXT,
    continent TEXT,
    latitude REAL,
    longitude REAL,
    temperature REAL,
    hospital_beds REAL,
    doctors REAL,
    gdp REAL,
    population REAL,
    median_age REAL,
    age_65 REAL,
    date TEXT,
    tests REAL,
    cases REAL,
    deaths REAL
)
""")
with open("Covid-stats.csv", newline='', encoding="utf-8") as file:
    reader = csv.DictReader(file)

    for row in reader:
        cursor.execute("""
        INSERT INTO covid VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            row["Entity"],
            row["Continent"],
            float(row["Latitude"] or 0),
            float(row["Longitude"] or 0),
            float(row["Average temperature per year"] or 0),
            float(row["Hospital beds per 1000 people"] or 0),
            float(row["Medical doctors per 1000 people"] or 0),
            float(row["GDP/Capita"] or 0),
            float(row["Population"] or 0),
            float(row["Median age"] or 0),
            float(row["Population aged 65 and over (%)"] or 0),
            row["Date"],
            float(row["Daily tests"] or 0),
            float(row["Cases"] or 0),
            float(row["Deaths"] or 0)
        ))

conn.commit()
conn.close()