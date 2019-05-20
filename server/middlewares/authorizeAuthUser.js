const Question = require('../models/question');

module.exports = (req, res, next) => {
  const { decoded } = req;
  const { id } = req.params;

  Question.findById(id)
    .populate({
      path: 'creator',
      select: ['_id', 'name', 'email']
    })
    .then(question => {
      if (!question) {
        const err = {
          status: 404,
          message: 'data not found'
        }
        next(err);
      } else {
        if (question.creator._id != decoded.id) {
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