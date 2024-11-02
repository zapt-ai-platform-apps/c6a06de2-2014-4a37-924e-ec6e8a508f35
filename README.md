# New App

## Introduction

Welcome to **New App**, an AI-powered video creation platform that transforms your ideas into compelling, professional-quality videos with ease. Whether you're a content creator, business, educator, or enthusiast, New App combines advanced AI technology with an intuitive interface to let you create, customize, and polish videos in minutes.

## User Journeys

### 1. Sign Up and Authentication

1. **Access the App**: Open New App in your web browser.
2. **Sign In with ZAPT**: Click on "Sign in with ZAPT" to authenticate using your preferred method (email, Google, Facebook, or Apple).
3. **Authentication**: Complete the authentication process through the Supabase Auth UI.
4. **Navigate to Home Page**: Upon successful sign-in, you're redirected to the home page.

### 2. Create a New Video

1. **Input Script or Images**:
   - **Option A**: Enter your script in the provided text area.
   - **Option B**: Upload images you wish to include in your video.
2. **Choose a Style**: Select a video style from the available options (e.g., Animated, Professional, Casual).
3. **Generate Video**: Click the "Generate Video" button to initiate video creation.
4. **Processing**: The app processes your inputs and communicates with the AI backend to create your video.
5. **View Generated Video**: Once processing is complete, your generated video is displayed on the page.

### 3. Manage Your Videos

1. **View Video Library**: Access your personal library to see all your created videos.
2. **Playback Videos**: Click on any video to play it.
3. **Download or Share**: Download videos to your device or share them directly to social media platforms.
4. **Delete Videos**: Remove unwanted videos from your library.

## External API Services

- **AI Video Generation API**: Used to transform scripts and images into professional-quality videos.

## Environment Variables

The following environment variables are required for the app to function correctly:

- `VITE_PUBLIC_APP_ID`: Your ZAPT app ID.
- `VITE_PUBLIC_SENTRY_DSN`: Sentry DSN for error logging.
- `VITE_PUBLIC_APP_ENV`: Application environment (e.g., production, development).
- `AI_VIDEO_API_KEY`: API key for the AI Video Generation service (used on the backend).
