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
          avgMood: `${monthlyAvgMood}/5`,
          anxietyReduction: `${anxietyReduction}%`,
          goodDays,
          totalEntries: monthEntries.length,
        },
        progress: {
          avgMood: parseFloat(monthlyAvgMood) || 0,
          anxietyLevel: avgAnxiety,
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

// @desc    Get anxiety trend data for chart
// @route   GET /api/journal/anxiety-trend
// @access  Private
const getAnxietyTrend = async (req, res) => {
  try {
    const userId = req.user.id;
    const days = Math.min(parseInt(req.query.days) || 30, 90);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const entries = await JournalEntry.find({
      user: userId,
      date: { $gte: startDate },
      anxietyLevel: { $ne: null },
    }).sort({ date: 1 });

    // Group entries by calendar day and compute daily averages
    const byDay = {};
    entries.forEach((entry) => {
      const key = entry.date.toISOString().split('T')[0];
      if (!byDay[key]) byDay[key] = { total: 0, count: 0, moodTotal: 0 };
      byDay[key].total += entry.anxietyLevel;
      byDay[key].moodTotal += entry.mood;
      byDay[key].count += 1;
    });

    const points = Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { total, count, moodTotal }]) => ({
        date,
        anxiety: Math.round((total / count) * 100) / 100,
        mood: Math.round((moodTotal / count) * 10) / 10,
        entryCount: count,
      }));

    // Generate insight by comparing recent vs earlier halves
    const midpoint = Math.floor(points.length / 2);
    const recentSlice = points.slice(midpoint);
    const earlierSlice = points.slice(0, midpoint);

    const avg = (arr) =>
      arr.length > 0
        ? arr.reduce((s, p) => s + p.anxiety, 0) / arr.length
        : null;

    const recentAvg = avg(recentSlice);
    const earlierAvg = avg(earlierSlice);

    let trendDirection = 'stable';
    let trendPercent = 0;
    if (recentAvg !== null && earlierAvg !== null && earlierAvg > 0) {
      const change = ((recentAvg - earlierAvg) / earlierAvg) * 100;
      trendPercent = Math.abs(Math.round(change));
      if (change < -5) trendDirection = 'improving';
      else if (change > 5) trendDirection = 'increasing';
    }

    // Find peak anxiety day
    let peakDay = null;
    if (points.length > 0) {
      const peak = points.reduce((max, p) =>
        p.anxiety > max.anxiety ? p : max,
      );
      peakDay = { date: peak.date, anxiety: peak.anxiety };
    }

    const overallAvg =
      points.length > 0
        ? Math.round(
            (points.reduce((s, p) => s + p.anxiety, 0) / points.length) * 100,
          ) / 100
        : 0;

    res.status(200).json({
      success: true,
      data: {
        points,
        summary: {
          totalDays: points.length,
          totalEntries: entries.length,
          averageAnxiety: overallAvg,
          trendDirection,
          trendPercent,
          peakDay,
        },
      },
    });
  } catch (error) {
    console.error('Get anxiety trend error:', error);
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
  getAnxietyTrend,
};

