# NFLDraftTracker
2024 NFL Draft Tracker created using Python with Flask and a SQLite Database.

Current features:
- 637 Draft Prospects with measurables, overview, strengths and weakness, and NFL comparison (mostly).
- Responsive draft board that follows the current pick.
- Responsive prospect search bar.
- Ability to add prospects on the fly, if they do not exist in the tracker already.
- Ability to favorite prospects.
- Ability to trade picks (Only allows picks from 2024 at the moment)
- Ability to view draft picks and needs by team using the Team Control section.

Starting the app:

If the app is started as it is in the repository, this doesn't matter. But, if you stop running it, refresh, or want to pick up the draft from one of the saved DB snapshots,  `CURRENT_PICK_NUMBER` will have to be changed to reflect the next pick on the clock. This should be dynamically handled in the future.
```javascript
window.onload = function() {
    getPosition("ALL", CURRENT_PICK_NUMBER);
    getDraftPicks(CURRENT_PICK_NUMBER);
}
```

Video Example:
![Big Board Overview](./README/example.gif)
