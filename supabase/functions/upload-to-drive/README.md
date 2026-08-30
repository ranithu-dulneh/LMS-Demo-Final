# Supabase Edge Function: Upload to Google Drive

This Edge Function allows you to securely upload files from your frontend to Google Drive using a Google Service Account.

## Setup Instructions

### 1. Get Google Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Go to **APIs & Services > Library** and enable the **Google Drive API**.
4. Go to **APIs & Services > Credentials**.
5. Click **Create Credentials > Service Account**. Fill out the details and create it.
6. Once created, click on the Service Account, go to the **Keys** tab, and click **Add Key > Create new key**. Choose **JSON** and download the file.
7. Open the downloaded JSON file and copy its entire contents.

### 2. Set up Google Drive Folder
1. Create a folder in your Google Drive where you want the materials to be uploaded.
2. Share this folder with the `client_email` found in your Service Account JSON file (give it Editor access).
3. Get the **Folder ID** from the URL of the folder (e.g., `https://drive.google.com/drive/folders/[FOLDER_ID]`).

### 3. Deploy the Edge Function & Set Secrets
Since you develop on a mobile device and might not have the Supabase CLI, you can set this up directly in the Supabase Dashboard:

1. Go to your Supabase Dashboard.
2. Navigate to **Edge Functions**.
3. Create a new Edge Function named `upload-to-drive`.
4. Copy the entire content of `supabase/functions/upload-to-drive/index.ts` and paste it into the editor in the Supabase Dashboard, then deploy.
5. Go to **Project Settings > Edge Functions**.
6. Add the following **Secrets**:
   - `GOOGLE_SERVICE_ACCOUNT_JSON`: Paste the entire content of the JSON file you downloaded in Step 1.
   - `GOOGLE_DRIVE_FOLDER_ID`: Paste the Folder ID you got in Step 2.

Your backend is now ready to handle secure file uploads to Google Drive!
