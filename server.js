const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = process.env.PORT || 3000;
const game = { answer: null, guesses: [], status: 'ready' };

function publicGame() {
  return { guesses: game.guesses, status: game.status };
}

function evaluateGuess(guess) {
  const remaining = game.answer.split('');
  const states = Array(5).fill('absent');
  [...guess].forEach((letter, index) => {
    if (letter === game.answer[index]) {
      states[index] = 'correct';
      remaining[index] = null;
    }
  });
  [...guess].forEach((letter, index) => {
    if (states[index] === 'correct') return;
    const foundAt = remaining.indexOf(letter);
    if (foundAt !== -1) {
      states[index] = 'present';
      remaining[foundAt] = null;
    }
  });
  return states;
}

function send(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let content = '';
    request.on('data', (chunk) => { content += chunk; });
    request.on('end', () => {
      try { resolve(JSON.parse(content || '{}')); } catch { reject(new Error('Invalid JSON')); }
    });
  });
}

http.createServer(async (request, response) => {
  const { method, url } = request;
  if (method === 'GET' && (url === '/' || url === '/index.html')) {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(fs.readFileSync(path.join(__dirname, 'index.html')));
    return;
  }
  if (method === 'GET' && url === '/api/game') return send(response, 200, publicGame());
  try {
    if (method === 'PUT' && url === '/api/game') {
      const { answer = '' } = await readJson(request);
      const word = String(answer).trim().toUpperCase();
      if (!/^[A-Z]{5}$/.test(word)) return send(response, 400, { error: 'Use a five-letter word.' });
      game.answer = word;
      game.guesses = [];
      game.status = 'playing';
      return send(response, 200, { game: publicGame() });
    }
    if (method === 'POST' && url === '/api/guess') {
      const { guess = '' } = await readJson(request);
      const word = String(guess).trim().toUpperCase();
      if (game.status !== 'playing') return send(response, 400, { error: 'Start a new game first.' });
      if (!/^[A-Z]{5}$/.test(word)) return send(response, 400, { error: 'Use a five-letter word.' });
      const states = evaluateGuess(word);
      game.guesses.push({ word, states });
      game.status = word === game.answer ? 'won' : game.guesses.length === 6 ? 'lost' : 'playing';
      return send(response, 200, { game: publicGame() });
    }
  } catch (error) {
    return send(response, 400, { error: error.message });
  }
  response.writeHead(404);
  response.end('Not found');
}).listen(port, () => console.log(`Classroom Wordle running at http://localhost:${port}`));
