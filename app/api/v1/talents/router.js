const express = require('express');
const router = express();
const { index, find, create, update, destroy } = require('./controller');

router.post('/talents', create);
router.get('/talents', index);
router.get('/talens/:id', find);
router.put('/talents/:id', update);
router.delete('/talents/:id', destroy);


module.exports = router;


