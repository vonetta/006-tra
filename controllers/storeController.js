exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

// add this new method
exports.createStore = (req, res) => {
  console.log(req.body);
  res.json(req.body);
};