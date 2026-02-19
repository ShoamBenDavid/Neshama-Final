const JournalEntry = require('../models/JournalEntry');
const { validationResult } = require('express-validator');
const classificationService = require('../services/classificationService');

// @desc    Get all journal entries for current user
// @route   GET /api/journal
// @access  Private
const getEntries = async (req, res) => {
  try {
    const { page = 1, limit = 20, mood } = req.query;
    
    const query = { user: req.user.id };
    if (mood) {
      query.mood = parseInt(mood);
    }

    const entries = await JournalEntry.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await JournalEntry.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        entries: entries.map(entry => ({
          id: entry._id,
          date: entry.formattedDate,
          time: entry.formattedTime,
          mood: entry.mood,
          title: entry.title,
          content: entry.content,
          tags: entry.tags,
          anxietyLevel: entry.anxietyLevel,
          anxietyLabel: entry.anxietyLabel,
          createdAt: entry.createdAt,
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Create new journal entry
// @route   POST /api/journal
// @access  Private
const createEntry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { mood, title, content, tags } = req.body;

    let entry = await JournalEntry.create({
      user: req.user.id,
      mood,
      title,
      content,
      tags: tags || [],
    });

    // Run anxiety classification in the background, update entry when done
    const classification = await classificationService.classify(content);
    if (classification) {
      entry.anxietyLevel = classification.anxietyLevel;
      entry.anxietyLabel = classification.anxietyLabel;
      await entry.save();
    }

    res.status(201).json({
      success: true,
      message: 'Journal entry created successfully',
      data: {
        entry: {
          id: entry._id,
          date: entry.formattedDate,
          time: entry.formattedTime,
          mood: entry.mood,
          title: entry.title,
          content: entry.content,
          tags: entry.tags,
          anxietyLevel: entry.anxietyLevel,
          anxietyLabel: entry.anxietyLabel,
          createdAt: entry.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get single journal entry
// @route   GET /api/journal/:id
// @access  Private
const getEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        entry: {
          id: entry._id,
          date: entry.formattedDate,
          time: entry.formattedTime,
          mood: entry.mood,
          title: entry.title,
          content: entry.content,
          tags: entry.tags,
          anxietyLevel: entry.anxietyLevel,
          anxietyLabel: entry.anxietyLabel,
          createdAt: entry.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Get entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update journal entry
// @route   PUT /api/journal/:id
// @access  Private
const updateEntry = async (req, res) => {
  try {
    const { mood, title, content, tags } = req.body;

    let entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found',
      });
    }

    if (mood !== undefined) entry.mood = mood;
    if (title !== undefined) entry.title = title;
    if (content !== undefined) entry.content = content;
    if (tags !== undefined) entry.tags = tags;

    await entry.save();

    res.status(200).json({
      success: true,
      message: 'Entry updated successfully',
      data: {
        entry: {
          id: entry._id,
          date: entry.formattedDate,
          time: entry.formattedTime,
          mood: entry.mood,
          title: entry.title,
          content: entry.content,
          tags: entry.tags,
          anxietyLevel: entry.anxietyLevel,
          anxietyLabel: entry.anxietyLabel,
          createdAt: entry.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Delete journal entry
// @route   DELETE /api/journal/:id
// @access  Private
const deleteEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found',
      });
    }

    await entry.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Entry deleted successfully',
    });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get journal statistics for dashboard
// @route   GET /api/journal/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get date range for this week and last 14 days
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(now.getDate() - 14);
    
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Get entries for different periods
    const weekEntries = await JournalEntry.find({
      user: userId,
      date: { $gte: startOfWeek },
    });

    const monthEntries = await JournalEntry.find({
      user: userId,
      date: { $gte: thirtyDaysAgo },
    });

    const twoWeeksEntries = await JournalEntry.find({
      user: userId,
      date: { $gte: fourteenDaysAgo },
    }).sort({ date: 1 });

    // Calculate statistics
    const weeklyStreak = weekEntries.length;
    const monthlyAvgMood = monthEntries.length > 0
      ? (monthEntries.reduce((sum, e) => sum + e.mood, 0) / monthEntries.length).toFixed(1)
      : 0;
    
    const goodDays = monthEntries.filter(e => e.mood >= 4).length;

    // Calculate real anxiety stats from classified entries
    const classifiedEntries = monthEntries.filter(e => e.anxietyLevel != null);
    const avgAnxiety = classifiedEntries.length > 0
      ? classifiedEntries.reduce((sum, e) => sum + e.anxietyLevel, 0) / classifiedEntries.length
      : 0;
    const anxietyReduction = Math.round((1 - avgAnxiety) * 100);

    // Mood chart data for last 14 days
    const moodChartData = twoWeeksEntries.map(entry => ({
      date: entry.formattedDate,
      mood: entry.mood,
    }));

    // Calculate high, average, low moods
    const moods = monthEntries.map(e => e.mood);
    const highMood = moods.length > 0 ? Math.max(...moods) : 0;
    const lowMood = moods.length > 0 ? Math.min(...moods) : 0;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          weeklyStreak: `${weeklyStreak}/7`,
          avgMood: `${monthlyAvgMood}/10`,
          anxietyReduction: `${anxietyReduction}%`,
          goodDays,
          totalEntries: monthEntries.length,
        },
        progress: {
          avgMood: parseFloat(monthlyAvgMood) * 10, // Convert to percentage
          anxietyLevel: anxietyReduction,
        },
        chartData: {
          entries: moodChartData,
          highMood,
          avgMood: parseFloat(monthlyAvgMood),
          lowMood,
        },
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getEntries,
  createEntry,
  getEntry,
  updateEntry,
  deleteEntry,
  getStats,
};

