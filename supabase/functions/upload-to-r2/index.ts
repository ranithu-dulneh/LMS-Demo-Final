import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { S3Client } from "https://deno.land/x/s3_lite_client@0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://lms-demo-final.ranithudulneth.workers.dev",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file provided");
    }

    const s3Client = new S3Client({
      endPoint: Deno.env.get("R2_ENDPOINT")!,
      accessKey: Deno.env.get("R2_ACCESS_KEY_ID")!,
      secretKey: Deno.env.get("R2_SECRET_ACCESS_KEY")!,
      bucket: Deno.env.get("R2_BUCKET_NAME")!,
      region: "auto",
    });

    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const key = `materials/${fileName}`;
    const fileBuffer = await file.arrayBuffer();

    await s3Client.putObject(key, new Uint8Array(fileBuffer), {
      metadata: {
        "Content-Type": file.type || "application/octet-stream",
      },
    });

    return new Response(
      JSON.stringify({
        message: "File uploaded successfully",
        key: key,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
