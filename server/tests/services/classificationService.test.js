process.env.ML_SERVICE_URL = 'http://localhost:5001';

const { classify } = require('../../src/services/classificationService');

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

describe('classificationService', () => {
  it('should return classification on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          anxiety_level: 0.75,
          anxiety_label: 'high',
        }),
    });

    const result = await classify('I am very anxious and stressed');

    expect(result).toEqual({
      anxietyLevel: 0.75,
      anxietyLabel: 'high',
    });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5001/classify',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('should return null when ML service returns error status', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const result = await classify('Some text');

    expect(result).toBeNull();
  });

  it('should return null when ML service is unreachable', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Connection refused'));

    const result = await classify('Some text');

    expect(result).toBeNull();
  });

  it('should send correct request body', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          anxiety_level: 0.2,
          anxiety_label: 'low',
        }),
    });

    await classify('I feel great today');

    const callArgs = global.fetch.mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body).toEqual({ text: 'I feel great today' });
  });

  it('should return classification with low label', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          anxiety_level: 0.15,
          anxiety_label: 'low',
        }),
    });

    const result = await classify('I feel peaceful');
    expect(result.anxietyLabel).toBe('low');
    expect(result.anxietyLevel).toBe(0.15);
  });

  it('should return classification with moderate label', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          anxiety_level: 0.5,
          anxiety_label: 'moderate',
        }),
    });

    const result = await classify('I feel somewhat worried');
    expect(result.anxietyLabel).toBe('moderate');
    expect(result.anxietyLevel).toBe(0.5);
  });

  it('should return null for empty content', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
    });

    const result = await classify('');
    expect(result).toBeNull();
  });

  it('should return null when ML service returns malformed JSON', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON')),
    });

    const result = await classify('Some text');
    expect(result).toBeNull();
  });
});
