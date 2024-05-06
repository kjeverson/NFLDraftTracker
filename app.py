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

from NFLDraftTracker.lib.team import NFLTeam, NCAATeam, add_college_team
from NFLDraftTracker.lib.prospect import Prospect, add_prospect
from NFLDraftTracker.lib.draft_pick import DraftPick, get_current_pick


@app.route('/')
def big_board():
    prospects = Prospect.query.all()
    picks = DraftPick.query.all()
    teams = NFLTeam.query.all()

    current_pick = get_current_pick()
    if current_pick:
        data = {"current_pick": current_pick.pick}
    else:
        data = {"current_pick": None}

    return render_template("draftboard.html", prospects=prospects, picks=picks, teams=teams, data=data)


@app.route('/team', methods=['GET'])
def get_team():
    team_id = int(request.args.get("id"))
    team = NFLTeam.query.get(team_id)

    drafted = []

    for prospect in team.draftees:
        if prospect.position in ['OG', 'C', 'IOL']:
            drafted.append("IOL")

        else:
            drafted.append(prospect.position)

    return render_template("builds/teamControl.html", team=team, needs=team.get_needs(), drafted=drafted)


@app.route('/prospectPosition', methods=['GET'])
def get_prospects_by_position():
    pos = request.args.get("pos")
    show_drafted = request.args.get("show_drafted")
    show_drafted = True if show_drafted == 'true' else False

    selected = pos

    if pos == "ALL":
        if show_drafted:
            prospects = Prospect.query.all()
        else:
            prospects = Prospect.query.filter_by(draft_pick_id=None).all()

    else:
        pos = [request.args.get("pos")]

        if pos[0] == "IOL":
            pos = ['OG', 'C', 'IOL']

        if pos[0] == "ST":
            pos = ['K', 'P', 'LS']

        prospects = []
        for p in pos:
            if show_drafted:
                prospects.extend(Prospect.query.filter_by(position=p).all())
            else:
                prospects.extend(Prospect.query.filter_by(position=p, draft_pick_id=None).all())

    pick = get_current_pick()

    return render_template("builds/prospectList.html", prospects=prospects, current_pick=pick, selected=selected, show_drafted=show_drafted)


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


@app.route('/draftPickModal', methods=['GET'])
def draft_pick_modal():
    draft_pick_id = int(request.args.get("ID"))
    draft_pick = DraftPick.query.get(draft_pick_id)
    return render_template("builds/draftPickModal.html", draft_pick=draft_pick)


@app.route('/getDraftPicks', methods=['GET'])
def get_draft_picks():
    pick = get_current_pick()
    picks = DraftPick.query.all()
    return render_template("builds/draftPicks.html", picks=picks, current_pick=pick)


@app.route('/draftProspect', methods=['POST'])
def draft_prospect():
    prospect_id = request.form.get("prospect_id")
    pick_id = int(request.form.get("pick_id"))

    prospect = Prospect.query.get(prospect_id)
    pick = DraftPick.query.get(pick_id)

    prospect.draft(pick)

    next_pick = get_current_pick()
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
        "nextPick": next_pick.pick,
        "nextPickMsg": next_pick_msg,
        "nextPickColor": next_pick_color
    }

    return jsonify(draft_pick)


@app.route('/undoDraftSelection', methods=['POST'])
def undo_draft_selection():
    draft_pick_id = int(request.form.get("ID"))
    draft_pick = DraftPick.query.get(draft_pick_id)

    prospect = draft_pick.prospect[0]

    prospect.undo_selection()
    return jsonify({"current_pick": draft_pick.pick})


@app.route('/getTradeModal', methods=['GET'])
def get_trade_modal():
    current_pick = get_current_pick()
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

    return jsonify({"current_pick": get_current_pick().pick})


@app.route('/colleges', methods=['GET'])
def colleges():
    return render_template("colleges.html")


@app.route('/collegesList', methods=['GET'])
def colleges_list():
    colleges = NCAATeam.query.all()
    return render_template("builds/collegeList.html", colleges=colleges)


@app.route('/addCollegeModal', methods=['GET'])
def add_college_modal():
    return render_template("builds/addCollegeModal.html")


@app.route('/addCollege', methods=['POST'])
def add_college():
    name = request.form.get("name")
    mascot = request.form.get("mascot")
    key = request.form.get("key")
    color = request.form.get("color")

    add_college_team(db, name, mascot, key, color)

    return jsonify()


@app.route('/editCollegeModal', methods=['GET'])
def edit_college_modal():
    id = int(request.args.get("ID"))
    college = NCAATeam.query.get(id)
    return render_template("builds/editCollegeModal.html", college=college)


@app.route('/editCollege', methods=['POST'])
def edit_college():
    id = int(request.form.get("ID"))
    name = request.form.get("name")
    mascot = request.form.get("mascot")
    key = request.form.get("key")
    color = request.form.get("color")

    college = NCAATeam.query.get(id)
    college.set_color(color)
    college.set_key(key)
    college.set_location(name)
    college.set_name(mascot)

    return jsonify()
