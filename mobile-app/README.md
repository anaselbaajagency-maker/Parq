# Parq Mobile Application (Android)

This is a React Native mobile application built with Expo, designed to connect with the Parq Laravel backend.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- [Expo Go](https://expo.dev/expo-go) app on your Android device OR [Android Studio](https://developer.android.com/studio) installed for emulator.
- Access to the Parq Laravel Backend API.

## Project Structure

```
/src
  /components  - Reusable UI elements (Button, Input, etc.)
  /context     - AuthContext for state management
  /navigation  - AppNavigator for routing
  /screens     - Main application screens (Login, Home, etc.)
  /services    - API service (Axios configuration)
  /theme       - Visual identity (Colors, Typography)
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd mobile-app
   npm install
   ```

2. **Configure API URL**
   Create `.env` from `.env.example` and set:
   ```bash
   EXPO_PUBLIC_API_URL=http://10.0.2.2:8000/api/v1
   ```
   - **Emulator**: `http://10.0.2.2:8000/api/v1`
   - **Physical Device**: `http://YOUR_LOCAL_NETWORK_IP:8000/api/v1`
   - **Production**: `https://YOUR_API_DOMAIN/api/v1`

3. **CORS Configuration (Backend)**
   Ensure your Laravel backend allows requests from your mobile device IP. In `config/cors.php`, you can temporarily set:
   ```php
   'paths' => ['api/*', 'sanctum/csrf-cookie'],
   'allowed_origins' => ['*'],
   ```

## Running the App

### On Android Emulator
1. Start your Android Emulator via Android Studio.
2. Run the following command:
   ```bash
   npx expo start --android
   ```

### On Physical Android Device
1. Connect your phone and computer to the **same Wi-Fi network**.
2. Start the Expo server:
   ```bash
   npx expo start
   ```
3. Scan the QR code using the **Expo Go** app.

## Key Features
- **Sanctum Authentication**: Secure login and registration.
- **Token Persistence**: Auto-login using `expo-secure-store`.
- **Listings Feed**: Fetching and displaying listings with FlatList and pull-to-refresh.
- **Visual Identity**: Premium theme matching the Parq web platform.
