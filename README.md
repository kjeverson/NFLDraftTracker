# NFLDraftTracker
A web application designed to track and display information about the NFL draft and prospects. Built with Python, Flask, SQLAlchemy, Bootstrap, and jQuery.

## Features:

- Draft Tracking:
  
    - User interface with a responsive draft board that follows the current pick
    - Animations and sounds for when teams are: on the clock, trading picks, or selecting a prospect
    - Responsive prospect search bar
    - Trade modal that facilitates trades between picks, using only the current year's draft picks
    
- Prospect Tracking:

    - Editable Prospect draft profiles, that include: measurables, overviews, strengths, weaknesses, roles and comparisons
    - Ability to favorite a prospect or mark them as having concerns
    - Ability to add prospects on the fly, if they do not exist in the ESPN top prospects list
    
- Team Control:

    - Ability to view and edit team needs on a team by team basis
    - View each team's draft selections
    

- Database Control:

    - Ability to drop the prospect database and rebuild it using a given draft class year
    - Ability to drop pick order and manually rebuild within the web app
    
## Setup/Installation

Built with simplicity in mind, aimed to deliver something with very little dependencies and provided necessary frameworks via CDNs.
### Current Dependencies:
```buildoutcfg
beautifulsoup4==4.9.3
Flask==2.0.1
Flask_SQLAlchemy==2.5.1
Pillow==8.2.0
Pillow==11.1.0
Requests==2.32.3
SQLAlchemy==1.4.15
```

### Running the Application:
Clone this repo, and install all necessary dependencies. Navigate to the main repo and run the following:
```bash
flask run
```
Open your browser (only tested on Firefox currently), and navigate to:
```buildoutcfg
http://localhost:5000/
```
This should work as cloned, but if the database is outdated it might be in your best interest to rebuild it. Thankfully this can be done in the web app itself.

### Rebuilding Database:

#### Rebuilding Prospect Database:
- Navigate to the "Database Control" Page
- Click "Drop Prospects", and confirm the decision
- Enter a draft class year in the "Add Prospects" section
- Click "Add Prospects"

The web app will now go and manually rebuild the prospects for that given year. If using 2024 or 2025 draft class, expect almost all of the Prospect images to be there, if not you can add all the headshots (provided ESPN has them) by clicking "Get Headshots" button.

Additionally, draft order changes from year to year and isn't finalized until after the season. If you need to rebuild that table in the database, follow these steps:

#### Rebuilding the Draft Pick Database:
- Click "Drop Draft Picks", and confirm the decision
- Navigate to the "Draft Order" page under the "Settings" drop down 
- Manually rebuild the database, ensuring you click "Finalize Round" between rounds

The web app should work provided there are prospects and draft picks in their respective tables. That being said, I cannot confirm how it will run if you drop either table after picks have been made.
    
### Adding Information:

#### Prospects
I use ESPN's Top NFL Draft Prospects to build out the prospect table. It provides me with prospect names, positions, ranks, heights/weights, and occasionally overviews. Anything else not provided currently has to be manually entered using the "Edit" button on prospect profiles.

Also, at any given time of the year this method can return empty or incomplete lists of prospects, so make sure to check/add the respective draft class multiple times as the draft gets closer. Logic is in place to make sure prospects that already exist don't get overwritten, so everything you manually enter will not be lost.

That being said, ESPN sometimes miss guys. Because of this there is a means of adding prospects manually. Just use the "Add Prospect" button found on the "War Room" or "Prospects" page. This simply requires: first name, last name, position, and college to initiate a prospect. They can then be edited like every other prospect in the database, from the "Edit" button found on their prospect profile.

#### Colleges
I use ESPN's college list, and have no means of updating that (I currently don't see the need to add any more colleges, as the most common ones should be there). But if a college needs to be added, it can be manually added using the "Add College" button found on the "Edit Colleges" page under the "Settings" tab.


