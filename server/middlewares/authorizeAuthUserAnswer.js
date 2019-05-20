const Answer = require('../models/answer');

module.exports = (req, res, next) => {
  const { decoded } = req;
  const { id } = req.params;

  Answer.findById(id)
    .populate({
      path: 'creator',
      select: ['_id', 'name', 'email']
    })
    .populate({
      path: 'questionId',
      select: ['_id', 'title', 'description']
    })
    .then(answer => {
      if (!answer) {
        const err = {
          status: 404,
          message: 'data not found'
        }
        next(err);
      } else {
        if (answer.creator._id != decoded.id) {
          const err = {
            status: 401,
            message: 'unauthorized to access'
          }
          next(err);
        } else {
          req.answer = answer;
          next();
        }
      }
    })
    .catch(err => {
      next(err);
    })
}