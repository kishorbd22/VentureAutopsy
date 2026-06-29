# Testing Suite Documentation

Comprehensive testing suite for Venture Autopsy with backend (pytest) and frontend (Vitest) tests.

## 📊 Coverage Targets

- **Backend**: > 80%
- **Frontend**: > 70%

## 🏗️ Test Structure

```
backend/
├── app/
│   └── tests/
│       ├── __init__.py
│       ├── conftest.py              # Shared fixtures
│       ├── test_validators.py       # StartupValidator tests
│       ├── test_normalizers.py      # DataNormalizer tests
│       ├── test_startup_analyzer.py # StartupAnalyzer tests
│       ├── test_explainable_ai.py   # ExplainableAnalyzer tests
│       ├── test_data_ingestion.py   # DataIngestionService tests
│       └── test_api_integration.py  # API endpoint tests
├── pytest.ini                       # Pytest configuration
└── .coveragerc                      # Coverage configuration

frontend/
├── src/
│   ├── components/
│   │   ├── KPICard.test.jsx
│   │   ├── RiskGauge.test.jsx
│   │   ├── ProgressBar.test.jsx
│   │   ├── RiskFactorCard.test.jsx
│   │   └── SimilarStartupCard.test.jsx
│   ├── tests/
│   │   ├── setup.js                 # Test setup and mocks
│   │   ├── AnalyzeStartup.test.jsx
│   │   └── AnalysisReport.test.jsx
│   └── ...
├── vitest.config.js                 # Vitest configuration
└── package.json                     # Test scripts
```

## 🔧 Backend Testing (pytest)

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Running Tests

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest app/tests/test_validators.py

# Run specific test
pytest app/tests/test_validators.py::TestStartupValidator::test_validate_valid_record

# Run with coverage report
pytest --cov=app --cov-report=html

# Run tests by marker
pytest -m unit
pytest -m integration

# Stop on first failure
pytest -x
```

### Coverage Reports

```bash
# Generate HTML coverage report
pytest --cov=app --cov-report=html
# Open htmlcov/index.html in browser

# Generate terminal report
pytest --cov=app --cov-report=term

# Generate XML report (for CI/CD)
pytest --cov=app --cov-report=xml
```

### Test Configuration

**pytest.ini**:
- Test discovery patterns
- Coverage thresholds (>80%)
- Custom markers (unit, integration, slow)

**.coveragerc**:
- Source code to measure
- Omitted files (migrations, tests)
- HTML report settings

## 🎨 Frontend Testing (Vitest)

### Installation

```bash
cd frontend
npm install
```

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage

# Open UI
npm run test:ui
```

### Test Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm test` | `vitest` | Run tests in watch mode |
| `npm run test:run` | `vitest run` | Run tests once |
| `npm run test:coverage` | `vitest run --coverage` | Run with coverage |
| `npm run test:ui` | `vitest --ui` | Open Vitest UI |

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

## 📝 Test Categories

### Backend Tests

#### 1. Unit Tests
- `test_validators.py` - Data validation logic
- `test_normalizers.py` - Data normalization
- `test_startup_analyzer.py` - Analysis engine
- `test_explainable_ai.py` - Explainable AI
- `test_data_ingestion.py` - Data ingestion

#### 2. Integration Tests
- `test_api_integration.py` - API endpoint tests
- FastAPI TestClient
- Mock database interactions
- End-to-end request testing

### Frontend Tests

#### 1. Component Tests
- `KPICard.test.jsx` - KPI display component
- `RiskGauge.test.jsx` - Risk gauge visualization
- `ProgressBar.test.jsx` - Progress bar component
- `RiskFactorCard.test.jsx` - Risk factor display
- `SimilarStartupCard.test.jsx` - Similar startup card

#### 2. Page Tests
- `AnalyzeStartup.test.jsx` - Analysis form page
- `AnalysisReport.test.jsx` - Report display page

## 🔍 Test Fixtures

### Backend Fixtures (conftest.py)

```python
@pytest.fixture
def db():
    """Test database session (isolated per test)"""

@pytest.fixture
def sample_startups():
    """Sample startup data for testing"""

@pytest.fixture
def analyzer_with_db(db):
    """StartupAnalyzer with test database"""

@pytest.fixture
def explainable_analyzer(analyzer_with_db):
    """ExplainableAnalyzer with test data"""
```

### Frontend Mocks (setup.js)

