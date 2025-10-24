const express = require('express');
const router = express.Router();
const {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience
} = require('../controllers/experienceController');
const { 
  validateExperienceForm, 
  validateExperienceContent, 
  validateLinkedInForAnonymous 
} = require('../middleware/experienceValidation');

router.route('/')
  .get(getExperiences)
  .post(validateExperienceForm, validateExperienceContent, validateLinkedInForAnonymous, addExperience);

router.route('/:id')
  .put(updateExperience)
  .delete(deleteExperience);

module.exports = router;