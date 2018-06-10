const router = require('express').Router();

const { getBusinessesByOwnerID } = require('./businesses');
const { getReviewsByUserID } = require('./reviews');
const { getPhotosByUserID } = require('./photos');
const bcrypt = require('bcryptjs');

const { generateAuthToken, requireAuthentication } = require('../lib/auth');


// Mongo Code========================================================

// To add user
function insertNewUser(user,mongoDB) {
     return bcrypt.hash(user.password, 8)
       .then((passwordHash) => {
     const userValues = {
     userID: user.userID,
     username: user.username,
     email: user.email,
     password: passwordHash
     };
     const usersCollection = mongoDB.collection('users');
     return usersCollection.insertOne(userValues);})
     .then((result) => {
     return Promise.resolve(result.insertedId);
     // let p = Promise.resolve(value);
     //let p = new Promise((resolve) => { resolve(value); });
     });
     }

     /*
     * Route to add user
     */

     router.post('/', function (req, res) {
     if (req.body && req.body.userID && req.body.username && req.body.password) {
          insertNewUser(req.body,req.app.locals.mongoDB)
            .then((id) => {res.status(201).json({ _id: id });})
            .catch((err) => {res.status(500).json({
          error: "Error creating new user."});});
          } else {
          res.status(400).json({
            error: "Request body does not contain valid user data."
          });
     }
     });

// Get user by their userID
function getUserByID(userID,mongoDB,includePassword) {
     const usersCollection = mongoDB.collection('users');
     const projection = includePassword ? {} : { password: 0 };
     return usersCollection.find({ userID: userID }).project(projection).toArray()
     .then((results) => {
     return Promise.resolve(results[0]);
     });
     }
     /*
     * Route to get user info by their userid
     */
     router.get('/:userID',requireAuthentication , function (req, res, next) {
          if (req.user !== req.params.userID) {
          res.status(403).json({
          error: "Unauthorized to access the specified resource"
          });
          } else {

     getUserByID(req.params.userID,req.app.locals.mongoDB)
       .then((user) => {if (user) {
            res.status(200).json(user);}
            else
            { next();}})
       .catch((err) => {res.status(500).json({
       error: "Error fetching user."});}); }
     });

//To get print all users
function getallUsers(mongoDB)
     {
     const usersCollection = mongoDB.collection('users');
     return usersCollection.find().toArray()
     .then((results) => {
     return Promise.resolve(results);
     });
     }

     // Route to get print all users
     router.get('/', function (req, res, next) {
     getallUsers(req.app.locals.mongoDB)
       .then((userdata) => {if (userdata) {
            res.status(200).json(userdata);}
            else
            { next();}})
       .catch((err) => {res.status(500).json({
       error: "Error fetching user."
     });});
     });

// TO receive a token with valid userID and Password for login use
router.post('/login', function (req, res) {
     if (req.body && req.body.userID && req.body.password) {
          getUserByID(req.body.userID,req.app.locals.mongoDB, true)
          .then((user) => {
          if (user) {
               return bcrypt.compare(req.body.password, user.password);
               } else {
                    console.error("HEEERRRREEE");
                    console.error(err);
                 return Promise.reject(401);
               }
          })
          .then((loginSuccessful) => {
               if (loginSuccessful) {
                    return generateAuthToken(req.body.userID);
               } else {
                    console.error("AUTH HEREEE, PASSWORD WAS STORED AS A STRING [NOT SAFE]");
                 return Promise.reject(401);
               }
          })
          .then((token) => {
          res.status(200).json({ token: token });
          })
          .catch((err) => {
               if (err === 401) {
            res.status(401).json({
              error: "Invalid user ID and/or password."
            });
          } else {
               console.log("ITSSS HEREEE:: ");
               console.error(err);
            res.status(500).json({
              error: "Unable to verify credentials. Try later."
            });
          }
          });

          } else {
            res.status(400).json({
              error: "Request body needs user ID and password."
            });
          }

          });


//=============================================================



// Mongo Code========================================================

