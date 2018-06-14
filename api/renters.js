const router = require('express').Router();
//const validation = require('../lib/validation');
//const { generateAuthToken, requireAuthentication } = require('../lib/auth');

const itemsSchema = {
  productid: { required: true },
  productname: { required: true },
  rentername: { required: true },
  producttype: { required: true }
};

//Get items which are requested by loaners
function itemNeeded(mysqlPool) {

  return new Promise((resolve, reject) => {
     mysqlPool.query(
          'SELECT itemname FROM loaners',
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


router.get('/', function (req, res,next) {
const mysqlPool = req.app.locals.mysqlPool;
    //-----calling funtion in route endpoint-------------------------------------------------

    itemNeeded(mysqlPool)
     .then((lodgingsPageInfo) => {
      res.status(200).json(lodgingsPageInfo);
    })

      .catch((err) => {
          console.error(err);
          res.status(500).json({
      error: "Error fetching items renter details.  Try again later."
    });

     });
     });
     exports.router = router;
//End Get items which are requested by loaners


//Get items,rentername and itemtype from items
function renterDetails(mysqlPool) {

  return new Promise((resolve, reject) => {
     mysqlPool.query(
          'SELECT productname,rentername,producttype FROM items',
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


router.get('/details', function (req, res,next) {
const mysqlPool = req.app.locals.mysqlPool;
    //-----calling funtion in route endpoint-------------------------------------------------

    renterDetails(mysqlPool)
     .then((lodgingsPageInfo) => {
      res.status(200).json(lodgingsPageInfo);
    })

      .catch((err) => {
          console.error(err);
          res.status(500).json({
      error: "Error fetching items renter details.  Try again later."
    });

     });
     });
     exports.router = router;
//End Get items,rentername and itemtype from items



// Add Renter Deatils

function addRenterDetails(business, mysqlPool) {
  return new Promise((resolve, reject) => {
    business.productid = null;
    mysqlPool.query(
      'INSERT INTO items SET ?',
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
router.post('/add', function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;

    addRenterDetails(req.body, mysqlPool)
      .then((productid) => {
        res.status(201).json({
          productid: productid,
          Confimation: {
            loaners: `Renter Has been Added`
          }
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: "Error inserting renter into DB.  Please try again later."
        });
      });

  }
);
// Ends adding loaner request
