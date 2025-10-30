# Running Tests
Make sure the virtual environment is up and running and all dependencies are installed
```bash
cd /mario-health/backend/mario-health-api
source .venv/bin/activate
pip3 install --no-cache-dir -r requirements.txt
```

## Run all tests
```bash
pytest
```

## Run with coverage
```bash
pytest --cov=app --cov-report=html
```

## View coverage report
```bash
open htmlcov/index.html
```

## Run specific tests
```bash
pytest tests/api/v1/test_search.py -v
```

## Run manual test script
```bash
./scripts/test_api.sh http://localhost:8000
```
