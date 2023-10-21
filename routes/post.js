const express = require('express');
const router = express.Router();

const postController = require('../controllers/post_controller');

console.log("post loaded");

router.post('/user-post',postController.post);

module.exports = router;