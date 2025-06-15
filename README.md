# AI File Summarize

A full-stack web application that allows users to upload .pdf, .docx or .txt files and get the content summarize using OpenAI API.

## Live Demo

View App on S3 + CloudFront: [d2yyfpfyguorw.cloudfront.net](https://d2yyfpfyguorw.cloudfront.net/)

## Tech Stack

- Frontend: React, Vite, Chakra UI
- Backend: Node.js, AWS Lambda (serverless framework)
- Cloud: AWS: S3, Lambda, API Gateway and CloudFront
- AI: OpenAI API

## Features

- Upload file to S3 via a simple UI
- Generate pre-sign url to upload file securely
- Severless backend using AWS Lambda
- Summarize file using OpenAI API
- Deployed using AWS S3 and CloudFront

## Getting Started (Local Development)

### Prerequisites

- Node.js
- OpenAI API key
- AWS Configure
- Severless Framework

### Setup

```bash
# Clone the repository
git clone https://github.com/Alhamin-Ibrahim/ai-file-summarize-aws.git
cd client

# Install frontend dependencies
npm install

# Install backend(lambda function) dependencies
cd ~
cd lambda-upload
npm install

# Create a .env file in the client of your project
VITE_UPLOAD_URL=aws presign url
VITE_SUMMARIZE_URL=aws summarize url

# Create a .env file in the lambda-upload of your project
OPENAI_API_KEY=openai api key

### Running the App

#backend(lambda-upload)
npx serverless deploy --stage dev --region eu-west-1

#Frontend
npm run build

### Folder Structure

/client        # (React + Vite + Chakra UI)
/lambda        # lambda function for presign and summarize
