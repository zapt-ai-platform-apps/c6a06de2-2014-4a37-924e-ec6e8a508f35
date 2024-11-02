import * as Sentry from "@sentry/node";
Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.PROJECT_ID
    }
  }
});

import { authenticateUser } from "./_apiUtils.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);
    const { script, images, style } = req.body;

    // Call to the AI Video Generation API
    const response = await fetch('https://api.example.com/generate-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AI_VIDEO_API_KEY}`
      },
      body: JSON.stringify({ script, images, style })
    });

    if (!response.ok) {
      throw new Error('Failed to generate video');
    }

    const data = await response.json();
    res.status(200).json({ video_url: data.video_url, style });
  } catch (error) {
    console.error('Error generating video:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error generating video' });
  }
}