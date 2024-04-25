import requests
from PIL import Image, UnidentifiedImageError
from pathlib import Path

teams_url = "http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=1000"
response = requests.get(teams_url)
team_data = response.json()['sports'][0]['leagues'][0]['teams']

for team in team_data:
    print(team['team']['displayName'])
    img_path = Path("/Users/everson/NFLDraftTracker/static/NCAA/{}.png".format(team['team']['id']))
    if img_path.exists():
        continue
    try:
        image_data = requests.get(team['team']['logos'][1]['href'], stream=True)
    except IndexError:
        continue
    if image_data:
        with img_path.open('wb') as image_file:
            try:
                image = Image.open(image_data.raw)
                image.save(image_file)
            except UnidentifiedImageError:
                pass
