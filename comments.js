// Create web server
var express = require('express');
var router = express.Router();
var comments = require('../comments');

// Get all comments
router.get('/', function(req, res) {
  res.status(200).json(comments);
});

// Get a comment by id
router.get('/:id', function(req, res) {
  var comment = comments.find(function(comment) {
    return comment.id === parseInt(req.params.id);
  });
  if (comment) {
    res.status(200).json(comment);
  } else {
    res.status(404).json({message: 'Comment not found'});
  }
});

// Create a new comment
router.post('/', function(req, res) {
  // Check if all fields are provided and are valid:
  if (!req.body.name ||
      !req.body.comment ||
      !req.body.email ||
      !req.body.postedOn) {
    res.status(400).json({message: 'Bad Request'});
  } else {
    var newId = comments.length + 1;
    comments.push({
      id: newId,
      name: req.body.name,
      comment: req.body.comment,
      email: req.body.email,
      postedOn: req.body.postedOn,
    });
    res.status(201).json({message: 'New comment created', location: '/comments/' + newId});
  }
});

// Update an existing comment
router.put('/:id', function(req, res) {
  // Check if all fields are provided and are valid:
  if (!req.body.name ||
      !req.body.comment ||
      !req.body.email ||
      !req.body.postedOn ||
      !req.params.id) {
    res.status(400).json({message: 'Bad Request'});
  } else {
    // Get the index of the comment in the array
    var updateIndex = comments.map(function(comment) {
      return comment.id;
    }).indexOf(parseInt(req.params.id));
    if (updateIndex === -1) {
      // Comment not found, create new
      comments.push({
        id: req.params.id,
        name: req.body.name,
        comment: req.body.comment,
        email: req.body.email,
        postedOn: req.body.postedOn,
      });
      res.status(201).json({message: 'New comment created', location: '/comments/' + req.params.id});
    } else {
      // Update existing comment
      comments[updateIndex] = {
