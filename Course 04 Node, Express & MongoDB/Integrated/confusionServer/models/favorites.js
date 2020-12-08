const mongoose = require('mongoose');
const mongooseSchema = mongoose.Schema;

const favoriteSchema = new mongooseSchema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish"
    }]
})

const Favorites = mongoose.model('Favorites', favoriteSchema);
module.exports = Favorites;