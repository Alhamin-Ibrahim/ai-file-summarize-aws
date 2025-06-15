const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: 'eu-west-1',
});

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { fileName, fileType } = body;

    if (!fileName || !fileType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing fileName or fileType' }),
      };
    }

    const ex = fileName.split('.').pop();
    const Key = `uploads/${uuidv4()}.${ex}`;

    const s3Params = {
      Bucket: 'cloud-summerizer-storage',
      Key,
      Expires: 60,
      ContentType: fileType,
    };
    console.log(s3Params)

    const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params);

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl, key: Key }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      }
      
    };
  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Error generating URL' }),
      headers: { 'Access-Control-Allow-Origin': '*' },
    };
  }
};
