# AWS Deployment Guide for OncoCare (FastAPI Backend + React Frontend)

This guide explains how to deploy the OncoCare Breast Cancer Detection system with real-time Random Forest inference and SHAP explainability on Amazon Web Services (AWS).

---

## 1. Architecture Overview
- **Frontend**: React (Vite SPA) hosted on **AWS S3 + CloudFront** (Global Edge CDN with SSL/TLS).
- **Backend**: FastAPI with Python + Scikit-Learn + SHAP running on **AWS App Runner** or **AWS ECS Fargate** (Serverless containers).
- **Database / Cache**: Amazon DynamoDB or Amazon RDS PostgreSQL for persistent patient records.

---

## 2. Option A: Deploy FastAPI Backend via AWS App Runner (Fastest & Simplest)

AWS App Runner provides fully managed container execution with automatic scaling, HTTPS, and zero server maintenance.

### Step 1: Build & Push Docker image to Amazon ECR
```bash
# 1. Log in to AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# 2. Create ECR repository
aws ecr create-repository --repository-name oncocare-fastapi --region us-east-1

# 3. Build docker image
docker build -t oncocare-fastapi .

# 4. Tag and push
docker tag oncocare-fastapi:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/oncocare-fastapi:latest
docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/oncocare-fastapi:latest
```

### Step 2: Create AWS App Runner Service
1. Open the **AWS App Runner Console** -> Click **Create service**.
2. Select **Container registry** -> **Amazon ECR**.
3. Choose the image `oncocare-fastapi:latest`.
4. Set port to `8000`.
5. Click **Create & Deploy**.
6. Copy your public service URL (e.g. `https://xyz123.us-east-1.awsapprunner.com`).

---

## 3. Option B: Serverless AWS Lambda + API Gateway (Scale to Zero)

Using `mangum` adapter included in `requirements.txt`:
```python
# In fastapi_app.py
from mangum import Mangum
handler = Mangum(app)
```
Deploy via AWS SAM or Serverless Framework:
```bash
npm install -g serverless
serverless deploy
```

---

## 4. Deploying React Frontend to AWS S3 & CloudFront

```bash
# 1. Build the production React assets
npm run build

# 2. Create S3 Bucket and sync files
aws s3 mb s3://oncocare-portal-frontend --region us-east-1
aws s3 sync dist/ s3://oncocare-portal-frontend --delete

# 3. Configure S3 for static website hosting & distribute via CloudFront distribution
aws cloudfront create-distribution --origin-domain-name oncocare-portal-frontend.s3.amazonaws.com --default-root-object index.html
```

---

## 5. Environment Variables Configuration
Set the following on AWS App Runner / ECS:
- `ALLOWED_ORIGINS`: `https://your-cloudfront-id.cloudfront.net`
- `MODEL_NAME`: `RandomForest_WDBC_v1`
- `SHAP_EXPLAINER`: `TreeSHAP`
