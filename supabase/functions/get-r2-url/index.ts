import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { S3Client } from "https://deno.land/x/s3_lite_client@0.7.0/mod.ts";
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

    const { objectKey } = await req.json()
    if (!objectKey) {
      throw new Error('Missing objectKey in request body')
    }

    const accessKeyId = Deno.env.get('R2_ACCESS_KEY_ID')
    const secretKey = Deno.env.get('R2_SECRET_ACCESS_KEY')
    const endpoint = Deno.env.get('R2_ENDPOINT')
    const bucket = Deno.env.get('R2_BUCKET_NAME')
    const region = Deno.env.get('R2_REGION') || 'auto'

    if (!accessKeyId || !secretKey || !endpoint || !bucket) {
      throw new Error('Missing R2 configuration secrets')
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

    // Generate a presigned URL valid for 1 hour (3600 seconds)
    const presignedUrl = await s3client.presignedGetObject(objectKey, {
      expirySeconds: 3600
    });

    return new Response(
      JSON.stringify({ url: presignedUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
