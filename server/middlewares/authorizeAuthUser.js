const Question = require('../models/question');

module.exports = (req, res, next) => {
  const { decoded } = req;
  const { id } = req.params;
  const { upvote, downvote } = req.query;

  Question.findById(id)
    .populate({
      path: 'creator',
      select: ['_id', 'name', 'email']
    })
    .populate({
      path: 'tags',
      select: ['_id', 'title']
    })
    .then(question => {
      if (!question) {
        const err = {
          status: 404,
          message: 'data not found'
        }
        next(err);
      } else {
        if ((question.creator._id != decoded.id) && !(upvote || downvote) || (Object.keys(req.body).length)) {
          const err = {
            status: 401,
            message: 'unauthorized to access'
          }
          next(err);
        } else {
          req.question = question;
          next();
        }
      }
    })
    .catch(err => {
      next(err);
    })
}