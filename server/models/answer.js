const mongoose = require('mongoose');

const { Schema } = mongoose;

const answerSchema = new Schema({
  title: {
    type: String,
    required: [true, 'required']
  },
  description: String,
  created: Date,
  updated: Date,
  upvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question'
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

answerSchema.post('save', function(doc, next) {
  Answer
    .findOne({
      _id: doc._id
    })
    .populate({
      path: 'creator',
      select: ['_id', 'name', 'email']
    })
    .populate({
      path: 'questionId',
      select: ['_id', 'title', 'description']
    })
    .then(question => {
      doc.creator = question.creator;
      doc.question = question.question;
      next();
    })
    .catch(err => {
      next(err);
    })
})

let Answer = mongoose.model('Answer', answerSchema);


module.exports = Answer;