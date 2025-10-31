# Use official Python runtime as base
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for better caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy dbt project files
COPY dbt_project.yml .
COPY profiles.yml /root/.dbt/profiles.yml
COPY models/ ./models/
COPY macros/ ./macros/

# Copy Python scripts
COPY scripts/ ./scripts/
COPY orchestrate.py .

# Make orchestrate script executable
RUN chmod +x orchestrate.py

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Health check endpoint (Cloud Run requires HTTP)
RUN echo 'from flask import Flask; app = Flask(__name__); @app.route("/", methods=["GET", "POST"]); def run(): import subprocess; subprocess.run(["python", "orchestrate.py"]); return "Pipeline executed", 200; app.run(host="0.0.0.0", port=8080)' > server.py

# Run the pipeline via HTTP trigger
CMD ["python", "server.py"]
