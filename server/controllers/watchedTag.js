const Watched = require('../models/watchedTag');

class Controller {
  static findAll(req, res, next) {
    let obj = {};

    Watched.find(obj, [], {
      sort: {
        updated: -1
      }
    })
      .populate({
        path: 'creator',
        select: ['_id', 'name', 'email']
      })
      .then(watched => {
        if (watched.length === 0) {
          const err = {
            status: 404,
            message: 'data empty'
          }
          next(err);
        } else {
          res.status(200).json({ message: 'data found', watched });
        }
      })
      .catch(err => {        
        next(err);
      })
  }

  static findAuth(req, res, next) {
    const { decoded } = req;

    let obj = {
      creator: decoded.id
    };

    Watched.findOne(obj)
      .populate({
        path: 'creator',
        select: ['_id', 'name', 'email']
      })
      .then(watched => {
        if (!watched) {
          const err = {
            status: 404,
            message: 'data not found'
          }
          next(err);
        } else {
          res.status(200).json({ message: 'data found', watched });
        }
      })
      .catch(err => {
        next(err);
      })
  }
  
  static createRegister(req, res, next) {
    const { tags } = req.body
    const { newUser } = req;

    Watched.create({
      tags,
      creator: newUser.id,
      created: new Date(),
      updated: new Date()
    })
      .then(newWatched => {
        res.status(201).json({ message: 'account registered', newUser, newWatched });
      })
      .catch(err => {
        next(err);
      })
  }

  static createDecoded(req, res, next) {
    const { tags } = req.body
    const { decoded } = req;

    Watched.create({
      tags,
      creator: decoded.id,
      created: new Date(),
      updated: new Date()
    })
      .then(newWatched => {
        res.status(201).json({ message: 'account registered', newWatched });
      })
      .catch(err => {
        next(err);
      })
  }
  
  static findOneAuth(req, res, next) {
    const { decoded } = req;

    let obj = {
      creator: decoded.id
    };

    Watched.findOne(obj)
      .populate({
        path: 'creator',
        select: ['_id', 'name', 'email']
      })
      .then(watched => {
        if (!watched) {
          const err = {
            status: 404,
            message: 'data not found'
          }
          next(err);
        } else {
          req.watchedTag = watched;
          next();
        }
      })
      .catch(err => {
        next(err);
      })
  }

  static updatePatch(req, res, next) {
    const { tags } = req.body
    let updatedWatched = req.watchedTag;

    updatedWatched.tags = tags || watchedTag.tags;
    updatedWatched.updated = new Date();
    updatedWatched.updateOne({
      tags: updatedWatched.tags, updated: updatedWatched.updated
    })
      .then(info => {
        res.status(201).json({ message: 'data updated', updatedWatched, info });
      })  
      .catch(err => {
        next(err);
      })
  }

  static delete(req, res, next) {
    let { watchedTag } = req;

    watchedTag.delete()
      .then(deletedWatched => {
        res.status(200).json({ message: 'data deleted', deletedWatched });
      })  
      .catch(err => {
        next(err);
      })
  }
}


module.exports = Controller;  