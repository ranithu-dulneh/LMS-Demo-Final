# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Cloudflare R2 Storage Infrastructure

This project uses Cloudflare R2 to store document materials securely. Access to these materials is mediated via Supabase Edge Functions.

### Setting up Cloudflare R2

1. **Create an R2 Bucket:**
   - Log into the Cloudflare dashboard.
   - Navigate to **R2**.
   - Click **Create bucket**. Give it a name (e.g., `lms-materials`).

2. **Generate API Credentials:**
   - In the R2 dashboard, click on **Manage R2 API Tokens** on the right side.
   - Click **Create API token**.
   - Give it a descriptive name (e.g., "LMS R2 Access").
   - Under **Permissions**, select **Object Read & Write**.
   - Important: Under **Specify bucket(s)**, select your specific bucket or leave as "Apply to all R2 buckets" (less secure).
   - Click **Create API Token**.
   - **Save the Access Key ID, Secret Access Key, and the jurisdiction-specific endpoint**. You will not be able to see the Secret Access Key again.

3. **Configure Supabase Secrets:**
   You need to add these credentials to your Supabase project so the edge functions can access R2. Use the Supabase CLI:

   ```bash
   supabase secrets set R2_BUCKET_NAME="your-bucket-name"
   supabase secrets set R2_ACCESS_KEY_ID="your-access-key-id"
   supabase secrets set R2_SECRET_ACCESS_KEY="your-secret-access-key"
   supabase secrets set R2_ENDPOINT="your-endpoint-url"
   ```
   *Note: The endpoint URL looks like `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`*

### Deploying Edge Functions

The backend infrastructure uses two edge functions to manage secure file handling:
- `upload-to-r2`: Handles file uploads from the frontend and pushes them to R2.
- `get-r2-url`: Generates a short-lived (1-hour) presigned URL for secure downloading without exposing the bucket to the public.

Deploy both functions using the Supabase CLI:

```bash
supabase functions deploy upload-to-r2 --no-verify-jwt
supabase functions deploy get-r2-url --no-verify-jwt
```
*(Note: `--no-verify-jwt` is used if you handle token verification inside the function using the Supabase client, which we do).*
