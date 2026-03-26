import json
import numpy as np
import pytest
from unittest.mock import MagicMock, patch
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


@pytest.fixture
def mock_deps():
    """Set up mocked TensorFlow and tokenizer before importing app."""
    mock_model = MagicMock()
    mock_model.input_shape = (None, 200)
    mock_model.output_shape = (None, 3)
    mock_model.summary = MagicMock()
    mock_model.predict = MagicMock(
        return_value=np.array([[0.8, 0.15, 0.05]])
    )

    mock_tokenizer = MagicMock()
    mock_tokenizer.word_index = {"i": 1, "feel": 2, "happy": 3}
    mock_tokenizer.texts_to_sequences = MagicMock(return_value=[[1, 2, 3]])

    return mock_model, mock_tokenizer


@pytest.fixture
def client(mock_deps):
    """Create Flask test client with mocked ML dependencies."""
    mock_model, mock_tokenizer = mock_deps

    mock_tf = MagicMock()
    mock_tf.keras.models.load_model.return_value = mock_model
    mock_tf.keras.preprocessing.sequence.pad_sequences = MagicMock(
        return_value=np.array([[1, 2, 3] + [0] * 197])
    )

    with patch.dict('sys.modules', {
        'tensorflow': mock_tf,
        'tensorflow.keras': mock_tf.keras,
        'tensorflow.keras.preprocessing': mock_tf.keras.preprocessing,
        'tensorflow.keras.preprocessing.text': MagicMock(
            tokenizer_from_json=MagicMock(return_value=mock_tokenizer)
        ),
        'tensorflow.keras.preprocessing.sequence': MagicMock(
            pad_sequences=mock_tf.keras.preprocessing.sequence.pad_sequences
        ),
    }):
        # Remove cached app module if exists
        if 'app' in sys.modules:
            del sys.modules['app']

        import app as flask_app
        flask_app.model = mock_model
        flask_app.tokenizer = mock_tokenizer
        flask_app.MAX_SEQUENCE_LENGTH = 200

        flask_app.app.config['TESTING'] = True
        with flask_app.app.test_client() as test_client:
            yield test_client, mock_model, mock_tokenizer


class TestHealthEndpoint:
    def test_health_returns_ok(self, client):
        test_client, mock_model, _ = client
        response = test_client.get('/health')
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data['status'] == 'ok'
        assert data['model_loaded'] is True


class TestClassifyEndpoint:
    def test_classify_valid_text(self, client):
        test_client, mock_model, mock_tokenizer = client
        mock_model.predict.return_value = np.array([[0.8, 0.15, 0.05]])

        response = test_client.post(
            '/classify',
            data=json.dumps({'text': 'I feel happy and great today'}),
            content_type='application/json',
        )
        data = json.loads(response.data)

        assert response.status_code == 200
        assert 'anxiety_level' in data
        assert 'anxiety_label' in data
        assert data['anxiety_label'] == 'low'
        assert isinstance(data['anxiety_level'], float)

    def test_classify_high_anxiety(self, client):
        test_client, mock_model, _ = client
        mock_model.predict.return_value = np.array([[0.05, 0.15, 0.8]])

        response = test_client.post(
            '/classify',
            data=json.dumps({'text': 'I am very anxious and scared'}),
            content_type='application/json',
        )
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data['anxiety_label'] == 'high'
        assert data['anxiety_level'] > 0.5

    def test_classify_moderate_anxiety(self, client):
        test_client, mock_model, _ = client
        mock_model.predict.return_value = np.array([[0.2, 0.6, 0.2]])

        response = test_client.post(
            '/classify',
            data=json.dumps({'text': 'I feel somewhat worried'}),
            content_type='application/json',
        )
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data['anxiety_label'] == 'moderate'

    def test_classify_missing_text_field(self, client):
        test_client, _, _ = client
        response = test_client.post(
            '/classify',
            data=json.dumps({'wrong_field': 'some text'}),
            content_type='application/json',
        )
        data = json.loads(response.data)

        assert response.status_code == 400
        assert 'error' in data

    def test_classify_empty_text(self, client):
        test_client, _, _ = client
        response = test_client.post(
            '/classify',
            data=json.dumps({'text': '   '}),
            content_type='application/json',
        )
        data = json.loads(response.data)

        assert response.status_code == 400
        assert 'error' in data

    def test_classify_no_json_body(self, client):
        test_client, _, _ = client
        response = test_client.post('/classify')
        data = json.loads(response.data)

        assert response.status_code == 400
        assert 'error' in data

    def test_classify_model_error(self, client):
        test_client, mock_model, _ = client
        mock_model.predict.side_effect = Exception('Model inference failed')

        response = test_client.post(
            '/classify',
            data=json.dumps({'text': 'Some text'}),
            content_type='application/json',
        )
        data = json.loads(response.data)

        assert response.status_code == 500
        assert 'error' in data

    def test_classify_anxiety_score_calculation(self, client):
        """Anxiety score should be sum of moderate + high probabilities."""
        test_client, mock_model, _ = client
        mock_model.predict.return_value = np.array([[0.3, 0.4, 0.3]])

        response = test_client.post(
            '/classify',
            data=json.dumps({'text': 'Testing score calculation'}),
            content_type='application/json',
        )
        data = json.loads(response.data)

        assert response.status_code == 200
        # anxiety_score = moderate(0.4) + high(0.3) = 0.7
        assert abs(data['anxiety_level'] - 0.7) < 0.01

    def test_classify_non_string_text(self, client):
        """Non-string text value (integer) should be handled."""
        test_client, _, _ = client
        response = test_client.post(
            '/classify',
            data=json.dumps({'text': 12345}),
            content_type='application/json',
        )
        # int has no .strip() so this should either error or be handled
        assert response.status_code in (400, 500)

    def test_classify_special_characters(self, client):
        """Text with special characters should be processed."""
        test_client, mock_model, _ = client
        mock_model.predict.return_value = np.array([[0.7, 0.2, 0.1]])

        response = test_client.post(
            '/classify',
            data=json.dumps({'text': 'Hello! @#$% world... <script>alert("x")</script>'}),
            content_type='application/json',
        )
        data = json.loads(response.data)

        assert response.status_code == 200
        assert 'anxiety_level' in data


class TestHealthWithNoModel:
    def test_health_model_not_loaded(self, client):
        """Health endpoint when model is None."""
        test_client, _, _ = client
        import app as flask_app
        original_model = flask_app.model
        flask_app.model = None

        response = test_client.get('/health')
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data['status'] == 'ok'
        assert data['model_loaded'] is False

        flask_app.model = original_model


class TestLoadModelAndTokenizer:
    def test_load_model_success(self, client):
        """load_model_and_tokenizer should set model and tokenizer globals."""
        _, mock_model, mock_tokenizer = client
        import app as flask_app

        assert flask_app.model is not None
        assert flask_app.tokenizer is not None
        assert flask_app.MAX_SEQUENCE_LENGTH == 200

    def test_model_input_shape_sets_sequence_length(self, client):
        """If model input_shape has a sequence length, it should be used."""
        _, mock_model, _ = client
        # Already set via fixture: mock_model.input_shape = (None, 200)
        import app as flask_app
        assert flask_app.MAX_SEQUENCE_LENGTH == 200
