


const mongoose = require('mongoose');

exports.up = async function () {
  const FavouriteSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    place_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    is_favourite: {
      type: Boolean,
      default: false,
    },
  });

  await mongoose.model('favourite').collection.drop();
  await mongoose.model('Favourite', FavouriteSchema).createCollection();
};

exports.down = async function () {
  // Revert the migration (if needed)
  // You can reapply the unique property here if necessary
};
