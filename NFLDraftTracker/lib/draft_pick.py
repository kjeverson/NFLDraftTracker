from app import db
import json


class DraftPick(db.Model):
    __tablename__ = "draft_pick"
    ID = db.Column(db.Integer, primary_key=True)
    round = db.Column(db.Integer)
    pick = db.Column(db.Integer)
    team_id = db.Column(db.Integer, db.ForeignKey('nfl_team.ID'))
    prospect = db.relationship('Prospect', backref='draft_pick')
    traded = db.Column(db.Boolean)

    def trade(self, new_owner):
        self.traded = True
        self.team_id = new_owner.ID
        db.session.commit()


def add_draft_picks(database):
    for i in range(257):
        ID = i + 1
        pick = ID
        print(pick)

        if pick >= 1 and pick <= 32:
            r = 1
        elif pick >= 33 and pick <= 64:
            r = 2
        elif pick >= 65 and pick <= 100:
            r = 3
        elif pick >= 101 and pick <= 135:
            r = 4
        elif pick >= 136 and pick <= 176:
            r = 5
        elif pick >= 177 and pick <= 220:
            r = 6
        else:
            r = 7

        database.session.add(DraftPick(
            ID=ID,
            round=r,
            pick=ID,
        ))
