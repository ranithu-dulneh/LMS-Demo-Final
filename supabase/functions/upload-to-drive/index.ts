import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { encode as encodeBase64Url } from "https://deno.land/std@0.168.0/encoding/base64url.ts"



// Basic CORS headers

const corsHeaders = {

  'Access-Control-Allow-Origin': '*',

  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',

}



serve(async (req) => {

  // Handle CORS preflight requests

  if (req.method === 'OPTIONS') {

    return new Response('ok', { headers: corsHeaders })

  }



  try {

    // 1. Get the Service Account JSON from Supabase Secrets

    const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON')

    if (!serviceAccountJson) {

      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON secret is not set')

    }



    const credentials = JSON.parse(serviceAccountJson)



    // Fix double-escaped newlines in private key

    if (credentials.private_key) {

      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n')

    }



    const folderId = Deno.env.get('GOOGLE_DRIVE_FOLDER_ID') || '' // Optional, but recommended



    // 2. Parse the multipart/form-data request to get the file

    const formData = await req.formData()

    const file = formData.get('file') as File

    if (!file) {

      throw new Error('No file uploaded')

    }



    // 3. Authenticate with Google (Generate an OAuth2 Access Token using JWT)

    // Create JWT Header

    const header = {

      alg: 'RS256',

      typ: 'JWT',

    }

    const headerBase64 = encodeBase64Url(new TextEncoder().encode(JSON.stringify(header)).buffer)



    // Create JWT Claim Set

    const iat = Math.floor(Date.now() / 1000)

    const exp = iat + 3600 // 1 hour

    const claimSet = {

      iss: credentials.client_email,

      scope: 'https://www.googleapis.com/auth/drive.file',

      aud: 'https://oauth2.googleapis.com/token',

      exp: exp,

      iat: iat,

    }

    const claimSetBase64 = encodeBase64Url(new TextEncoder().encode(JSON.stringify(claimSet)).buffer)



    const signatureInput = `${headerBase64}.${claimSetBase64}`



    // Sign the JWT using the private key

    // We need to parse the PEM private key for Web Crypto API

    const pemHeader = "-----BEGIN PRIVATE KEY-----"

    const pemFooter = "-----END PRIVATE KEY-----"

    const pemContents = credentials.private_key

      .replace(pemHeader, '')

      .replace(pemFooter, '')

      .replace(/\s/g, '')



    const binaryDerString = atob(pemContents)

    const binaryDer = new Uint8Array(binaryDerString.length)

    for (let i = 0; i < binaryDerString.length; i++) {

      binaryDer[i] = binaryDerString.charCodeAt(i)

    }



    const key = await crypto.subtle.importKey(

      "pkcs8",

      binaryDer,

      {

        name: "RSASSA-PKCS1-v1_5",

        hash: "SHA-256",

      },

      false,

      ["sign"]

    )



    const signature = await crypto.subtle.sign(

      "RSASSA-PKCS1-v1_5",

      key,

      new TextEncoder().encode(signatureInput)

    )



    // Convert signature to base64url

    const signatureBase64 = encodeBase64Url(signature)



    const jwt = `${signatureInput}.${signatureBase64}`



    // Exchange JWT for Access Token

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {

      method: 'POST',

      headers: {

        'Content-Type': 'application/x-www-form-urlencoded',

      },

      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,

    })



    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {

      throw new Error(`Failed to get access token: ${JSON.stringify(tokenData)}`)

    }



    const accessToken = tokenData.access_token



    // 4. Upload the file to Google Drive using the Resumable or Multipart upload

    // For simplicity, using multipart upload here (max 5MB generally recommended, but works for larger if simple)

    const metadata = {

      name: file.name,

      parents: folderId ? [folderId] : [],

    }



    const fileContent = await file.arrayBuffer()



    const boundary = '-------314159265358979323846'

    const delimiter = `\r\n--${boundary}\r\n`

    const closeDelimiter = `\r\n--${boundary}--`



    const multipartRequestBody = new Blob([

      delimiter,

      'Content-Type: application/json\r\n\r\n',

      JSON.stringify(metadata),

      delimiter,

      `Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`,

      fileContent,

      closeDelimiter

    ])



    const uploadResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink', {

      method: 'POST',

      headers: {

        'Authorization': `Bearer ${accessToken}`,

        'Content-Type': `multipart/related; boundary=${boundary}`,

      },

      body: multipartRequestBody,

    })



    const uploadData = await uploadResponse.json()



    if (!uploadResponse.ok) {

      throw new Error(`Failed to upload to Google Drive: ${JSON.stringify(uploadData)}`)

    }



    // 5. Optionally, make the file publicly accessible so anyone with the link can view/download

    // Note: If you want files to remain private, remove this step and handle sharing differently.

    const permissionResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${uploadData.id}/permissions`, {

        method: 'POST',

        headers: {

            'Authorization': `Bearer ${accessToken}`,

            'Content-Type': 'application/json',

        },

        body: JSON.stringify({

            role: 'reader',

            type: 'anyone',

        }),

    });



    if (!permissionResponse.ok) {

       console.warn("Failed to set public permission, the file might require login to view.");

    }



    // Return the result

    return new Response(

      JSON.stringify({

        message: 'File uploaded successfully',

        id: uploadData.id,

        webViewLink: uploadData.webViewLink

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