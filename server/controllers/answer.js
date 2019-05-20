const Answer = require('../models/answer');

class Controller {
  static findAll(req, res, next) {
    const { search } = req.query;
    let obj = {};

    if (search) {
      obj.title = search;
    }
    Answer.find(obj, [], {
      sort: {
        updated: 1
      }
    })
      .populate({
        path: 'creator',
        select: ['_id', 'name', 'email']
      })
      .populate({
        path: 'questionId',
        select: ['_id', 'title', 'description']
      })
      .then(answers => {
        if (answers.length === 0) {
          const err = {
            status: 404,
            message: 'data empty'
          }
          next(err);
        } else {
          res.status(200).json({ message: 'data found', answers });
        }
      })
      .catch(err => {        
        next(err);
      })
  }

  static findAllAuth(req, res, next) {
    const { search } = req.query;
    const { decoded } = req;

    let obj = {
      creator: decoded.id
    };

    if (search) {
      obj.title = search;
    }
    Answer.find(obj, [], {
      sort: {
        updated: 1
      }
    })
      .populate({
        path: 'creator',
        select: ['_id', 'name', 'email']
      })
      .populate({
        path: 'questionId',
        select: ['_id', 'title', 'description']
      })
      .then(answers => {
        if (answers.length === 0) {
          const err = {
            status: 404,
            message: 'data empty'
          }
          next(err);
        } else {
          res.status(200).json({ message: 'data found', answers });
        }
      })
      .catch(err => {
        next(err);
      })
  }

  static findAllToQuestioned(req, res, next) {
    const { search } = req.query;
    const { id } = req.params;

    let obj = {
      questionId: id
    };

    if (search) {
      obj.title = search;
    }
    Answer.find(obj, [], {
      sort: {
        updated: 1
      }
    })
      .populate({
        path: 'creator',
        select: ['_id', 'name', 'email']
      })
      .populate({
        path: 'questionId',
        select: ['_id', 'title', 'description']
      })
      .then(answers => {
        if (answers.length === 0) {
          const err = {
            status: 404,
            message: 'data empty'
          }
          next(err);
        } else {
          res.status(200).json({ message: 'data found', answers });
        }
      })
      .catch(err => {
        next(err);
      })
  }
  
  static create(req, res, next) {
    const { title, description, questionId } = req.body;
    const { decoded } = req;

    Answer.create({
      title, description, questionId,
      creator: decoded.id,
      upvotes: [],
      downvotes: [],
      created: new Date(),
      updated: new Date()
    })
      .then(newAnswer => {
        res.status(201).json({ message: 'data created', newAnswer });
      })
      .catch(err => {
        next(err);
      })
  }
  
  static findOne(req, res, next) {
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
          res.status(200).json({ message: 'data found', answer });
        }
      })
      .catch(err => {
        next(err);
      })
  }

  static updatePut(req, res, next) {
    const { title, description, upvotes, downvotes } = req.body;
    const { answer } = req;
    let updatedAnswer = answer;

    if (!title) {
      const err = {
        status: 400,
        message: 'Answer validation failed: title: required'
      }
      return next(err);
    }

    updatedAnswer.title = title;
    updatedAnswer.description = description;
    updatedAnswer.upvotes = upvotes || [];
    updatedAnswer.downvotes = downvotes || [];
    updatedAnswer.updated = new Date();
    updatedAnswer.updateOne({
      title, description,
      upvotes: updatedAnswer.upvotes,
      downvotes: updatedAnswer.downvotes,
      updated: updatedAnswer.updated
    })
      .then(info => {
        res.status(201).json({ message: 'data updated', updatedAnswer, info });
      })  
      .catch(err => {
        next(err);
      })
  }

  static updatePatch(req, res, next) {
    const { title, description, upvotes, downvotes } = req.body;
    let { answer } = req;

    answer.title = title || answer.title;
    answer.description = description || answer.description;
    answer.upvotes = upvotes || answer.upvotes;
    answer.downvotes = downvotes || answer.downvotes;
    answer.updated = new Date();
    answer.save()
      .then(updatedAnswer => {
        res.status(201).json({ message: 'data updated', updatedAnswer });
      })  
      .catch(err => {
        next(err);
      })
  }

  static delete(req, res, next) {
    let { answer } = req;

    answer.delete()
      .then(deletedAnswer => {
        res.status(200).json({ message: 'data deleted', deletedAnswer });
      })  
      .catch(err => {
        next(err);
      })
  }
}


module.exports = Controller;