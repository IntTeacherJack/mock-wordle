# Classroom Wordle

A Wordle-style game for a whole-class display. Choose any five-letter vocabulary word using the gear icon; the target word is held by the local server and never sent to the game page.

## Run locally

```powershell
node server.js
```

Then open [http://localhost:3000](http://localhost:3000). Select the menu icon, enter the day’s five-letter word, and project the game for your class.

The game state resets when the server stops. This version intentionally has no password because it is intended for one shared classroom screen.
