const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const s3 = new AWS.S3();
const bucket = 'cloud-summerizer-storage';
const dotenv = require('dotenv')

dotenv.config()
exports.handler = async (event) => {
  let key;

  if (event.Records && event.Records[0].eventSource === "aws:s3") {
    const record = event.Records[0].s3;
    key = decodeURIComponent(record.object.key.replace(/\+/g, ' '));
  } 
  
  else if (event.requestContext && event.body) {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    key = body.key;
    if (!key) {
      throw new Error("No key provided in API request body");
    }
  }
  const { Body } = await s3.getObject({ Bucket: bucket, Key: key }).promise();

  let text = '';

    if (key.endsWith('.txt')) {
    text = Body.toString('utf-8');
    } else if (key.endsWith('.docx')) {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ buffer: Body });
    text = result.value;
    } else if (key.endsWith('.pdf')) {
    const pdf = require('pdf-parse');
    const data = await pdf(Body);
    text = data.text;
    } else {
    throw new Error('Unsupported file format');
    }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Summarize the following text concisely:' },
        { role: 'user', content: text }
      ]
    })
  });

  const { choices } = await res.json();
  const summary = choices[0].message.content;
  console.log('Summary:', summary);
  const summaryKey = key.replace(/^uploads\//, 'summaries/'); 
  await s3.putObject({
    Bucket: bucket,
    Key: summaryKey,
    Body: summary,
    ContentType: 'text/plain'
  }).promise();
  
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({ summary })
  };
};