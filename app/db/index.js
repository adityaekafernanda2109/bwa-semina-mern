// menggunakan database mongoDB dan ORM mongoose

const mongoose = require('mongoose')
const { urlDb } = require('../config');

mongoose.connect(urlDb);

const db = mongoose.connection;

module.exports = db;