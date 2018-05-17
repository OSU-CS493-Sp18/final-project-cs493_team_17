const router = require('express').Router();

const { getBusinessesByOwnerID } = require('./businesses');
const { getReviewsByUserID } = require('./reviews');
const { getPhotosByUserID } = require('./photos');

/*
 * Route to list all of a user's businesses.
 */
router.get('/:userID/businesses', function (req, res) {
  const mysqlPool = req.app.locals.mysqlPool;
  const userID = parseInt(req.params.userID);
  getBusinessesByOwnerID(userID, mysqlPool)
    .then((businesses) => {
      if (businesses) {
        res.status(200).json({ businesses: businesses });
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch businesses.  Please try again later."
      });
    });
});

/*
 * Route to list all of a user's reviews.
 */
router.get('/:userID/reviews', function (req, res) {
  const mysqlPool = req.app.locals.mysqlPool;
  const userID = parseInt(req.params.userID);
  getReviewsByUserID(userID, mysqlPool)
    .then((reviews) => {
      if (reviews) {
        res.status(200).json({ reviews: reviews });
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch reviews.  Please try again later."
      });
    });
});

/*
 * Route to list all of a user's photos.
 */
router.get('/:userID/photos', function (req, res) {
  const mysqlPool = req.app.locals.mysqlPool;
  const userID = parseInt(req.params.userID);
  getPhotosByUserID(userID, mysqlPool)
    .then((photos) => {
      if (photos) {
        res.status(200).json({ photos: photos });
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Unable to fetch photos.  Please try again later."
      });
    });
});

exports.router = router;
