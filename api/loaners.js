const router = require('express').Router();
//const validation = require('../lib/validation');
//const { generateAuthToken, requireAuthentication } = require('../lib/auth');

const itemsSchema = {
  productid: { required: true },
  productname: { required: true },
  rentername: { required: true },
  producttype: { required: true }
};

// Gets Names of the Items which are available
function getItemsNames(mysqlPool) {

  return new Promise((resolve, reject) => {
     mysqlPool.query(
          'SELECT productname FROM items',
          function (err, results) {
          if (err) {
          reject(err);
          } else {
          resolve(results);
   }
   }
 );

 });
     }


router.get('/items', function (req, res,next) {
const mysqlPool = req.app.locals.mysqlPool;
    //-----calling funtion in route endpoint-------------------------------------------------

    getItemsNames(mysqlPool)
     .then((lodgingsPageInfo) => {
      res.status(200).json(lodgingsPageInfo);
    })

      .catch((err) => {
          console.error(err);
          res.status(500).json({
      error: "Error fetching items list.  Try again later."
    });

     });
     });
     exports.router = router;
//End Item names endpoint




// Gets loaners Request & Info
function loanerRequest(mysqlPool) {

  return new Promise((resolve, reject) => {
     mysqlPool.query(
          'SELECT loanername,itemname,loaneraddress,loanerphone FROM loaners',
          function (err, results) {
          if (err) {
          reject(err);
          } else {
          resolve(results);
   }
   }
 );

 });
     }


router.get('/request', function (req, res,next) {
const mysqlPool = req.app.locals.mysqlPool;
    //-----calling funtion in route endpoint-------------------------------------------------

    loanerRequest(mysqlPool)
     .then((lodgingsPageInfo) => {
      res.status(200).json(lodgingsPageInfo);
    })

      .catch((err) => {
          console.error(err);
          res.status(500).json({
      error: "Error fetching items list.  Try again later."
    });

     });
     });
     exports.router = router;
//End Loaners request & info


// Add loaner Request
/*
 * Executes a MySQL query to insert a new loaner request into the database.  Returns
 * a Promise that resolves to the ID of the newly-created request entry.
 */
function addLoanerRequest(business, mysqlPool) {
  return new Promise((resolve, reject) => {
    business.loanerid = null;
    mysqlPool.query(
      'INSERT INTO loaners SET ?',
      business,
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result.insertId);
        }
      }
    );
  });
}

/*
 * Route to create a new loaner request
 */
router.post('/request', function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;

    addLoanerRequest(req.body, mysqlPool)
      .then((loanerid) => {
        res.status(201).json({
          loanerid: loanerid,
          Confimation: {
            loaners: `Request Has been Added`
          }
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: "Error inserting loaner request into DB.  Please try again later."
        });
      });

  }
);
// Ends adding loaner request
