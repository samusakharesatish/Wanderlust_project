
const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


// this is for befor the user add listing user need to logged first 
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;//This line for after user login only that page redirect who user want to access
        req.flash("error", "you must be logged in first");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);               //This is
    if (!listing.owner.equals(res.locals.currUser._id)){    //for 
        req.flash("error", "you are not the owner o this listing"); //Authorizaton
        return res.redirect(`/listings/$(id)`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const result = listingSchema.validate(req.body);

    if (result.error) {
        const errMsg = result.error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) =>{
    let result = reviewSchema.validate(req.body);         
   if(result.error){
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(400, errMsg);
   }else{
    next();
   }      
};

module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);               //This is
    if (!review.author.equals(res.locals.currUser._id)){    //for 
        req.flash("error", "you are not the author of this review"); //Authorizaton
        return res.redirect(`/listings/$(id)`);
    }
    next();
};