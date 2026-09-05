import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { S3Client } from "https://deno.land/x/s3_lite_client@0.7.0/mod.ts";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    // Verify token using Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const accessKeyId = Deno.env.get('R2_ACCESS_KEY_ID')
    const secretKey = Deno.env.get('R2_SECRET_ACCESS_KEY')
    const endpoint = Deno.env.get('R2_ENDPOINT')
    const bucket = Deno.env.get('R2_BUCKET_NAME')
    const region = Deno.env.get('R2_REGION') || 'auto'

    if (!accessKeyId || !secretKey || !endpoint || !bucket) {
      throw new Error('Missing R2 configuration secrets')
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      throw new Error('No file uploaded')
    }

    const s3client = new S3Client({
      endPoint: endpoint,
      accessKey: accessKeyId,
      secretKey: secretKey,
      region: region,
      bucket: bucket,
      useSSL: true,
      pathStyle: true,
    });

    const fileExt = file.name.split('.').pop()
    const arrayBuffer = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(Date.now().toString() + file.name));
    const hashHex = Array.from(new Uint8Array(arrayBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    const objectKey = `${hashHex}.${fileExt}`
    const fileContent = await file.arrayBuffer()

    await s3client.putObject(objectKey, new Uint8Array(fileContent), {
      metadata: {
        "Content-Type": file.type || 'application/octet-stream',
        "Original-Name": file.name
      }
    });

    return new Response(
      JSON.stringify({
        message: 'File uploaded successfully',
        objectKey: objectKey,
        originalName: file.name
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
