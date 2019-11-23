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

# Pulling Data by ST for metadata -- dashboard/tooltip
@app.route("/metadata/<ST>")
def maindata(ST):
    
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
    results = db.session.query(*sel).filter(data.ST == ST).all()
    # Create a dictionary to hold the values
    st_data = []
    # Iterate through results and store data
    for r in results:
        store_data = {
            'FES': r.FES,
            'ST': r.ST,
            'MSA': r.MSA,
            'City': r.City,
            'StoreID': r.StoreID,
            'Behavior': r.Behavior,
            'Received': int(r.Received),
            'Possible': int(r.Possible),
            'Percent': float(r.Percent)
        }
        st_data.append(store_data)
    
    return jsonify(st_data)

# # Pulling data by st for percent values to chart
# @app.route("/values/<ST>")
# def percents(ST):
#     """Return `otu_ids`, `otu_labels`,and `sample_values`."""
#     stmt = db.session.query(data).statement
#     df = pd.read_sql_query(stmt, db.session.bind)

#     # Filter the data based on the ST and
#     # only keep rows with values above 1 DO WE NEED THIS?
#     sample_data = df.loc[df[ST], ["otu_id", "otu_label", ST]]

#     # Sort by sample
#     sample_data.sort_values(by=sample, ascending=False, inplace=True)

#     # Format the data to send as json
#     data = {
#         "otu_ids": sample_data.otu_id.values.tolist(),
#         "sample_values": sample_data[sample].values.tolist(),
#         "otu_labels": sample_data.otu_label.tolist(),
#     }
#     return jsonify(data)

if __name__ == "__main__":
    app.run()