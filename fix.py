from app import db, app

# Following code fixes the state of the Database, this should only need to be run once, but if any DB errors occur having to do with missing tables, etc, re-run this.

with app.app_context():
  db.create_all()
  db.session.commit()
