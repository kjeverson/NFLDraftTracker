from app import db
import requests
import json


class NFLTeam(db.Model):
	__tablename__ = "nfl_team"
	ID = db.Column(db.Integer, primary_key=True)
	key = db.Column(db.String(3), unique=True)

	location = db.Column(db.String(20), nullable=False)
	name = db.Column(db.String(20))
	fullname = db.Column(db.String(40))

	conference = db.Column(db.String(3))
	division = db.Column(db.String(5))

	primary_color = db.Column(db.String(6))
	secondary_color = db.Column(db.String(6))

	draftees = db.relationship('Prospect', backref='drafted_team',
								foreign_keys="Prospect.drafted_id", lazy=True)

	picks = db.relationship('DraftPick', backref='pick_owner',
							foreign_keys="DraftPick.team_id", lazy=True)

	needs = db.Column(db.String(50))

	def __repr__(self):
		return "NFL({})".format(self.fullname)

	def get_needs(self):
		return self.needs.split()

	def set_needs(self, needs_list):
		self.needs = " ".join(needs_list)
		db.session.commit()


class NCAATeam(db.Model):
	__tablename__ = "ncaa_team"
	ID = db.Column(db.Integer, primary_key=True)
	key = db.Column(db.String(25))

	location = db.Column(db.String(20), nullable=False)
	name = db.Column(db.String(20))
	fullname = db.Column(db.String(40))

	primary_color = db.Column(db.String(6))
	secondary_color = db.Column(db.String(6))

	prospects = db.relationship('Prospect', backref='college_team', foreign_keys="Prospect.college_id", lazy=True)

	def __repr__(self):
		return "College({})".format(self.fullname)


def get_all_team_data(college=False):
	if college:
			teams_url = "http://site.api.espn.com/apis/site/v2/sports/football/college-football/" \
						"teams?limit=1000"
			response = requests.get(teams_url)
			team_data = response.json()['sports'][0]['leagues'][0]['teams']

			teams_data = []
			for team in team_data:
				teams_data.append(team['team'])

	else:
		teams_url = "https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/" \
					"seasons/2024/teams/?limit=32"
		response = requests.get(teams_url)
		team_data = response.json()['items']

		teams_data = []
		for team in team_data:
			teams_data.append(requests.get(team['$ref']).json())

	return teams_data


def add_nfl_teams(database, teams):
	for i in range(len(teams)):
		team = teams[i]

		database.session.add(NFLTeam(
			ID=team['id'],
			key=team['abbreviation'],
			location=team['location'],
			primary_color=team['color'],
			secondary_color=team['alternateColor'],
			name=None,
			fullname=None,
			conference=None,
			division=None,
		))


def add_ncaa_teams(database, teams):
	for i in range(len(teams)):
		team = teams[i]

		try:
			color = team['color']
		except KeyError:
			color = None

		try:
			alternate = team['alternateColor']
		except KeyError:
			alternate = None

		database.session.add(NCAATeam(
			ID=team['id'],
			key=team['abbreviation'],
			location=team['location'],
			primary_color=color,
			secondary_color=alternate,
			name=team['name'],
			fullname=team['displayName'],
		))