// To add user
function insertNewUser(user,mongoDB) {
     const usersCollection = mongoDB.collection('users');
     const userValues = {
     userID: user.userID,
     username: user.username,
     email: user.email,
     password: user.password
     };
     return usersCollection.insertOne(userValues)
     .then((result) => {
     return Promise.resolve(result.insertedId);
     // let p = Promise.resolve(value);
     let p = new Promise((resolve) => { resolve(value); });
     });
     }

     /*
     * Route to add user
     */

     router.post('/users', function (req, res) {
     if (req.body && req.body.userID && req.body.username && req.body.password) {
          insertNewUser(req.body,req.app.locals.mongoDB)
            .then((id) => {res.status(201).json({ _id: id });})
            .catch((err) => {res.status(500).json({
          error: "Error creating new user."});});
          } else {
          res.status(400).json({
            error: "Request body does not contain valid user data."
          });
     }
     });

// Get user by their userID
function getUserByuserID(userID,mongoDB) {
     const usersCollection = mongoDB.collection('users');
     return usersCollection.find({ userID: userID }).toArray()
     .then((results) => {
     return Promise.resolve(results[0]);
     });
     }
     /*
     * Route to get user info by their userid
     */
     router.get('/:userID', function (req, res, next) {
     getUserByuserID(req.params.userID,req.app.locals.mongoDB)
       .then((user) => {if (user) {
            res.status(200).json(user);}
            else
            { next();}})
       .catch((err) => {res.status(500).json({
       error: "Error fetching user."
     });});
     });

//To get print all users
function getallUsers(mongoDB)
     {
     const usersCollection = mongoDB.collection('users');
     return usersCollection.find().toArray()
     .then((results) => {
     return Promise.resolve(results);
     });
     }

     // Route to get print all users
     router.get('/', function (req, res, next) {
     getallUsers(req.app.locals.mongoDB)
       .then((userdata) => {if (userdata) {
            res.status(200).json(userdata);}
            else
            { next();}})
       .catch((err) => {res.status(500).json({
       error: "Error fetching user."
     });});
     });

//=============================================================

/*
 * Route to list all of a user's businesses.
 */
router.get('/:userID/businesses', function (req, res) {
          const mysqlPool = req.app.locals.mysqlPool;
          const userID = parseInt(req.params.userID);
          getBusinessesByOwnerID(userID, mysqlPool)
          .then((iSuccessful) => {
               if (iSuccessful) {
                    console.log("successfully created a token");
                    return generateAuthToken(req.body.userID);
               } else {
                    console.error("Not a valid userID");
                 return Promise.reject(401);
               }
          })
          .then((token) => {
          res.status(200).json({ token: token });
          })
          .catch((err) => {
               if (err === 401) {
            res.status(401).json({
              error: "Invalid userID"
            });
          } else {
               console.error(err);
            res.status(500).json({
              error: "Unable to fetch businesses"
            });
          }
          });
 });

/*
 * Route to list all of a user's reviews.
 */
router.get('/:userID/reviews', function (req, res) {
       const mysqlPool = req.app.locals.mysqlPool;
       const userID = parseInt(req.params.userID);
       getReviewsByUserID(userID, mysqlPool)
       .then((isSuccessful) => {
            if (isSuccessful) {
                 console.log("successfully created a token");
                 return generateAuthToken(req.body.userID);
            } else {
                 console.error("Not a valid userID");
              return Promise.reject(401);
            }
      })
      .then((token) => {
      res.status(200).json({ token: token });
      })
      .catch((err) => {
            if (err === 401) {
        res.status(401).json({
          error: "Invalid userID"
        });
      } else {
            console.error(err);
        res.status(500).json({
          error: "Unable to fetch reviews"
        });
      }
      });
     });

/*
 * Route to list all of a user's photos.
 */
router.get('/:userID/photos', function (req, res) {
  const mysqlPool = req.app.locals.mysqlPool;
  const userID = parseInt(req.params.userID);
  getPhotosByUserID(userID, mysqlPool)
     .then((iamSuccessful) => {
     if (iamSuccessful) {
       console.log("successfully created a token");
       return generateAuthToken(req.body.userID);
     } else {
       console.error("Not a valid userID");
     return Promise.reject(401);
     }
     })
     .then((token) => {
     res.status(200).json({ token: token });
     })
     .catch((err) => {
     if (err === 401) {
     res.status(401).json({
     error: "Invalid userID"
     });
     } else {
     console.error(err);
     res.status(500).json({
     error: "Unable to fetch photos"
     });
     }
     });
     });

exports.router = router;
