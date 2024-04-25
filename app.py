from flask import Flask, render_template, request, jsonify, url_for
import flask
from flask_sqlalchemy import SQLAlchemy
import logging
import sys


app = flask.Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

db = SQLAlchemy(app)

from NFLDraftTracker.lib.team import NFLTeam, NCAATeam
from NFLDraftTracker.lib.prospect import Prospect, add_prospect
from NFLDraftTracker.lib.draft_pick import DraftPick

# Whoops, forgot to add this to the database, doing it here
needs = {
    "CHI": ['QB', 'WR', 'EDGE', 'OT', 'DT'],
    "WSH": ['QB', 'OT', 'EDGE', 'CB', 'WR'],
    "NE" : ['QB', 'OT', 'CB', 'WR', 'DT'],
    "ARI": ['WR', 'CB', 'EDGE', 'RB', 'IOL'],
    "LAC": ['WR', 'CB', 'IOL', 'OT', 'RB'],
    "NYG": ['WR', 'CB', 'RB', 'S', 'QB'],
    "TEN": ['OT', 'EDGE', 'DT', 'WR', 'LB'],
    "ATL": ['EDGE', 'CB', 'DT', 'S', 'QB'],
    "NYJ": ['TE', 'S', 'WR', 'LB', 'CB'],
    "MIN": ['QB', 'IOL', 'EDGE', 'WR', 'DT'],
    "DEN": ['QB', 'CB', 'DT', 'EDGE', 'OT'],
    "LV" : ['QB', 'CB', 'OT', 'WR', 'IOL'],
    "NO" : ['OT', 'WR', 'CB', 'DT', 'LB'],
    "IND": ['CB', 'WR', 'RB', 'IOL', 'S'],
    "SEA": ['DT', 'LB', 'IOL', 'EDGE', 'TE'],
    "JAX": ['CB', 'DT', 'OT', 'IOL', 'EDGE'],
    "CIN": ['OT', 'DT', 'CB', 'WR', 'TE'],
    "LAR": ['DT', 'EDGE', 'CB', 'OT', 'K'],
    "PIT": ['OT', 'IOL', 'WR', 'CB', 'DT'],
    "MIA": ['IOL', 'DT', 'OT', 'EDGE', 'TE'],
    "PHI": ['CB', 'IOL', 'OT', 'WR', 'S'],
    "DAL": ['OT', 'RB', 'IOL', 'DT', 'WR'],
    "GB" : ['DT', 'LB', 'OT', 'CB', 'S'],
    "TB" : ['EDGE', 'IOL', 'CB', 'S', 'LB'],
    "BUF": ['WR', 'EDGE', 'DT', 'S', 'RB'],
    "DET": ['CB', 'EDGE', 'S', 'WR', 'OT'],
    "BAL": ['IOL', 'OT', 'EDGE', 'WR', 'S'],
    "SF" : ['CB', 'OT', 'IOL', 'WR', 'LB'],
    "KC" : ['WR', 'OT', 'CB', 'RB', 'IOL'],
    "CAR": ['WR', 'TE', 'CB', 'EDGE', 'DT'],
    "CLE": ['OT', 'LB', 'DT', 'WR', 'TE'],
    "HOU": ['CB', 'TE', 'LB', 'IOL', 'DT']
}

drafted = {
    "CHI": [],
    "WSH": [],
    "NE": [],
    "ARI": [],
    "LAC": [],
    "NYG": [],
    "TEN": [],
    "ATL": [],
    "NYJ": [],
    "MIN": [],
    "DEN": [],
    "LV": [],
    "NO": [],
    "IND": [],
    "SEA": [],
    "JAX": [],
    "CIN": [],
    "LAR": [],
    "PIT": [],
    "MIA": [],
    "PHI": [],
    "DAL": [],
    "GB": [],
    "TB": [],
    "BUF": [],
    "DET": [],
    "BAL": [],
    "SF": [],
    "KC": [],
    "CAR": [],
    "CLE": [],
    "HOU": []
}

#current_pick = 1


@app.route('/')
def big_board():
    prospects = Prospect.query.all()
    picks = DraftPick.query.all()
    teams = NFLTeam.query.all()

    #pick = DraftPick.query.get(current_pick)

    return render_template("draftboard.html", prospects=prospects, picks=picks, teams=teams)


@app.route('/team', methods=['GET'])
def get_team():
    team_id = int(request.args.get("id"))
    team = NFLTeam.query.get(team_id)
    return render_template("builds/teamControl.html", team=team, needs=needs.get(team.key), drafted=drafted.get(team.key))


@app.route('/prospectPosition', methods=['GET'])
def get_prospects_by_position():
    pos = request.args.get("pos")
    pick_id = request.args.get("pick_id")

    selected = pos

    if pos == "ALL":
        prospects = Prospect.query.filter_by(draft_pick_id=None).all()

    else:
        pos = [request.args.get("pos")]

        if pos[0] == "IOL":
            pos = ['OG', 'C', 'IOL']

        if pos[0] == "ST":
            pos = ['K', 'P', 'LS']

        prospects = []
        for p in pos:
            prospects.extend(Prospect.query.filter_by(position=p, draft_pick_id=None).all())

    pick = DraftPick.query.get(pick_id)

    return render_template("builds/bigBoard.html", prospects=prospects, current_pick=pick, selected=selected)


