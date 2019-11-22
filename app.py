#################################################
# Dependencies/Setup
#################################################

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#################################################
# Database Setup
#################################################
app.config["SQLALCHEMY_TRACK_MODIFICATION"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///Data/db/fes_db.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
data = Base.classes.final_fes_data


#################################################
# Routes
#################################################

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

####### Route to pull list of Behavior Names
@app.route("/behaviors")
def behaviors():

    behaviors = []

    behavior_sel =[data.Behavior]
    behavior_result = db.session.query(*behavior_sel).all()

    for b in behavior_result:
        # behavior_list = {}
        if b[0] in behaviors:
            pass
        else:
            behaviors.append(b[0])

    return jsonify(behaviors)


@app.route("/data")
def maindata():
    
    # Select all of the columns
    sel = [
        data.FES,
        data.ST,
        data.MSA,
        data.City,
        data.StoreID,
        data.Behavior,
        data.Received,
        data.Possible,
        data.Percent
    ]
    # Query the db
    results = db.session.query(*sel).all()
    # Create a dictionary to hold the values
    main_data = []
    # Iterate through results and store data
    for result in results:
        fes_data = {}
        fes_data["FES"] = result[0]
        fes_data["ST"] = result[1]
        fes_data["MSA"] = result[2]
        fes_data["City"] = result[3]
        fes_data["StoreID"] = result[4]
        fes_data["Behavior"] = result[5]
        fes_data["Received"] = result[6]
        fes_data["Possible"] = result[7]
        fes_data["Percent"] = result[8]

    print(main_data)
    return jsonify(main_data)

if __name__ == "__main__":
    app.run()