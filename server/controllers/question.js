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
    const { title, text } = req.body
    const { decoded } = req;
    let imageURL = null;
    
    if (req.file) {
      imageURL = req.file.cloudStoragePublicUrl;
    }
    Question.create({
      title, text,
      imageURL: imageURL || './assets/noPhoto.png',
      status: 0,
      creator: decoded.id,
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
    const { title, text, status } = req.body
    let updatedQuestion = req.question;
    let imageURL = null;
    
    if (req.file) {
      imageURL = req.file.cloudStoragePublicUrl;
    }
    updatedQuestion.title = title;
    updatedQuestion.text = text;
    updatedQuestion.imageURL = imageURL;
    updatedQuestion.status = status;
    updatedQuestion.updated = new Date();
    updatedQuestion.updateOne({
      title, text, status, imageURL, updated: updatedQuestion.updated
    })
      .then(info => {
        res.status(201).json({ message: 'data updated', updatedQuestion, info });
      })  
      .catch(err => {
        next(err);
      })
  }

  static updatePatch(req, res, next) {
    const { title, text, status } = req.body
    let { question } = req;
    let imageURL = null;
    
    if (req.file) {
      imageURL = req.file.cloudStoragePublicUrl;
    }
    question.title = title || question.title;
    question.text = text || question.text;
    question.imageURL = imageURL || question.imageURL;
    question.status = status || question.status;
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