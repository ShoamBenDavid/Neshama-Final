const config = require('../config/config');

async function classify(content) {
  try {
    const response = await fetch(`${config.ML_SERVICE_URL}/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: content }),
    });

    if (!response.ok) {
      throw new Error(`ML service responded with ${response.status}`);
    }

    const result = await response.json();

    return {
      anxietyLevel: result.anxiety_level,
      anxietyLabel: result.anxiety_label,
    };
  } catch (error) {
    console.error('Classification failed:', error.message);
    return null;
  }
}

module.exports = { classify };
