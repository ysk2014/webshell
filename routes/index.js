const express = require('express');
var router = express.Router();

const { exec } = require('child_process');
const { promisify } = require('util');

const promiseExec = promisify(exec);

router.get('/cwd', function(req, res) {
    const { pid } = req.query;
    promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then(newCwd => {
        const cwd = typeof newCwd === 'string' ? newCwd.trim() : newCwd.stdout.trim();
        res.success(cwd);
    });
});

module.exports = router;
