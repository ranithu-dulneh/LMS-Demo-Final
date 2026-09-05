# Cloudflare R2 Backend Setup Guide

This guide explains how to set up the backend infrastructure for storing materials in Cloudflare R2 via a Supabase Edge Function.

## Prerequisites
- A Cloudflare account with R2 enabled.
- A Supabase project.
- Supabase CLI installed and logged in (`npx supabase login`).

## Step 1: Create a Cloudflare R2 Bucket
1. Log in to your Cloudflare dashboard.
2. Navigate to **R2**.
3. Click **Create bucket**.
4. Name your bucket (e.g., `materials`).
5. Choose the location hint (optional) and click **Create bucket**.

## Step 2: Configure CORS for the R2 Bucket
To allow your application and Edge Functions to interact properly with the bucket, you need to configure CORS.
1. Go to your bucket's **Settings** tab.
2. Scroll down to **CORS policy** and click **Add CORS policy**.
3. Paste the following JSON configuration:
   ```json
   [
     {
       "AllowedOrigins": [
         "*"
       ],
       "AllowedMethods": [
         "GET",
         "PUT",
         "POST",
         "DELETE",
         "HEAD"
       ],
       "AllowedHeaders": [
         "*"
       ],
       "ExposeHeaders": []
     }
   ]
   ```
   *(Note: You should restrict `AllowedOrigins` to your actual frontend domain in production instead of `*`)*
4. Save the policy.

## Step 3: Enable Public Access (Optional but recommended for direct linking)
To let users download materials directly via a URL:
1. Go to your bucket's **Settings** tab.
2. Under **Public access**, click **Connect Domain** to use a custom domain, or enable **R2.dev subdomain** for testing.
3. Note the public URL (e.g., `https://pub-xxxx.r2.dev` or `https://materials.yourdomain.com`). You will use this for the `R2_PUBLIC_URL_PREFIX` secret.

## Step 4: Generate R2 API Tokens
1. In the Cloudflare dashboard, go back to the main **R2** page.
2. Click on **Manage R2 API Tokens** on the right side.
3. Click **Create API token**.
4. Set the **Permissions** to `Object Read & Write`.
5. Select **Specific buckets** and choose the bucket you created (e.g., `materials`).
6. Click **Create API Token**.
7. Copy the **Access Key ID**, **Secret Access Key**, and the S3 API **Endpoint**. Keep them secure; the secret will only be shown once.

## Step 5: Configure Supabase Secrets
You need to add these credentials as secrets in your Supabase project so the Edge Function can access them securely.

Run the following commands using the Supabase CLI, replacing the placeholder values with your actual keys from Step 4, and your bucket settings from Steps 1 and 3:

```bash
# S3 API Credentials
npx supabase secrets set R2_ACCESS_KEY_ID="your_access_key_id"
npx supabase secrets set R2_SECRET_ACCESS_KEY="your_secret_access_key"

# S3 API Endpoint (e.g., https://<account_id>.r2.cloudflarestorage.com)
npx supabase secrets set R2_ENDPOINT="https://your_account_id.r2.cloudflarestorage.com"

# The name of the bucket you created
npx supabase secrets set R2_BUCKET_NAME="materials"

# The public URL prefix configured in Step 3
npx supabase secrets set R2_PUBLIC_URL_PREFIX="https://pub-your-r2-dev-subdomain.r2.dev"
```

## Step 6: Deploy the Edge Function
Finally, deploy the Edge Function to your Supabase project:

```bash
npx supabase functions deploy upload-to-r2
```

Your backend infrastructure is now fully configured to upload materials to Cloudflare R2!
