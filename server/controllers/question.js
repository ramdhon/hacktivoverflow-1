const Question = require('../models/question');

class Controller {
  static findAll(req, res, next) {
    const { search } = req.query;
    let obj = {};

    if (search) {
      obj.title = search;
    }
    Question.find(obj, [], {
      sort: {
        updated: -1
      }
    })
      .populate({
        path: 'creator',
        select: ['_id', 'name', 'email']
      })
      .populate({
        path: 'tags',
        select: ['_id', 'title']
      })
      .then(questions => {
        if (questions.length === 0) {
          const err = {
            status: 404,
            message: 'data empty'
          }
          next(err);
        } else {
          res.status(200).json({ message: 'data found', questions });
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
    Question.find(obj, [], {
      sort: {
        updated: -1
      }
    })
      .populate({
        path: 'creator',
        select: ['_id', 'name', 'email']
      })
      .populate({
        path: 'tags',
        select: ['_id', 'title']
      })
      .then(questions => {
        if (questions.length === 0) {
          const err = {
            status: 404,
            message: 'data empty'
          }
          next(err);
        } else {
          res.status(200).json({ message: 'data found', questions });
        }
      })
      .catch(err => {
        next(err);
      })
  }
  
  static create(req, res, next) {
    const { title, description } = req.body;
    const { tags, decoded } = req;

    Question.create({
      title, description,
      creator: decoded.id,
      tags: tags,
      upvotes: [],
      downvotes: [],
      created: new Date(),
      updated: new Date()
    })
      .then(newQuestion => {
        res.status(201).json({ message: 'data created', newQuestion });
      })
      .catch(err => {
        next(err);
      })
  }
  
  static findOne(req, res, next) {
    const { id } = req.params;
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
          res.status(200).json({ message: 'data found', question });
        }
      })
      .catch(err => {
        next(err);
      })
  }

  static updatePut(req, res, next) {
    const { title, description, upvotes, downvotes } = req.body;
    const { tags, question } = req;
    let updatedQuestion = question;

    if (!title) {
      const err = {
        status: 400,
        message: 'Question validation failed: title: required'
      }
      return next(err);
    }

    updatedQuestion.title = title;
    updatedQuestion.description = description;
    updatedQuestion.tags = tags;
    updatedQuestion.upvotes = upvotes || [];
    updatedQuestion.downvotes = downvotes || [];
    updatedQuestion.updated = new Date();
    updatedQuestion.updateOne({
      title, description,
      tags: updatedQuestion.tags,
      upvotes: updatedQuestion.upvotes,
      downvotes: updatedQuestion.downvotes,
      updated: updatedQuestion.updated
    })
      .then(info => {
        res.status(201).json({ message: 'data updated', updatedQuestion, info });
      })  
      .catch(err => {
        next(err);
      })
  }

  static updatePatch(req, res, next) {
    const { title, description } = req.body;
    let { tags, question, decoded } = req;
    const { upvote, downvote } = req.query;

    question.upvotes = (upvote == 1 && !question.upvotes.find(id => id == decoded.id)) ? [...question.upvotes, decoded.id] : upvote == 0 ? question.upvotes.filter(id => id != decoded.id) : question.upvotes;
    question.downvotes = (downvote == 1 && !question.downvotes.find(id => id == decoded.id)) ? [...question.downvotes, decoded.id] : downvote == 0 ? question.downvotes.filter(id => id != decoded.id) : question.downvotes;
    question.upvotes = downvote == 1 ? question.upvotes.filter(id => id != decoded.id) : question.upvotes;
    question.downvotes = upvote == 1 ? question.downvotes.filter(id => id != decoded.id) : question.downvotes;
    question.title = title || question.title;
    question.description = description || question.description;
    question.tags = tags.length ? tags : question.tags;
    question.updated = new Date();
    question.save()
      .then(updatedQuestion => {
        res.status(201).json({ message: 'data updated', updatedQuestion });
      })  
      .catch(err => {
        next(err);
      })
  }

  static delete(req, res, next) {
    let { question } = req;

    question.delete()
      .then(deletedQuestion => {
        res.status(200).json({ message: 'data deleted', deletedQuestion });
      })  
      .catch(err => {
        next(err);
      })
  }
}


module.exports = Controller;