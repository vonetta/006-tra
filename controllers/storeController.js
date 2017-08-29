const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp'); // add this line
const uuid = require('uuid'); // add this line

const Store = mongoose.model('Store');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next(
        {
          message: "That filetype isn't allowed"
        },
        false
      );
    }
  }
};

exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo'); // add this line

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return; // make sure to leave the function
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to our filesystem, keep going!
  next();
};

// add this new method
exports.createStore = async (req, res) => {
  const store = new Store(req.body);
  await store.save();
  req.flash(
    'success',
    `Successfully Created ${store.name}. Care to leave a review?`
  );
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', {
    title: 'Stores',
    stores
  });
};

//get a single store
exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });
  if (!store) {
    return next();
  }
  res.render('store', { store, title: store.name });
};

exports.editStore = async (req, res) => {
  // 1. Find the store given the ID
  const _id = req.params.id;
  const store = await Store.findOne({ _id });
  res.render('editStore', {
    title: `Edit ${store.name}`,
    store
  });

  // 2. Confirm they are the owner of the store
  // 3. Render out the edit form so the user can update their store
};

exports.updateStore = async (req, res) => {
  // set the location data to be a point
  req.body.location.type = 'Point';
  // find and update the store
  const store = await Store.findOneAndUpdate(
    {
      _id: req.params.id
    },
    req.body,
    {
      new: true, // returns the new store instead of the old one
      runValidators: true
    }
  ).exec();
  // Redirect them to the store and tell them it worked
  req.flash(
    'success',
    `Successfully update <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`
  );
  res.redirect(`/stores/${store._id}/edit`);
};
