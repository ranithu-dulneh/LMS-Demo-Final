# Cloudflare R2 Upload & Download Integration

This module consists of two Supabase Edge Functions (`upload-to-r2` and `get-r2-url`) that handle secure uploading and downloading of materials using Cloudflare R2 object storage.

## How it works

1. **Uploads:** The `upload-to-r2` function receives a file upload from the frontend, generates a unique hash for the file name (object key), and uploads it to the R2 bucket. It returns the object key.
2. **Downloads:** The `get-r2-url` function takes an object key and generates a temporary pre-signed URL (valid for 1 hour) allowing the frontend to download or view the file securely without the bucket being public.

## Step-by-Step Setup Guide

To use these functions, you need to configure your Cloudflare R2 bucket and add the required secrets to your Supabase project.

### 1. Cloudflare R2 Setup

1. Go to your **Cloudflare Dashboard** and navigate to **R2**.
2. Click **Create bucket**. Give it a name (e.g., `learning-materials`). This will be your `R2_BUCKET_NAME`.
3. Under **Settings** for the bucket, ensure public access is **disabled** (this is the default). We will use pre-signed URLs to grant access.
4. Go back to the main R2 page and click **Manage R2 API Tokens**.
5. Click **Create API token**.
6. Give it a descriptive name (e.g., `Supabase Integration`).
7. Under **Permissions**, select **Object Read & Write**.
8. Under **Specify bucket(s)**, you can select the specific bucket you created or allow all buckets.
9. Click **Create API Token**.
10. **IMPORTANT:** Copy the `Access Key ID` and `Secret Access Key`. You will not be able to see the Secret Access Key again.

### 2. Supabase Secrets Configuration

You need to add the following secrets to your Supabase project so the edge functions can authenticate with Cloudflare R2. You can do this via the Supabase Dashboard (Project Settings -> Edge Functions -> Secrets) or using the Supabase CLI.

Using your R2 credentials, set these variables:

- `R2_ACCESS_KEY_ID`: `<YOUR_R2_ACCESS_KEY_ID>`
- `R2_SECRET_ACCESS_KEY`: `<YOUR_R2_SECRET_ACCESS_KEY>`
- `R2_ENDPOINT`: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
- `R2_BUCKET_NAME`: `<your-bucket-name>` (Replace with the name of the bucket you created in step 1.2)
- `R2_REGION`: `auto` (Optional, defaults to `auto`)

If using the Supabase CLI, you can set them like this:

```bash
supabase secrets set R2_ACCESS_KEY_ID=<YOUR_R2_ACCESS_KEY_ID>
supabase secrets set R2_SECRET_ACCESS_KEY=<YOUR_R2_SECRET_ACCESS_KEY>
supabase secrets set R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
supabase secrets set R2_BUCKET_NAME=your-bucket-name
supabase secrets set R2_REGION=auto
```

### 3. Deploy the Edge Functions

Deploy both functions to your Supabase project:

```bash
supabase functions deploy upload-to-r2
supabase functions deploy get-r2-url
```

The system is now ready to securely handle your file storage using Cloudflare R2!
