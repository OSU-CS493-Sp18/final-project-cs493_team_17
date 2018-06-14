const router = require('express').Router();
//const validation = require('../lib/validation');
//const { generateAuthToken, requireAuthentication } = require('../lib/auth');

const itemsSchema = {
  productid: { required: true },
  productname: { required: true },
  rentername: { required: true },
  producttype: { required: true }
};

//Get ALL items
function getItems(mysqlPool) {

  return new Promise((resolve, reject) => {
     mysqlPool.query(
          'SELECT * FROM items',
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

    getItems(mysqlPool)
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
//End All items
