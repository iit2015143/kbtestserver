const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text : {
    type : String,
    required : true
  },
  likes : {
    type : Number,
    default : 0
  },
  date : {
    type : Date,
    default : Date.now
  }
});

const PostSchema = new Schema({
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
  imgURL : {
    type : [String],
    required : () => {return this.text === undefined},
  },
  text : {
    type : String,
    required : ( ) => { return this.imgURL.length === 0},
  },
  likes : {
    type: Number,
    default : 0
  },
  comments :{
    type: [CommentSchema],
    required : false
  },
  date : {
    type : Date,
    default : Date.now()
  }
});

const Post = mongoose.model('post',PostSchema);

module.exports = Post;
