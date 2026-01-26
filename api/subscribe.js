export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { email } = req.body;
  
    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
  
    const API_KEY = process.env.KIT_API_KEY;
    const FORM_ID = process.env.KIT_FORM_ID;
  
    if (!API_KEY || !FORM_ID) {
      console.error('Missing Kit API credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }
  
    try {
      const response = await fetch(
        `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            api_key: API_KEY,
            email: email,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Kit API error:', data);
        return res.status(response.status).json({ 
          error: data.message || 'Failed to subscribe' 
        });
      }
  
      return res.status(200).json({ 
        success: true, 
        message: 'Successfully subscribed!' 
      });
  
    } catch (error) {
      console.error('Subscription error:', error);
      return res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
    }
  }
  