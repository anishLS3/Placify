const express = require('express');
const router = express.Router();
const {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience
} = require('../controllers/experienceController');

router.route('/')
  .get(getExperiences)
  .post(addExperience);

router.route('/:id')
  .put(updateExperience)
  .delete(deleteExperience);

module.exports = router;