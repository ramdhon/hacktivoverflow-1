const mongoose = require('mongoose');

const { Schema } = mongoose;

const questionSchema = new Schema({
  title: {
    type: String,
    required: [true, 'required']
  },
  description: String,
  created: Date,
  updated: Date,
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  upvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

questionSchema.post('save', function(doc, next) {
  Question
    .findOne({
      _id: doc._id
    })
    .populate({
      path: 'creator',
      select: ['_id', 'name', 'email']
    })
    .populate({
      path: 'tags',
      select: ['_id', 'title']
    })
    .then(question => {
      doc.creator = question.creator;
      doc.tags = question.tags;
      next();
    })
    .catch(err => {
      next(err);
    })
})

let Question = mongoose.model('Question', questionSchema);


module.exports = Question;