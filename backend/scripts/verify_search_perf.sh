#!/bin/bash
# Verify search performance
URL="${1:-https://mario-health-api-72178908097.us-central1.run.app/api/v1/search?q=brain%20mri}"
COUNT="${2:-30}"

echo "Running $COUNT sequential requests against $URL..."
rm -f /tmp/search_perf.log

for i in $(seq 1 $COUNT); do
    curl -s -o /dev/null -w "%{http_code} %{time_total}\n" "$URL" >> /tmp/search_perf.log
    echo -n "."
done
echo ""

echo "--- Results ---"
cat /tmp/search_perf.log | awk '{print $1}' | sort | uniq -c
echo "--- Latency ---"
awk '{print $2}' /tmp/search_perf.log | sort -n | awk 'BEGIN {c=0} {a[c++]=$1} END {print "P50:", a[int(c/2)], "P95:", a[int(c*0.95)], "Max:", a[c-1]}'