@app.route('/prospectModal', methods=['GET'])
def get_prospect_modal():
    prospect_id = request.args.get("id")
    prospect = Prospect.query.get(prospect_id)
    strengths = prospect.strengths.split("\n") if prospect.strengths else ""
    weaknesses = prospect.weaknesses.split("\n") if prospect.weaknesses else ""
    return render_template("builds/prospectModal.html", prospect=prospect, strengths=strengths, weaknesses=weaknesses)


@app.route('/editProspectModal', methods=['GET'])
def edit_prospect_modal():
    prospect_id = request.args.get("id")
    prospect = Prospect.query.get(prospect_id)
    return render_template("builds/editProspectModal.html", prospect=prospect)


@app.route('/saveProspect', methods=['POST'])
def save_prospect():
    prospect_id = request.form.get("id")
    overview = request.form.get("overview")
    strengths = request.form.get("strengths")
    weaknesses = request.form.get("weaknesses")
    comparison = request.form.get("comparison")
    position = request.form.get("position")
    rank = request.form.get("rank")
    height = request.form.get("height")
    weight = request.form.get("weight")
    forty = request.form.get("forty")
    vertical = request.form.get("vertical")
    broad = request.form.get("broad")
    three_cone = request.form.get("three_cone")
    twenty_shuttle = request.form.get("twenty_shuttle")
    bench = request.form.get("bench")
    ras = request.form.get("ras")
    favorite = request.form.get("favorite")

    prospect = Prospect.query.get(prospect_id)
    prospect.set_position(position)
    prospect.set_rank(rank)
    prospect.set_comparison(comparison)
    prospect.set_write_ups(overview, strengths, weaknesses)
    prospect.set_height_weight(height, weight)
    prospect.set_combine_result(forty, vertical, broad, three_cone, twenty_shuttle, bench, ras)
    prospect.favorite_prospect(favorite)

    return jsonify()


@app.route('/addProspectModal', methods=['GET'])
def add_prospect_modal():
    colleges = NCAATeam.query.all()
    return render_template("builds/addProspectModal.html", colleges=colleges)


@app.route('/addProspect', methods=['POST'])
def add_prospect_from_modal():
    fname = request.form.get("fname")
    lname = request.form.get("lname")
    position = request.form.get("position")

    try:
        college_id = int(request.form.get("college"))
    except ValueError:
        college_id = None
        pass

    add_prospect(db, fname, lname, position, college_id)

    return jsonify()


@app.route('/getDraftPicks', methods=['GET'])
def get_draft_picks():
    pick_id = request.args.get("current_pick")
    pick = DraftPick.query.get(pick_id)
    picks = DraftPick.query.all()
    return render_template("builds/draftPicks.html", picks=picks, current_pick=pick)


@app.route('/draftProspect', methods=['POST'])
def draft_prospect():
    prospect_id = request.form.get("prospect_id")
    pick_id = int(request.form.get("pick_id"))

    prospect = Prospect.query.get(prospect_id)
    pick = DraftPick.query.get(pick_id)

    position = prospect.position
    if position in ['OG', 'C']:
        position = "IOL"

    drafted[pick.pick_owner.key].append(position)

    prospect.draft(pick)

    next_pick = DraftPick.query.get(pick_id+1)
    if next_pick:
        next_pick_msg = next_pick.pick_owner.fullname + " Are On The Clock!"
        next_pick_color = next_pick.pick_owner.primary_color
    else:
        next_pick_msg = "The 2024 NFL Draft Has Concluded!"
        next_pick_color = "6c757d"

    draft_pick = {
        "sname": prospect.sname,
        "position": prospect.position,
        "college": prospect.college_team.location if prospect.college_team else "None",
        "nextPickMsg": next_pick_msg,
        "nextPickColor": next_pick_color
    }

    return jsonify(draft_pick)


@app.route('/getTradeModal', methods=['GET'])
def get_trade_modal():
    current_pick_id = int(request.args.get("current_pick"))
    current_pick = DraftPick.query.get(current_pick_id)
    teams = NFLTeam.query.all()
    return render_template("builds/tradeModal.html", teams=teams, current_pick=current_pick)


@app.route('/submitTrade', methods=['POST'])
def submit_trade():
    send_team_id = int(request.form.get("sendTeam"))
    rec_team_id = int(request.form.get("recTeam"))
    send_pick_ids = request.form.getlist("sendPickIDs[]")
    rec_pick_ids = request.form.getlist("recPickIDs[]")

    send_team = NFLTeam.query.get(send_team_id)
    rec_team = NFLTeam.query.get(rec_team_id)

    for pick in rec_pick_ids:
        pick = DraftPick.query.get(int(pick))
        pick.trade(send_team)

    for pick in send_pick_ids:
        pick = DraftPick.query.get(int(pick))
        pick.trade(rec_team)

    return jsonify()
