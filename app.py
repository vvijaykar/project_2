#################################################
# Dependencies/Setup
#################################################
import os
import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import func

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

####### Route to pull options for FES presence
@app.route("/fes")
def fesOptions():
    fesOptions = []

    sel =[data.FES]
    result = db.session.query(*sel).all()

    for o in result:
        if o[0] in fesOptions:
            pass
        else:
            fesOptions.append(o[0])

    return jsonify(behaviors)

####### Route to pull list of Behavior Names
@app.route("/behaviors")
def behaviors():

    behaviors = []

    behavior_sel =[data.Behavior]
    behavior_result = db.session.query(*behavior_sel).filter(data.Behavior != "FES Present or Found").all()

    for b in behavior_result:
        # behavior_list = {}
        if b[0] in behaviors:
            pass
        else:
            behaviors.append(b[0])

    return jsonify(behaviors)

####### Route to pull list of ST
@app.route("/states")
def states():

    states = []

    sel = [data.ST]
    result = db.session.query(*sel).all()

    for st in result:
        # behavior_list = {}
        if st[0] in states:
            pass
        else:
            states.append(st[0])

    return jsonify(states)

####### Pulling Data by ST for metadata -- dashboard/tooltip
@app.route("/data/<Behavior>")
def maindata(Behavior):
    
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
    results = db.session.query(*sel).filter(data.Behavior == Behavior).all()
    # Create a dictionary to hold the values
    st_data = []
    # Iterate through results and store data
    for r in results:
        if r.Percent is None:
            percent = 0
        else:
            percent = float(r.Percent)
        store_data = {
            'FES': r.FES,
            'ST': r.ST,
            'MSA': r.MSA,
            'City': r.City,
            'StoreID': r.StoreID,
            'Behavior': r.Behavior,
            'Received': int(r.Received),
            'Possible': int(r.Possible),
            'Percent': percent
        }
        st_data.append(store_data)
    
    return jsonify(st_data)

####### Pulling ALL Data w/o filters
@app.route("/data")
def alldata():
    
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
    all_data = []
    # Iterate through results and store data
    for r in results:
        if r.Percent is None:
            percent = 0
        else:
            percent = float(r.Percent)
        store_data = {
            'FES': r.FES,
            'ST': r.ST,
            'MSA': r.MSA,
            'City': r.City,
            'StoreID': r.StoreID,
            'Behavior': r.Behavior,
            'Received': int(r.Received),
            'Possible': int(r.Possible),
            'Percent': percent
        }
        all_data.append(store_data)
    
    return jsonify(all_data)

####### Sum by behavior and fes
@app.route("/data/behavior")
def barchart():
    
    # Select all of the columns
    sel_fes = [
        data.Behavior,
        (func.sum(data.Received)*100/func.sum(data.Possible)).label('avg')
    ]
    # Query the db
    results_fes = db.session.query(*sel_fes).filter(data.FES == 'FES Present', data.Behavior != "FES Present or Found").group_by(data.Behavior).order_by(data.Behavior).all()
    results_nofes = db.session.query(*sel_fes).filter(data.FES == 'No FES Present', data.Behavior != "FES Present or Found").group_by(data.Behavior).order_by(data.Behavior).all()
    # Create a dictionary to hold the values
    behaviors = []
    fes = ['FES_Present']
    nofes = ['No_FES_Present']
    # Iterate through results and store data
    for r in results_fes:
        behaviors.append(r.Behavior)
        fes.append(r.avg)
    
    for r in results_nofes:
        nofes.append(r.avg)
    
    all_data = {
        'Behavior': behaviors,
        'FES': fes,
        'NoFES': nofes
    }

    return jsonify(all_data)

if __name__ == "__main__":
    app.run(debug=True)