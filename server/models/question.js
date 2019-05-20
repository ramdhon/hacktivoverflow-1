const mongoose = require('mongoose');

const { Schema } = mongoose;

const questionSchema = new Schema({
  title: {
    type: String,
    required: [true, 'required']
  },
  text: String,
  status: Number,
  imageURL: String,
  created: Date,
  updated: Date,
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

questionSchema.post('save', function(doc, next) {
  Question
    .findOne({
      creator: doc.creator
    })
    .populate({
      path: 'creator',
      select: ['_id', 'name', 'email']
    })
    .then(question => {
        doc.creator = question.creator;
        next();
      })
      .catch(err => {
        next(err);
      })
})

let Question = mongoose.model('Question', questionSchema);


module.exports = Question;