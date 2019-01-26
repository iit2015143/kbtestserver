const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  postedBy : {
    type : Schema.Types.ObjectId,
    required : true ,
     ref : 'user'
  },
  restaurant : {
    type : Schema.Types.ObjectId,
    required : true ,
     ref : 'restaurant'
  },
  text : {
    type : String,
    required : true
  },
  upVotes : {
    type: Number,
    default : 0
  },
  downVotes: {
    type : Number,
    default : 0
  },
  date : {
    type : Date,
    required : true,
    default : Date.now()
  }
});

const Review = mongoose.model('review',ReviewSchema);

module.exports = Review;
