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
Your tool-chain is up to you, but for this application it is recommended you use a python virtual environment. </br>
Clone the repository at: ```git@github.com:kjeverson/NFLDraftTracker.git```

To create the virtual environment run the following commands:
```bash
    cd ~/$path_to/NFLDraftTracker
    python3 -m venv venv
    source venv/bin/activate
    ## To leave the virtual environment simply run 'deactivate'
```
You are now in a python virtual environment. The packages you need to install are follows:

```bash
    pip install flask flask_sqlalchemy requests Pillow bs4 
    #  Alternatively you can also run 'pip install -r requirements.txt'
```
Run the command `pip freeze` and check to make sure it includes, at the minimum, the dependencies listed in `requirements.txt`. </br> 
(Based on your python3 version the venv might have less/more packages and different version, but as long as the packages specified above are included it should work.)

Lastly, you need to initialize the database by running: 
```bash
    python3 NFLDraftTracker/scripts/db_init.py
```
Now you are ready to run the NFL Tracker Application!

### Running the Application
Open your browser, In the address bar of your browser (Not the Search Bar!) navigate to:
```buildoutcfg
    http://localhost:5000/ 
```
OR
```bash
    127.0.0.1:5000
```
    
### Adding Information:

#### Prospects
I use ESPN's Top NFL Draft Prospects to build out the prospect table. It provides me with prospect names, positions, ranks, heights/weights, and occasionally overviews. Anything else not provided currently has to be manually entered using the "Edit" button on prospect profiles.

Also, at any given time of the year this method can return empty or incomplete lists of prospects, so make sure to check/add the respective draft class multiple times as the draft gets closer. Logic is in place to make sure prospects that already exist don't get overwritten, so everything you manually enter will not be lost.

That being said, ESPN sometimes miss guys. Because of this there is a means of adding prospects manually. Just use the "Add Prospect" button found on the "War Room" or "Prospects" page. This simply requires: first name, last name, position, and college to initiate a prospect. They can then be edited like every other prospect in the database, from the "Edit" button found on their prospect profile.

#### Colleges
I use ESPN's college list, and have no means of updating that (I currently don't see the need to add any more colleges, as the most common ones should be there). But if a college needs to be added, it can be manually added using the "Add College" button found on the "Edit Colleges" page under the "Settings" tab.

Enjoy NFL Stuff n' Things 🏈🏈🤘.

