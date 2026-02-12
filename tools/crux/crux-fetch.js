const https = require('https');
const fs = require('fs');

const API_KEY = process.env.CRUX_API_KEY; // Google Cloud API Key
const ORIGIN = process.argv[2] || 'https://bratislava-stahovanie.viandmo.com';

if (!API_KEY) {
    console.error('❌ Error: CRUX_API_KEY env variable is missing.');
    process.exit(1);
}

const data = JSON.stringify({
    origin: ORIGIN,
    formFactor: 'PHONE',
    metrics: ['largest_contentful_paint', 'cumulative_layout_shift', 'interaction_to_next_paint']
});

const options = {
    hostname: 'chromeuxreport.googleapis.com',
    path: `/v1/records:queryRecord?key=${API_KEY}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            const result = JSON.parse(body);
            console.log('✅ CrUX Data fetched successfully!');
            console.log(JSON.stringify(result, null, 2));
            fs.writeFileSync('crux-data.json', JSON.stringify(result, null, 2));
        } else {
            console.error(`❌ Request failed: ${res.statusCode} ${body}`);
        }
    });
});

req.on('error', error => {
    console.error('❌ Error:', error);
});

req.write(data);
req.end();
