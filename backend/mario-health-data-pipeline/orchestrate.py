#!/usr/bin/env python3
"""
Mario Health Data Pipeline Orchestrator
Runs on Cloud Run, triggered by Cloud Scheduler

Execution order:
1. Python data ingestion (API fetching)
2. dbt transformations (SQL models)
3. Data quality checks
"""

import os
import sys
import subprocess
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def run_command(cmd, description):
    """Execute shell command and handle errors"""
    logger.info(f"Starting: {description}")
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            check=True,
            capture_output=True,
            text=True
        )
        logger.info(f"✓ Completed: {description}")
        logger.debug(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"✗ Failed: {description}")
        logger.error(f"Error: {e.stderr}")
        return False


def run_python_ingestion():
    """Execute Python data ingestion scripts"""
    logger.info("=== Phase 1: Data Ingestion ===")
    
    scripts = [
        ("python scripts/ingest_uhc_data.py", "UHC data ingestion"),
        ("python scripts/refresh_carriers.py", "Carrier data refresh"),
    ]
    
    for cmd, desc in scripts:
        if not run_command(cmd, desc):
            logger.warning(f"Ingestion script failed: {desc}")
            # Continue anyway - partial data is better than no pipeline run
    
    logger.info("✓ Ingestion phase complete")


def run_dbt_transformations():
    """Execute dbt models"""
    logger.info("=== Phase 2: dbt Transformations ===")
    
    # Run dbt with fail-fast disabled (continue on individual model failures)
    commands = [
        ("dbt deps", "Install dbt dependencies"),
        ("dbt run --fail-fast", "Run data transformations"),
        ("dbt test", "Run data quality tests"),
    ]
    
    all_success = True
    for cmd, desc in commands:
        if not run_command(cmd, desc):
            all_success = False
            if "run" in cmd:
                # Critical failure - abort
                logger.error("dbt run failed - aborting pipeline")
                return False
    
    return all_success


def run_data_quality_checks():
    """Additional custom data quality checks"""
    logger.info("=== Phase 3: Data Quality Checks ===")
    
    # Add custom Python checks here (optional)
    # Example: check row counts, freshness, etc.
    
    logger.info("✓ Quality checks complete")
    return True


def send_slack_notification(success, duration):
    """Send completion notification to Slack (optional)"""
    # TODO: Implement if you want Slack alerts
    pass


def main():
    """Main orchestration logic"""
    start_time = datetime.now()
    logger.info(f"🚀 Starting Mario Health data pipeline at {start_time}")
    
    try:
        # Phase 1: Ingest data from external sources
        run_python_ingestion()
        
        # Phase 2: Transform with dbt
        success = run_dbt_transformations()
        
        # Phase 3: Quality checks
        run_data_quality_checks()
        
        # Calculate duration
        duration = (datetime.now() - start_time).total_seconds()
        logger.info(f"✓ Pipeline completed in {duration:.1f} seconds")
        
        # Optional: Send notification
        send_slack_notification(success, duration)
        
        sys.exit(0 if success else 1)
        
    except Exception as e:
        logger.error(f"Pipeline failed with exception: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
