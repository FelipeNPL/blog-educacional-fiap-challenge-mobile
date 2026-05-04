# FIAP Blog - Mobile Application

## 📱 Project Overview
This is a React Native mobile application built with Expo for the FIAP Tech Challenge. The app is a blogging platform designed for two main user roles: Professors and Students.

## 🚀 Features
- **Authentication**: Secure login for professors and students.
- **Home Screen**: Searchable list of all blog posts.
- **Post Details**: Full content view of selected posts.
- **Admin Panel (Professors Only)**:
  - Create, Edit, and Delete posts.
  - Manage Professors (CRUD).
  - Manage Students (CRUD).
- **Profile**: View user info and logout.

## 🛠 Tech Stack
- **React Native (Expo)**: Framework for cross-platform mobile development.
- **React Navigation**: Stack and Tab navigation for smooth flow.
- **Axios**: Centralized API service for backend communication.
- **Context API**: Global state management for Authentication and User Roles.
- **Expo SecureStore**: Secure storage for authentication tokens.
- **Ionicons**: Consistent iconography.

## 📁 Architecture
The project follows a clean, modular structure as defined in `GEMINI.md`:
```
src/
├── components/ # Reusable UI components
├── screens/    # Main application screens
├── navigation/ # Navigation configuration (Role-based)
├── services/   # API communication logic
├── context/    # Global state (AuthContext)
├── styles/     # Theme and global styling
└── utils/      # Helper functions
```

## ⚙️ Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd blog-educacional-fiap-challenge-mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API**:
   Update the `API_URL` in `src/services/api.js` with your backend endpoint.

4. **Run the application**:
   ```bash
   npx expo start
   ```
   Use the Expo Go app on your mobile device or an emulator to test.

## 🔐 Role-Based Access Control (RBAC)
- **Students**: Can view the home feed and read full posts.
- **Professors**: Access to the Admin tab, allowing full content and user management.

## 📝 Challenges Faced
- **Navigation Nesting**: Organizing stacks within tabs while maintaining clear logic for role-based visibility.
- **API Integration**: Mocking and handling potential missing endpoints while ensuring the frontend is ready for the full backend integration.
- **Styling Consistency**: Creating a reusable theme to ensure a professional "FIAP" look and feel.
# blog-educacional-fiap-challenge-mobile
