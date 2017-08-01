const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index', {title: 'Yo'});
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

// add this new method
exports.createStore = (req, res) => {
  console.log(req.body);
  res.json(req.body);
};