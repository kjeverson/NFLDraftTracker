from app import db
import requests
from PIL import Image, UnidentifiedImageError
from pathlib import Path
import re
from NFLDraftTracker.lib.team import NCAATeam
import sys
import hashlib


class Prospect(db.Model):
	__tablename__ = "prospect"
	ID = db.Column(db.Integer, primary_key=True)
	athlete_id = db.Column(db.Integer)
	
	name = db.Column(db.String(50), nullable=False)
	fname = db.Column(db.String(25), nullable=False)
	lname = db.Column(db.String(25), nullable=False)
	sname = db.Column(db.String(25), nullable=False)

	college_id = db.Column(db.Integer, db.ForeignKey('ncaa_team.ID'))
	drafted_id = db.Column(db.Integer, db.ForeignKey('nfl_team.ID'))
	draft_pick_id = db.Column(db.Integer, db.ForeignKey('draft_pick.ID'))

	height = db.Column(db.String(6))
	weight = db.Column(db.Integer)
	arm = db.Column(db.String(10))
	hand = db.Column(db.String(10))
	forty = db.Column(db.Float)
	vertical = db.Column(db.String(4))
	broad = db.Column(db.String(8))
	three_cone = db.Column(db.Float)
	twenty_shuttle = db.Column(db.Float)
	bench = db.Column(db.Integer)
	ras = db.Column(db.Float)
	age = db.Column(db.Integer)
	
	grade = db.Column(db.Float)
	rank = db.Column(db.Integer)

	position = db.Column(db.String(5))
	
	comparison = db.Column(db.String(50))
	overview = db.Column(db.Text())
	strengths = db.Column(db.Text())
	weaknesses = db.Column(db.Text())

	favorite = db.Column(db.Boolean)

	def __repr__(self):
		return "Player({}-{})".format(self.name, self.position)

	def __gt__(self, prospect):
		return self.rank > prospect.rank

	def get_headshot(self):
		prospect_url = "http://sports.core.api.espn.com/v2/sports/football/leagues/college-football/athletes/{}"

		print(self.name, self.ID)
		if not self.athlete_id:
			return
		prospect_url = prospect_url.format(self.athlete_id)
		data = requests.get(prospect_url).json()
		image = data.get('headshot')
		if image:
			image = image['href']
			img_path = Path("/Users/everson/NFLDraftTracker/NFLDraftTracker/static/headshots/{}.png".format(self.ID))
			if img_path.exists():
				return
			image_data = requests.get(image, stream=True)
			with img_path.open('wb') as image_file:
				image = Image.open(image_data.raw)
				image.save(image_file)

	def draft(self, pick):
		self.drafted_id = pick.pick_owner.ID
		self.draft_pick_id = pick.ID
		db.session.commit()

	def undo_selection(self):
		self.drafted_id = None
		self.draft_pick_id = None
		db.session.commit()

	def set_position(self, position):
		self.position = position
		db.session.commit()

	def set_rank(self, rank):
		self.rank = int(rank)
		db.session.commit()

	def set_comparison(self, comparison):
		self.comparison = comparison
		db.session.commit()

	def set_write_ups(self, overview, strengths, weaknesses):
		self.overview = overview
		self.strengths = strengths
		self.weaknesses = weaknesses
		db.session.commit()

	def set_height_weight(self, height, weight):
		self.height = height
		try:
			self.weight = int(weight)
		except ValueError:
			pass
		db.session.commit()

	def set_combine_result(self, forty, vertical, broad, three_cone, twenty_shuttle, bench, ras):
		try:
			self.forty = float(forty)
		except ValueError:
			pass

		self.vertical = vertical
		self.broad = broad

		try:
			self.three_cone = float(three_cone)
		except ValueError:
			pass

		try:
			self.twenty_shuttle = float(twenty_shuttle)
		except ValueError:
			pass

		try:
			self.bench = int(bench)
		except ValueError:
			pass

		try:
			self.ras = float(ras)
		except ValueError:
			pass

		db.session.commit()

	def favorite_prospect(self, favorite_string):
		if favorite_string == 'true':
			self.favorite = True
		else:
			self.favorite = False

		db.session.commit()


def add_prospect(database, fname, lname, position, college_id):
	name = "{} {}".format(fname, lname)
	sname = "{}. {}".format(fname[0], lname)

	college = NCAATeam.query.get(college_id)

	id = int(hashlib.sha256(name.encode('utf-8')).hexdigest(), 16) % 10**8

	database.session.add(Prospect(
		ID=id,
		name=name,
		fname=fname,
		lname=lname,
		sname=sname,
		college_team=college,
		rank=0,
		position=position,
	))
	db.session.commit()


def get_all_prospects():
	draft_prospects_url = "http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2024/draft/athletes?limit=1000"
	response = requests.get(draft_prospects_url)
	prospect_list = response.json()['items']

	prospects_data = []
	for prospect in prospect_list:
		prospects_data.append(requests.get(prospect['$ref']).json())

	return prospects_data


def add_prospects(database, prospects):
	for i in range(len(prospects)):
		print(i, prospects[i]['displayName'])
		prospect = prospects[i]
		rank = i+1

		college = ""
		try:
			college_string = prospect['college']['$ref']
			college_string = re.search(r'colleges\/(\d+)', college_string)
			college_id = int(college_string.groups()[0])
			college = NCAATeam.query.get(college_id)
		except KeyError:
			continue

		analysis = ""
		try:
			analysis = prospect['analysis'][0]['text']
		except (KeyError, IndexError):
			pass

		grade = 0
		try:
			grade = prospect['attributes'][1]['value']
		except (KeyError, IndexError):
			pass

		height = prospect['height']
		try:
			height = prospect['displayHeight']
		except KeyError:
			pass

		try:
			id_string = prospect['athlete']['$ref']
			id_string = re.search(r'athletes\/(\d+)', id_string)
			player_id = int(id_string.groups()[0])
		except KeyError:
			player_id = None
			pass

		database.session.add(Prospect(
			ID=prospect['id'],
			athlete_id=player_id,
			name=prospect['displayName'],
			fname=prospect['firstName'],
			lname=prospect['lastName'],
			sname=prospect['shortName'],
			college_team=college,
			height=height,
			weight=prospect['weight'],
			rank=rank,
			position=prospect['position']['abbreviation'],
			grade=grade,
			overview=analysis,
		))

