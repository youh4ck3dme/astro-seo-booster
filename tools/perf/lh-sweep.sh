#!/bin/bash
URL="http://localhost:4321/"
RUNS=5
OUT_DIR="tools/perf/lighthouse"

mkdir -p $OUT_DIR

echo "🚀 Starting Lighthouse Sweep ($RUNS runs) on $URL"

for ((i=1; i<=RUNS; i++)); do
    echo -n "👉 Run $i/$RUNS... "
    npx lighthouse $URL --output=json --output-path="$OUT_DIR/run-$i.json" --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo,pwa --quiet
    echo "Done."
done

echo "✅ All runs completed. Results saved in $OUT_DIR"
