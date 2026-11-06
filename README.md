# Classroom Wordle

A Wordle-style game for a whole-class display. Choose any five-letter vocabulary word using the menu icon. The chosen word and game state stay in the same browser on the teacher computer.

## Run locally

```powershell
node server.js
```

Then open [http://localhost:3000](http://localhost:3000). Select the menu icon, enter the day’s five-letter word, and project the game for your class.

The game state is saved in the browser, so it remains available after refreshing the page or deploying the site.

## Deploy on Vercel Hobby

No database, API routes, environment variables, or paid service is needed. Import the repository into Vercel and deploy it as a static site.

Set the word on the same computer and browser you will project. The answer and progress are stored in that browser only; opening the URL in another browser or on another device starts a separate blank game. This is ideal for one shared classroom display, but is not intended for students to play individually on their own devices.
