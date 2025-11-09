// perf/k6/spike.js
import http from 'k6/http';
import { check } from 'k6';

export const options = { vus: 50, duration: '2m' };

export default function () {
  const res = http.get(__ENV.TARGET_URL + '/health');
  check(res, { 'status is 200': (r) => r.status === 200 });
}

// Minimal JUnit emitter
export function handleSummary(data) {
  const failures = data.metrics.checks.fails || 0;
  const tests = data.metrics.checks.passes + failures;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="k6-spike" tests="${tests}" failures="${failures}">
  <testcase classname="k6" name="checks"/>
</testsuite>`;
  return { 'perf-results/k6-junit.xml': xml };
}
