# What's In My Fridge

link - https://whatsinmyfridge-backend.onrender.com/

What's In My Fridge is a recipe discovery application built with an Express
backend, static HTML/EJS pages, a Flask recommendation service, MongoDB Atlas,
and Gemini-powered meal planning.

## Features

- Recommend recipes from ingredients in your pantry
- Browse recipe details and filter recommendation results
- Create an account, sign in, and save or remove favourite recipes
- Find similar recipes based on saved favourites
- Generate AI meal plans with dietary requirements and allergy information

## Project layout

```text
backend/
  config/              MongoDB connection
  controllers/         Express request handlers
  models/              Mongoose models
  public/              HTML, browser JavaScript, images, and EJS views
  routes/               Express API routes
  services/             MongoDB, Gemini, and Flask integrations
  src/                  Express application and server entry point
ml/
  cleaned_indian_food_1.csv
  ml_service.py         Flask API
  model_utils.py        Recommendation logic and dataset loading
render.yaml             Render Blueprint for both web services
.env.example            Local backend environment-variable template
```

## Local development

Prerequisites: Node.js 22 or newer, Python 3.12, and a MongoDB Atlas database.

1. Clone the repository and create a local backend environment file:

   ```powershell
   git clone https://github.com/Krishiv1903/WhatsInMyFridge.git
   cd WhatsInMyFridge
   Copy-Item .env.example backend\.env
   ```

2. Edit `backend/.env` and set `MONGODB_URI` to your Atlas connection string.
   Set `GEMINI_API_KEY` to enable AI meal planning. Do not commit this file.

3. Install and start the Python service in one terminal from the repository
   root:

   ```powershell
   py -3.12 -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r ml\requirements.txt
   python ml\ml_service.py
   ```

   The Flask service listens on `http://127.0.0.1:5001`. The CSV is loaded
   relative to `ml_service.py`, so the service can also start from another
   working directory.

4. Install and start the Node.js app in another terminal:

   ```powershell
   cd backend
   npm ci
   npm start
   ```

   Open `http://localhost:3000`. `ML_SERVICE_URL` in `backend/.env` defaults to
   the local Flask URL shown above. MongoDB Atlas must allow network access from
   your development machine.

## Deploy to Render

The root `render.yaml` defines two Render web services:

- `whats-in-my-fridge-ml`: installs `ml/requirements.txt` and starts Flask with
  Gunicorn on Render's assigned port.
- `whats-in-my-fridge`: installs the backend lockfile, starts Express, and
  serves the existing frontend and API from the same origin.

1. Create an Atlas database and database user with read/write access to the
   application's database. In Atlas **Network Access**, allow connections from
   Render. Render's free instances do not provide static outbound IPs; for a
   free deployment, Atlas may need `0.0.0.0/0`. Use a strong, unique database
   password and restrict access to known outbound IPs if your Render plan
   provides static egress IPs.
2. In Render, choose **New > Blueprint**, connect this GitHub repository, and
   apply the root `render.yaml`.
3. In the Node service's Environment settings, set these secret values:

   | Variable | Value |
   | --- | --- |
   | `MONGODB_URI` | Atlas connection string, including a database name and URL-encoded credentials |
   | `GEMINI_API_KEY` | A valid Google Gemini API key |

   The Blueprint sets `NODE_ENV`, `NODE_VERSION`, and the Flask URL
   (`ML_SERVICE_URL`). Render supplies `PORT` to each service; do not set it
   manually. The meal-planning endpoint returns an error until
   `GEMINI_API_KEY` is configured, while signup, login, favourites, and recipe
   recommendations need a working Atlas connection and both services deployed.
4. Wait for both services to report healthy. Open the Node service's
   `onrender.com` URL and test signup, login, ingredient search, recipe details,
   favourites, and meal planning.

The Flask service is publicly reachable in this Blueprint because it is a
Render web service. It exposes only the recommendation and health endpoints;
the Gemini key and Atlas connection string remain on the Node server and are
never sent to browser code. Free Render services can sleep while idle, so the
first request after inactivity may be slow.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes for the backend | MongoDB Atlas connection string |
| `GEMINI_API_KEY` | For AI meal plans | Server-side credential for Gemini |
| `ML_SERVICE_URL` | Yes for recipe APIs | Base URL of the Flask service |
| `PORT` | Set by Render | Listening port for each deployed service |

`backend/config/database.js` also accepts the legacy `MONGO_URI` name for
existing local environments, but new deployments should use `MONGODB_URI`.

## Rotating exposed credentials

A Gemini API key was previously embedded in tracked backend source. Removing it
from the current code does not remove it from earlier Git commits. Revoke that
key in Google AI Studio and create a replacement before deploying; do not reuse
the exposed key. If any Atlas credentials were ever committed or shared, rotate
those as well.
