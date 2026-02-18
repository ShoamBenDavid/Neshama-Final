const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getEntries,
  createEntry,
  getEntry,
  updateEntry,
  deleteEntry,
  getStats,
} = require('../controllers/journalController');
const { protect } = require('../middleware/auth');

// Validation rules
const entryValidation = [
  body('mood')
    .isInt({ min: 1, max: 5 })
    .withMessage('Mood must be between 1 and 5'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 5000 })
    .withMessage('Content cannot be more than 5000 characters'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
];

// All routes are protected
router.use(protect);

// Routes
router.get('/stats', getStats);
router.route('/')
  .get(getEntries)
  .post(entryValidation, createEntry);

router.route('/:id')
  .get(getEntry)
  .put(entryValidation, updateEntry)
  .delete(deleteEntry);

module.exports = router;

