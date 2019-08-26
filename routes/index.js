const express = require('express');
var router = express.Router();

router.get('/demo', function(req, res) {
    res.success('demo');
});

module.exports = router;
