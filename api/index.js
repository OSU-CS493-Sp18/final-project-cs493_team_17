const router = module.exports = require('express').Router();

router.use('/businesses', require('./businesses').router);
router.use('/reviews', require('./reviews').router);
router.use('/photos', require('./photos').router);
router.use('/users', require('./users').router);
router.use('/items', require('./items').router);
router.use('/loaners', require('./loaners').router);
router.use('/renters', require('./renters').router);
