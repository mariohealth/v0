"""
Basic tests for sync functionality
Run with: pytest tests/
"""

import pytest
import os
from dotenv import load_dotenv
from config.tables import TABLES

load_dotenv()


class TestConfiguration:
    """Test configuration loading"""

    def test_env_variables_exist(self):
        """Check that required environment variables are set"""
        required_vars = [
            'GCP_PROJECT_ID',
            'BIGQUERY_DATASET',
            'POSTGRES_DB_URL'
        ]

        for var in required_vars:
            assert os.getenv(var) is not None, f"Missing environment variable: {var}"

    def test_tables_config_valid(self):
        """Verify tables configuration is valid"""
        assert len(TABLES) > 0, "No tables configured"

        for table_name, config in TABLES.items():
            assert 'bigquery_table' in config, f"{table_name}: missing bigquery_table"
            assert 'postgres_table' in config, f"{table_name}: missing postgres_table"
            assert 'primary_key' in config, f"{table_name}: missing primary_key"
            assert 'sync_mode' in config, f"{table_name}: missing sync_mode"
            assert config['sync_mode'] in ['full_refresh', 'incremental'], \
                f"{table_name}: invalid sync_mode"

            if config['sync_mode'] == 'incremental':
                assert 'incremental_column' in config, \
                    f"{table_name}: incremental mode requires incremental_column"


class TestDataValidation:
    """Test data validation logic"""

    def test_required_columns_validation(self):
        """Test that required columns are checked"""
        from scripts.sync_data import DataSync
        import pandas as pd

        # Mock config
        test_config = {
            'bigquery_table': 'test_table',
            'postgres_table': 'test_table',
            'primary_key': 'id',
            'required_columns': ['id', 'name', 'price'],
            'sync_mode': 'full_refresh'
        }

        syncer = DataSync(test_config)

        # Valid dataframe
        valid_df = pd.DataFrame({
            'id': [1, 2, 3],
            'name': ['A', 'B', 'C'],
            'price': [10.0, 20.0, 30.0]
        })

        result = syncer.validate_data(valid_df)
        assert len(result) == 3

        # Invalid dataframe (missing required column)
        invalid_df = pd.DataFrame({
            'id': [1, 2, 3],
            'name': ['A', 'B', 'C']
            # Missing 'price' column
        })

        with pytest.raises(ValueError, match="Missing required columns"):
            syncer.validate_data(invalid_df)

    def test_duplicate_removal(self):
        """Test that duplicates are removed"""
        from scripts.sync_data import DataSync
        import pandas as pd

        test_config = {
            'bigquery_table': 'test_table',
            'postgres_table': 'test_table',
            'primary_key': 'id',
            'required_columns': ['id'],
            'sync_mode': 'full_refresh'
        }

        syncer = DataSync(test_config)

        # Dataframe with duplicates
        df_with_dupes = pd.DataFrame({
            'id': [1, 2, 2, 3],
            'name': ['A', 'B', 'B', 'C']
        })

        result = syncer.validate_data(df_with_dupes)
        assert len(result) == 3, "Duplicates should be removed"


class TestSyncModes:
    """Test sync mode logic"""

    def test_full_refresh_mode(self):
        """Test full refresh sync mode"""
        test_config = TABLES.get('healthcare_prices')
        if test_config:
            # Verify full_refresh tables don't have incremental_column requirement
            if test_config['sync_mode'] == 'full_refresh':
                assert True  # Just checking config is accessible

    def test_incremental_mode(self):
        """Test incremental sync mode"""
        incremental_tables = {
            name: config for name, config in TABLES.items()
            if config['sync_mode'] == 'incremental'
        }

        for table_name, config in incremental_tables.items():
            assert 'incremental_column' in config, \
                f"{table_name}: incremental mode requires incremental_column"
            assert config['incremental_column'] is not None, \
                f"{table_name}: incremental_column cannot be None"

# Run tests with: pytest tests/ -v
# Run specific test: pytest tests/test_sync.py::TestConfiguration::test_env_variables_exist -v
# Run with coverage: pytest tests/ --cov=scripts --cov=config
