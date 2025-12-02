# Todo Mobile Application

[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2051-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A production-ready mobile todo application built with React Native and Expo, featuring secure authentication, real-time task management, and a modern gradient-based UI design.

## Overview

This mobile application provides a comprehensive task management solution with user authentication, CRUD operations for todos, and an intuitive user interface. Built with modern React Native practices and integrated with a FastAPI backend for seamless data synchronization.

## Features

### Core Functionality
- **User Authentication**: Secure login/signup with JWT token-based authentication
- **Task Management**: Create, read, update, and delete todos with real-time updates
- **Status Tracking**: Mark tasks as complete/incomplete with visual feedback
- **Profile Management**: User profile with logout functionality
- **Offline Storage**: JWT tokens securely stored using AsyncStorage

### User Experience
- **Responsive Design**: Optimized for both iOS and Android devices
- **Modern UI**: Gradient-based design with smooth animations
- **Navigation**: Tab-based navigation with stack navigation for authentication
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Visual feedback during API operations

## Technology Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and toolchain
- **TypeScript**: Type-safe JavaScript development
- **React Navigation**: Navigation library for routing and navigation
- **Expo Linear Gradient**: Gradient backgrounds and styling
- **AsyncStorage**: Persistent local storage
- **Axios**: HTTP client for API communication

### Architecture
- **Component-based**: Modular and reusable component structure
- **Hook-based**: Modern React patterns with custom hooks
- **Type Safety**: Full TypeScript integration for better code quality
- **State Management**: React state with proper data flow

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts           # API client configuration
│   ├── navigation/
│   │   ├── RootNavigator.tsx   # Main navigation container
│   │   └── TabNavigator.tsx    # Bottom tab navigation
│   ├── screens/
│   │   ├── LoginScreen.tsx     # User authentication
│   │   ├── SignupScreen.tsx    # User registration
│   │   ├── DashboardScreen.tsx # Todo management
│   │   └── ProfileScreen.tsx   # User profile
│   └── types/
│       └── auth.ts             # TypeScript type definitions
├── assets/                     # Static assets and images
├── App.tsx                     # Application entry point
└── package.json               # Dependencies and scripts
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/HarshasriM/Todo_MobileApplication.git
   cd Todo_MobileApplication/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   
   Update the base URL in `src/api/client.ts` based on your setup:
   
   **For Android Emulator:**
   ```typescript
   const API_BASE_URL = 'http://10.0.2.2:8000';
   ```
   
   **For iOS Simulator:**
   ```typescript
   const API_BASE_URL = 'http://localhost:8000';
   ```
   
   **For Physical Device:**
   ```typescript
   const API_BASE_URL = 'http://<YOUR_IP_ADDRESS>:8000';
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run the application**
   - **iOS**: Press `i` to open in iOS Simulator
   - **Android**: Press `a` to open in Android Emulator
   - **Physical Device**: Scan QR code with Expo Go app

## API Integration

The application integrates with a FastAPI backend providing the following endpoints:

- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication
- `GET /todos/` - Fetch user todos
- `POST /todos/` - Create new todo
- `PATCH /todos/{id}` - Update todo (edit/complete)
- `DELETE /todos/{id}` - Delete todo

### Authentication Flow

1. User registers or logs in through the authentication screens
2. JWT token is received and stored securely in AsyncStorage
3. All subsequent API requests include the token in headers
4. Token is validated on each app launch for auto-login

## Application Screenshots

### Authentication Flow

<div align="center">

**Login Screen**

<img src="https://raw.githubusercontent.com/HarshasriM/Todo_MobileApplication/master/frontend/assets/login.png" alt="Login Screen" width="300"/>

*Secure login interface with gradient design and form validation*

---

**Signup Screen**

<img src="https://raw.githubusercontent.com/HarshasriM/Todo_MobileApplication/master/frontend/assets/signup.png" alt="Signup Screen" width="300"/>

*User registration with comprehensive input validation*

</div>

### Main Application

<div align="center">

**Dashboard - Todo Management**

<img src="https://raw.githubusercontent.com/HarshasriM/Todo_MobileApplication/master/frontend/assets/dashboard.png" alt="Dashboard Screen" width="300"/>

*Main dashboard showing todo list with create functionality*

<img src="https://raw.githubusercontent.com/HarshasriM/Todo_MobileApplication/master/frontend/assets/dashboard2.png" alt="Dashboard with Todos" width="300"/>

*Dashboard populated with todos showing completion states*

---

**Edit Todo Interface**

<img src="https://raw.githubusercontent.com/HarshasriM/Todo_MobileApplication/master/frontend/assets/edit.png" alt="Edit Screen" width="300"/>

*Todo editing interface with save/cancel options*

---

**User Profile**

<img src="https://raw.githubusercontent.com/HarshasriM/Todo_MobileApplication/master/frontend/assets/profile.png" alt="Profile Screen" width="300"/>

*User profile with logout functionality*

</div>

## Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run on web browser
- `npm run build` - Create production build

### Build for Production

**Android (APK):**
```bash
expo build:android
```

**iOS (IPA):**
```bash
expo build:ios
```

**Web:**
```bash
expo build:web
```

## Testing

The application includes comprehensive testing scenarios:

1. **Authentication Testing**
   - Valid login/signup credentials
   - Invalid input handling
   - Token persistence across app restarts

2. **Todo Management**
   - Create new todos
   - Edit existing todos
   - Mark todos as complete/incomplete
   - Delete todos

3. **Navigation**
   - Tab navigation between screens
   - Protected route access
   - Logout and redirect functionality

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email [support@todoapp.com](mailto:support@todoapp.com) or create an issue in the GitHub repository.

---

**Built with ❤️ using React Native and Expo**


