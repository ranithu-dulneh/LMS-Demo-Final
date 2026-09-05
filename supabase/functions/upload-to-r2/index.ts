import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { S3Client } from "https://deno.land/x/s3_lite_client@0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
    const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");
    const endpoint = Deno.env.get("R2_ENDPOINT");
    const bucketName = Deno.env.get("R2_BUCKET_NAME") || "materials"; // Default bucket name if not set
    const publicUrlPrefix = Deno.env.get("R2_PUBLIC_URL_PREFIX");

    if (!accessKeyId || !secretAccessKey || !endpoint) {
      throw new Error("Missing R2 credentials in environment variables");
    }

    const s3client = new S3Client({
      accessKey: accessKeyId,
      secretKey: secretAccessKey,
      endPoint: endpoint.replace(/^https?:\/\//, ""), // s3_lite_client expects endpoint without protocol
      region: "auto",
      useSSL: true,
      pathStyle: true,
    });

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file uploaded");
    }

    const fileContent = await file.arrayBuffer();

    // Generate a unique file name to avoid collisions
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${crypto.randomUUID()}-${Date.now()}.${fileExtension}`;
    const objectKey = `uploads/${uniqueFileName}`;

    await s3client.putObject(objectKey, new Uint8Array(fileContent), {
      bucketName,
      metadata: {
        "Content-Type": file.type || "application/octet-stream",
        "Original-Name": file.name
      }
    });

    // Determine the public URL.
    // If a custom domain is configured, use it. Otherwise, R2 provides dev domains (though they are not for production).
    // The user should set R2_PUBLIC_URL_PREFIX to their custom domain mapped to the bucket (e.g., https://pub-xxxx.r2.dev or a custom domain).
    let publicUrl = "";
    if (publicUrlPrefix) {
       // Ensure trailing slash
       const prefix = publicUrlPrefix.endsWith('/') ? publicUrlPrefix : `${publicUrlPrefix}/`;
       publicUrl = `${prefix}${objectKey}`;
    } else {
       // Fallback (might not be publicly accessible if public bucket routing isn't set up)
       publicUrl = `${endpoint}/${bucketName}/${objectKey}`;
    }

    return new Response(
      JSON.stringify({
        message: "File uploaded successfully",
        id: objectKey,
        publicUrl: publicUrl,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
