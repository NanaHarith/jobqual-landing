export async function onRequestPost(context) {
    try {
        const formData = await context.request.formData();
        
        // Read the secret key from Cloudflare Pages environment variables
        const accessKey = context.env.WEB3FORMS_ACCESS_KEY;
        if (!accessKey) {
            return new Response(JSON.stringify({ 
                success: false, 
                message: "WEB3FORMS_ACCESS_KEY is not configured in Cloudflare environment variables." 
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Set the access key inside the form data payload securely
        formData.set('access_key', accessKey);

        // Forward the request to Web3Forms API
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        return new Response(JSON.stringify(result), {
            status: response.status,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
