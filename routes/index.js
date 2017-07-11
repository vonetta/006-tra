const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
    const player = { name: 'Kobe', age: 40, good: true };
    // res.send('Hey! It works!');
    // res.json(player);

    res.send(req.query.name);
});

router.get('/reverse/:name', (req, res) => {
    const reverse = [...req.params.name].reverse().join('');
    res.send(reverse);
});

router.get('/learning', (req, res) => {
    res.render('learning', {
        title: 'Pug is Fun!',
        condition: true,
    });
});

module.exports = router;
