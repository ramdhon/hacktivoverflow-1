const mongoose = require('mongoose');

const { Schema } = mongoose;

const watchedSchema = new Schema({
  created: Date,
  updated: Date,
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    validate: [{
      validator: function(val) {
        return Watched.findOne({
          creator: val
        })
          .then(watched => {
            if (watched) return false;
          })
          .catch(err => {
            throw err;
          })
      },
      message: props => 'not unique'
    }]
  },
  tags: Array,
})

watchedSchema.post('save', function(doc, next) {
  Watched
    .findOne({
      _id: doc._id
    })
    .populate({
      path: 'creator',
      select: ['_id', 'name', 'email']
    })
    .then(watched => {
        doc.creator = watched.creator;
        next();
      })
      .catch(err => {
        next(err);
      })
})

let Watched = mongoose.model('Watched', watchedSchema);


module.exports = Watched;