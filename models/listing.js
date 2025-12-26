const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    location: {
        type: String,
        required: true
    },
      // FIXED PART — image must be an object, NOT a string
   image: {
            url: String,
            filename: String,
        },
    country: {
        type: String,
        required: true
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry :{
        type : {
            type : String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
             type: [Number],
             required: true,
        }
    }   
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing && Array.isArray(listing.reviews) && listing.reviews.length > 0) {
        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
