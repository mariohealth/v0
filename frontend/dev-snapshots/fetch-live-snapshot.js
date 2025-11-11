// One-off verification util to fetch live data and save a snapshot
const fs = require('fs');
const https = require('https');
const http = require('http');

const API_BASE_URL = process.env.MARIO_API_TEST_URL || process.env.NEXT_PUBLIC_API_URL || 'https://mario-health-api-gateway-x5pghxd.uc.gateway.dev';
const testUrl = `${API_BASE_URL}/api/v1/procedures/mri_of_brain/providers`;

console.log('Fetching live snapshot from:', testUrl);

const client = testUrl.startsWith('https') ? https : http;

client.get(testUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const outputPath = 'frontend/dev-snapshots/mri_of_brain.providers.json';
      fs.writeFileSync(outputPath, JSON.stringify(json, null, 2));
      console.log('✅ Saved snapshot →', outputPath);
      console.log('   Provider count:', json.providers?.length || 0);
    } catch (err) {
      console.error('❌ Failed to parse response:', err);
      fs.writeFileSync('frontend/dev-snapshots/mri_of_brain.providers.raw.txt', data);
      console.log('   Saved raw response to frontend/dev-snapshots/mri_of_brain.providers.raw.txt');
    }
  });
}).on('error', (err) => {
  console.error('❌ Snapshot fetch failed:', err.message);
  process.exit(1);
});

