# Neshama – Testing Guide

> Complete instructions for running the full test suite across the **Server**
> (Python/pytest), **Server JS** (Node/Jest), and **Client** (React Native/Jest).

---

## Table of contents

1. [Prerequisites](#prerequisites)
2. [Running the full suite](#running-the-full-suite)
3. [Server – Python ML service (pytest)](#server--python-ml-service-pytest)
4. [Server – Node.js API (Jest)](#server--nodejs-api-jest)
5. [Client – React Native (Jest)](#client--react-native-jest)
6. [Test structure overview](#test-structure-overview)
7. [Key design decisions](#key-design-decisions)
8. [CI integration](#ci-integration)

---

## Prerequisites

| Tool | Minimum version | Install |
|------|----------------|---------|
| Node.js | 18 | https://nodejs.org |
| Python | 3.9 | https://python.org |
| pip | latest | `python -m pip install --upgrade pip` |
| npm | 9+ | bundled with Node.js |

> **No GPU required.** The TensorFlow model is fully mocked in every Python
> test – `neshama_v4_final.keras` is never loaded from disk.

---

## Running the full suite

```bash
# 1. Server – Python ML service
cd server/ml-service
pip install -r requirements.txt
pytest tests/ -v

# 2. Server – Node.js REST API
cd server
npm install
npm test

# 3. Client – React Native app
cd client
npm install
npm test
```

---

## Server – Python ML service (pytest)

### Location
```
server/ml-service/
├── app.py                     # Flask app + classify_text()
└── tests/
    ├── conftest.py            # Shared fixtures (model mock, tokenizer mock, client)
    └── test_app.py            # All endpoint + logic tests
```

### Running
```bash
cd server/ml-service
pip install flask tensorflow numpy pytest
pytest tests/ -v
```

### What is tested

| Class | Scenarios |
|-------|-----------|
| `TestHealthEndpoint` | `GET /health` returns `{ status: "ok", model_loaded: true/false }` |
| `TestClassifyEndpoint` | Valid text, low/moderate/high anxiety, missing field, empty text, no body, model crash, score formula, non-string input, special characters |
| `TestHealthWithNoModel` | `model_loaded` is `false` when `flask_app.model = None` |
| `TestLoadModelAndTokenizer` | Globals are set; `MAX_SEQUENCE_LENGTH` is derived from model input shape |
| `TestDashboardOutputSchema` | Response has exactly `{ anxiety_level, anxiety_label }`; `anxiety_level` is a float; precision ≤ 4 d.p.; label in `{low, moderate, high}`; error body uses `error` key |
| `TestInputEdgeCases` | Long text (300 tokens > max 200), Hebrew RTL, emoji, single word, `\n\t\r` whitespace, mixed Hebrew+English, 500-char single token |
| `TestAnxietyScoreCalculation` | Score = 0 when fully low; score = 1 when fully high; score = `p(moderate) + p(high)`; boundary at 0.5 |

### LLM mocking strategy

`conftest.py` patches the entire `tensorflow` module tree in `sys.modules`
**before** `app.py` is imported, so no Keras import is ever executed.
The `mock_model.predict` return value can be overridden per-test:

```python
def test_my_scenario(client):
    test_client, mock_model, _ = client
    mock_model.predict.return_value = np.array([[0.05, 0.15, 0.80]])  # high anxiety
    ...
```

---

## Server – Node.js API (Jest)

### Location
```
server/
├── src/
│   └── services/classificationService.js
└── tests/
    ├── services/
    │   └── classificationService.test.js
    ├── auth.test.js
    ├── chat.test.js
    ├── content.test.js
    ├── forum.test.js
    ├── journal.test.js
    └── middleware/auth.test.js
```

### Running
```bash
cd server
npm test
# or with coverage
npm test -- --coverage
```

### What is tested

`classificationService.test.js` covers:

- Successful classification (low / moderate / high)
- Correct request body `{ text }` forwarded to ML service
- `null` returned when ML service HTTP status is not OK
- `null` returned when ML service is unreachable (connection refused)
- `null` returned for malformed JSON response
- `null` returned when ML service rejects empty content

---

## Client – React Native (Jest)

### Location
```
client/
└── __tests__/
    ├── screens/
    │   └── DashboardScreen.test.ts      ← new
    ├── hooks/
    │   └── useAnxietyTrend.test.ts      ← new
    ├── store/
    │   ├── authSlice.test.ts
    │   ├── chatSlice.test.ts
    │   ├── contentSlice.test.ts
    │   ├── forumSlice.test.ts
    │   └── journalSlice.test.ts
    └── services/
        ├── api.test.ts
        └── sessionManager.test.ts
```

### Running
```bash
cd client
npm test               # run once
npm run test:watch     # watch mode
```

### What is tested

#### `DashboardScreen.test.ts`

Rendered UI tests using `@testing-library/react-native` with mocked hooks/stores:

| Group | Scenarios |
|-------|-----------|
| High anxiety state | Trend label shows up-arrow; rendered trend color is red `#FD746C`; progress label reflects low managed percentage |
| Calm/normal state | Trend label shows down-arrow; rendered trend color is green `#43E97B`; progress label reflects high managed percentage |
| Dashboard insights | `anxietyReduction` text is rendered for non-zero reduction values |

#### `useAnxietyTrend.test.ts`

API contract + data-shape validation:

| Group | Scenarios |
|-------|-----------|
| HTTP contract | Calls `/journal/anxiety-trend?days=N`; uses GET; injects `Authorization` header; supports 7/14/30-day ranges |
| `AnxietyTrendSummary` shape | All required fields present; `trendDirection` in enum; `averageAnxiety` ∈ [0,1]; `trendPercent ≥ 0`; `peakDay` can be null |
| `AnxietyTrendPoint` shape | All fields present; `anxiety` ∈ [0,1]; `mood` ∈ [1,10]; `entryCount` is non-negative integer |
| trendDirection business rules | improving / increasing / stable scenarios; multi-point chronological order |
| isEmpty logic | Empty array → `true`; non-empty → `false`; server returns empty array for new users |
| Offline / errors | Network failure → throws; 401 → throws; 500 → throws; malformed JSON → throws; no stale data returned on retry failure |

### API mocking

All client tests mock `global.fetch` (set up in `jest.setup.js`).
No real network requests are made – tests can run fully offline:

```typescript
function mockFetchResponse(data: unknown, status = 200) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}
```

---

## Test structure overview

```
Neshama-Final/
├── client/
│   ├── __tests__/
│   │   ├── hooks/
│   │   │   └── useAnxietyTrend.test.ts
│   │   ├── screens/
│   │   │   └── DashboardScreen.test.ts
│   │   ├── services/
│   │   │   ├── api.test.ts
│   │   │   └── sessionManager.test.ts
│   │   └── store/
│   │       ├── authSlice.test.ts
│   │       ├── chatSlice.test.ts
│   │       ├── contentSlice.test.ts
│   │       ├── forumSlice.test.ts
│   │       └── journalSlice.test.ts
│   ├── jest.config.js
│   └── jest.setup.js
└── server/
    ├── ml-service/
    │   └── tests/
    │       ├── conftest.py            # shared pytest fixtures
    │       └── test_app.py            # Flask endpoint tests
    └── tests/
        ├── services/classificationService.test.js
        ├── auth.test.js
        ├── chat.test.js
        ├── content.test.js
        ├── forum.test.js
        ├── journal.test.js
        ├── middleware/auth.test.js
        └── models/*.test.js
```

---

## Key design decisions

### No model weights loaded during tests
The Keras model file (`neshama_v4_final.keras`) is ~several hundred MB.
`conftest.py` patches the entire `tensorflow` namespace before `app.py` is
imported, replacing it with `MagicMock`. This means:

- Tests run in < 5 seconds instead of 30–60 seconds.
- No GPU or VRAM is required in CI.
- `mock_model.predict` can be set to any numpy array per test case.

### AAA pattern throughout
Every test follows **Arrange → Act → Assert**, with each section explicitly
commented.  This makes it easy to understand test intent without reading
implementation code.

### Fetch mocking instead of MSW
The project's Jest environment is `node`, which is incompatible with MSW's
service worker approach.  `global.fetch = jest.fn()` (set in `jest.setup.js`)
is used instead, giving the same isolation without extra dependencies.

### Dashboard UI assertions
`@testing-library/react-native` is installed and used for rendered assertions
on `DashboardScreen`, while network/store dependencies remain mocked for
deterministic offline execution.

---

## CI integration

```yaml
# Example GitHub Actions step
- name: Run Python tests
  working-directory: server/ml-service
  run: |
    pip install flask tensorflow numpy pytest
    pytest tests/ -v

- name: Run Server JS tests
  working-directory: server
  run: npm ci && npm test

- name: Run Client tests
  working-directory: client
  run: npm ci && npm test
```
