# Assignment 3

**Assignment due at 11:59pm on Monday 6/4/2018**

**Demo due by 5:00pm on Friday 6/15/2018**

The goals of this assignment are to use MongoDB to store application data and to start incorporating security features into our API.  There are a few parts to this assignment, as described below.

You are provided some starter code in this repository that implements a solution to assignment 2.  The starter code's API server is implemented in `server.js`, and individual routes are modularized within the `api/` directory.  This code should run out of the box with Docker Compose.  Feel free to use this code as your starting point for this assignment.  You may also use your own solution to assignment 2 as your starting point if you like.

## 1. Use MongoDB to store user data for your API

Your first task for this assignment is to incorporate a MongoDB database to store information about application users.  At a minimum, each user in this database should have the following information stored:
  * Username (which must be unique)
  * Email address
  * Hashed/salted password

Create an API endpoint (e.g. POST `/users`) through which new users can register.  When a user registers, they should provide their username and password, and you should salt and hash the password on the server before storing it.

## 2. Update your Docker Compose specification to include MongoDB

Next, modify `docker-compose.yml` to include a MongoDB service based on the official `mongo` Docker image.  Make sure this service is set up as follows:
  * You should use the environment variables `MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD` to create a root user for your MongoDB server.  Also use the environment variable `MONGO_INITDB_DATABASE` to create an initial database within your server for your application.

  * By default, the `mongo` Docker image stores database data in the directory `/data/db`.  You should create a Docker volume and mount it there so your database data is persisted.

  * If the container directory `/docker-entrypoint-initdb.d/` contains `.js` files, these will be executed to initialize the database specified with `MONGO_INITDB_DATABASE`.  You should create one `.js` script that creates a low-privileged user to use to connect to your MongoDB server from Node.js.  The script will use the same syntax as is used to run commands in the MongoDB shell (e.g. `db.createUser(...)`).  Put this script in a host-machine directory that you bind mount to `/docker-entrypoint-initdb.d/` in your container.

## 3. Enable JWT-based user logins

Once you have enabled user registration for your application, implement a new API endpoint that allows a registered user to log in by sending their username and password.  If the username/password combination is valid, you should respond with a JWT token, which the user can then send with future requests to authenticate themselves.  The JWT token should be decodable to the user's ID, by which you should be able to fetch details about the user from the database, and it should expire after 24 hours.

If a user attempts to log in with an invalid username or password, you should respond with an error.

## 4. Require authentication for certain API endpoints

Once users can log in, modify your API to require clients to authenticate users in order to fetch personal data for those users.  The client will do this by sending a valid JWT along with their request.  Specifically, modify the following API endpoints to verify that the user ID specified in the route path matches the ID of the logged-in user (as indicated by the JWT provided by the client):
  * `/users/{userID}/businesses`
  * `/users/{userID}/reviews`
  * `/users/{userID}/photos`

In addition, you should create a GET `/users/{userID}` API endpoint that returns information about the specified user.  This endpoint should also require that the user ID specified in the path matches the ID of the logged-in user (again, indicated by the JWT provided by the client).

All authenticated endpoints should respond with an error if the specified user ID does not match the logged in user or if no user is logged in (i.e. no JWT is provided).

## Extra credit: Rate-limited API key authorization

For up to 20 points of extra credit, you can implement rate-limited API key authorization.  Specifically, each user should be assigned an API key when they register via the endpoint you created above.  Every request to your API should then be signed with a valid API key.  Use a Redis database to store information about how many API calls each API key has made in the past unit of time (e.g. 1 second, 1 minute, 1 hour, etc), and reject calls that go over your chosen rate limit.  Your Docker Compose specification should be updated to add a Redis service based on the official `redis` image to support this feature.

## Submission

We'll be using GitHub Classroom for this assignment, and you will submit your assignment via GitHub.  Just make sure your completed files are committed and pushed by the assignment's deadline to the master branch of the GitHub repo that was created for you by GitHub Classroom.  A good way to check whether your files are safely submitted is to look at the master branch your assignment repo on the github.com website (i.e. https://github.com/OSU-CS493-Sp18/assignment-3-YourGitHubUsername/). If your changes show up there, you can consider your files submitted.

## Grading criteria

This assignment is worth 100 total points, broken down as follows:

  * 30 points: API stores user information in MongoDB

  * 20 points: MongoDB service is added to Docker Compose specification

  * 20 points: API implements an endpoint to allow user logins

  * 30 points: All `/users` API endpoints specified above require a valid JWT that authenticates the user, as described above

In addition, you can earn up to 20 points of extra credit for implementing rate-limted API keys, as described above.
