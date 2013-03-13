
var mongoose = require('mongoose')
  , async = require('async')
  , Circle = mongoose.model('Circle')
  , _ = require('underscore')


exports.circle = function(req, res, next, id){
  var User = mongoose.model('User')

  Circle.load(id, function (err, circle) {
    if (err) return next(err)
    if (!circle) return next(new Error('Failed to load circle ' + id))
    req.circle = circle
    next()
  })
}

exports.new = function(req, res){
  res.render('circles/new', {
    title: 'New Circle',
    circle: new Circle({})
  })
}

exports.create = function (req, res) {
  var circle = new Circle(req.body)
  circle.user = req.user

  circle.save(function (err) {
    if (err) {
      res.render('circles/new', {
        title: 'New Circle',
        circle: circle,
        errors: err.errors
      })
    }
    else {
      res.redirect('/circles/'+circle._id)
    }
  })
}

exports.edit = function (req, res) {
  res.render('articles/edit', {
    title: 'Edit '+req.article.title,
    article: req.article
  })
}

exports.update = function(req, res){
  var article = req.article
  article = _.extend(article, req.body)

  article.uploadAndSave(req.files.image, function(err) {
    if (err) {
      res.render('articles/edit', {
        title: 'Edit Article',
        article: article,
        errors: err.errors
      })
    }
    else {
      res.redirect('/articles/' + article._id)
    }
  })
}

exports.show = function(req, res){
  res.render('circles/show', {
    title: req.circle.title,
    circle: req.circle
  })
}

exports.destroy = function(req, res){
  var article = req.article
  article.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    res.redirect('/articles')
  })
}

exports.index = function(req, res){
  var page = req.param('page') > 0 ? req.param('page') : 0
  var perPage = 5
  var options = {
    perPage: perPage,
    page: page
  }

  Article.list(options, function(err, articles) {
    if (err) return res.render('500')
    Article.count().exec(function (err, count) {
      res.render('articles/index', {
        title: 'List of Articles',
        articles: articles,
        page: page,
        pages: count / perPage
      })
    })
  })
}
