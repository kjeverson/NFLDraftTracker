from app import db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


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

    def serialize(self):
        data = {
            "ID": self.ID,
            "round": self.round,
            "pick": self.pick,
            "pick_owner": self.pick_owner.serialize()
        }

        return data


def add_draft_pick(round, pick, team_id):
    db.session.add(DraftPick(
        ID=pick,
        round=round,
        pick=pick,
        team_id=team_id
    ))
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


def remove_all_draft_picks():
    engine = create_engine('sqlite:///database.db')
    Session = sessionmaker(bind=engine)
    session = Session()

    session.query(DraftPick).delete()
    session.commit()
    session.close()


def remove_draft_pick(ID):
    DraftPick.query.filter_by(ID=ID).delete()
    db.session.commit()


def get_current_pick():
    picks = DraftPick.query.all()
    for pick in picks:
        if not pick.prospect:
            return pick


def get_current_highest_pick_entered():
    picks = DraftPick.query.all()
    if picks:
        current_pick = max(picks, key=lambda pick: pick.pick)
        current_round = current_pick.round
        current_pick = current_pick.pick

    else:
        current_pick = 0
        current_round = 1

    return current_round, current_pick