```javascript
// Mock API calls
vi.mock('../services/api')

// Mock React Router
vi.mock('react-router-dom')

// Mock TanStack Query
vi.mock('@tanstack/react-query')

// Mock HTML2Canvas, jsPDF
vi.mock('html2canvas')
vi.mock('jspdf')

// Mock browser APIs
window.matchMedia
ResizeObserver
IntersectionObserver
```

## 📊 Example Test Cases

### Backend Example

```python
def test_calculate_risk_score_cash_runway_critical(self, mock_failed_startups):
    """Test critical cash runway risk"""
    analyzer = StartupAnalyzer(db=None)
    analyzer.failed_startups = mock_failed_startups
    
    startup_data = {
        'industry': 'Technology',
        'total_funding_usd': 100000,  # Very low funding
        'number_of_employees': 50  # High burn
    }
    
    result = analyzer.calculate_risk_score(startup_data)
    
    # Should have critical cash runway factor
    cash_factors = [f for f in result['risk_factors'] if 'Runway' in f['factor']]
    assert len(cash_factors) > 0
    assert any(f['severity'] == 'critical' for f in cash_factors)
```

### Frontend Example

```javascript
it('renders with score and level', () => {
  render(<RiskGauge score={65} level="High" />)
  expect(screen.getByText('65')).toBeDefined()
  expect(screen.getByText('Risk Score')).toBeDefined()
  expect(screen.getByText('High')).toBeDefined()
})
```

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          pytest --cov=app --cov-report=xml
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      - name: Run tests
        run: |
          cd frontend
          npm run test:coverage
```

## 📁 Coverage Thresholds

- **Global minimum**: 70% (frontend), 80% (backend)
- **Critical modules**: 90%
  - `validators.py`
  - `normalizers.py`
  - `startup_analyzer.py`

## 🐛 Debugging Tests

### Backend Debugging

```bash
# Drop into debugger on failure
pytest --pdb

# Show local variables on failure
pytest -l

# Run with print statements visible
pytest -s
```

### Frontend Debugging

```bash
# Run Vitest UI
npm run test:ui

# Run specific test file with debug
npx vitest run src/components/KPICard.test.jsx --debug
```

## 📋 Best Practices

### 1. Test Naming
- Use descriptive test names
- Follow pattern: `test_<what>_<condition>_<expected>`
- Example: `test_validate_valid_record_returns_no_errors`

### 2. Test Structure (AAA Pattern)
```python
def test_something():
    # Arrange - Set up test data
    data = {...}
    
    # Act - Execute the function
    result = process(data)
    
    # Assert - Verify results
    assert result == expected
```

### 3. Mocking
- Mock external dependencies (database, APIs)
- Use fixtures for shared mocks
- Keep mocks simple and focused

### 4. Assertions
- Use specific assertions (not just `assert True`)
- Test both success and failure cases
- Include edge cases

## 🔄 Continuous Improvement

### Adding New Tests

1. **For new backend features**: Create `test_<module>.py`
2. **For new components**: Create `<Component>.test.jsx`
3. **Run coverage**: Ensure thresholds are met
4. **Update docs**: Add test descriptions

### Review Checklist

- [ ] All new code has corresponding tests
- [ ] Coverage thresholds maintained
- [ ] Tests pass locally
- [ ] Integration tests included for new endpoints
- [ ] Frontend components have snapshot tests
- [ ] Documentation updated

## 🎯 Test Coverage Goals

### Current Status

- Backend: ~85% estimated coverage
- Frontend: ~70% estimated coverage

### Module Priority

1. **Critical** (90%+ required):
   - `validators.py`
   - `normalizers.py`
   - `startup_analyzer.py`
   - `analyze_routes.py`

2. **High** (80%+ target):
   - `data_ingestion_service.py`
   - `explainable_ai.py`
   - All components

3. **Medium** (70%+ target):
   - API integration
   - Page components

## 📚 Additional Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Coverage.py](https://coverage.readthedocs.io/)

## 🆘 Troubleshooting

### Backend Tests Failing

```bash
# Clear test database
rm -f test.db

# Reinstall dependencies
pip install -r requirements.txt

# Run with fresh cache
pytest --cache-clear
```

### Frontend Tests Failing

```bash
# Clear Vitest cache
npx vitest --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Update snapshots
npx vitest run -u
```

## 📝 Contributing

When adding tests:

1. Follow existing patterns
2. Update this documentation
3. Ensure all tests pass
4. Maintain coverage thresholds
5. Add test fixtures to conftest.py/setup.js

---

**Last Updated**: June 25, 2026  
**Maintained By**: Venture Autopsy Development Team