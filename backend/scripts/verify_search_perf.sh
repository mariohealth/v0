#!/bin/bash
# Verify search performance
# Usage: ./verify_search_perf.sh [URL] [COUNT]

URL="${1:-https://mario-health-api-72178908097.us-central1.run.app/api/v1/search?q=brain%20mri}"
COUNT="${2:-30}"

LOG_FILE="/tmp/search_perf.log"

echo "Running $COUNT sequential requests against $URL..."
echo "Max time per request: 20s"
rm -f "$LOG_FILE"

for i in $(seq 1 $COUNT); do
    # Capture http_code, time_total, and curl exit code
    # Format: HTTP_CODE TIME_TOTAL CURL_EXIT
    result=$(curl -s -w "%{http_code} %{time_total}" --max-time 20 -o /dev/null "$URL")
    curl_exit=$?
    
    echo "$result $curl_exit" >> "$LOG_FILE"
    echo -n "."
done
echo ""

echo "--- HTTP Status Codes ---"
# Filter for successful curl runs (exit 0) and count status codes
awk '$3 == 0 {print $1}' "$LOG_FILE" | sort | uniq -c

echo "--- Curl Errors ---"
# Count non-zero exit codes. 28 = Timeout.
awk '$3 != 0 {print "Exit Code " $3}' "$LOG_FILE" | sort | uniq -c

echo "--- Latency Stats (Successful HTTP responses only) ---"
# Only consider lines where curl exit is 0 and http code is > 000
awk '$3 == 0 && $1 > 000 {print $2}' "$LOG_FILE" | sort -n | awk '
BEGIN {c=0; s=0} 
{
    a[c++]=$1; 
    s+=$1
} 
END {
    if (c == 0) { print "No successful requests."; exit }
    print "Count:", c;
    print "Min:", a[0];
    print "P50:", a[int(c/2)];
    print "P95:", a[int(c*0.95)];
    print "Max:", a[c-1];
    print "Avg:", s/c
}'
