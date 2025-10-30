"""
Configuration module for BigQuery to Postgres sync

Contains table configurations, queries, and schema definitions.
"""

from .tables import TABLES, DEFAULT_SYNC_TABLES

__all__ = [
    'TABLES',
    'DEFAULT_SYNC_TABLES',
]
