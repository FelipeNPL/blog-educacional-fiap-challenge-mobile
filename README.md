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

## 📁 Project Structure
```
src/
├── context/
│   └── AuthContext.tsx          # Authentication state management
├── navigation/
│   └── AppNavigator.tsx         # Main navigation setup with role-based routing
├── screens/
│   ├── AdminPanelScreen.tsx     # Admin dashboard for professors
│   ├── CreateEditPostScreen.tsx # Create/Edit post form
│   ├── HomeScreen.tsx           # Post list with search functionality
│   ├── LoginScreen.tsx          # Authentication screen
│   ├── PostDetailsScreen.tsx    # Full post content view
│   ├── ProfileScreen.tsx        # User profile and logout
│   ├── RegisterScreen.tsx       # User registration
│   └── UserManagementScreen.tsx # CRUD operations for users
├── services/
│   ├── api.ts                   # Axios configuration and interceptors
│   ├── postService.ts           # Post-related API calls
│   └── userService.ts           # User management API calls
├── styles/
│   └── theme.ts                 # Color palette and design tokens
└── utils/
    ├── errors.ts                # Error handling utilities
    └── storage.ts               # Secure storage helpers
```

## 🔐 Authentication & Authorization
The application implements role-based access control (RBAC):

- **Students**: Can view posts and search functionality
- **Professors**: Full access including post management and user administration

### Authentication Flow
1. Users log in via the Login screen
2. JWT tokens are stored securely using Expo SecureStore
3. Tokens are automatically attached to API requests via Axios interceptors
4. User role determines available navigation tabs and screens

## 📡 API Integration
The app communicates with a Node.js REST API backend. All API calls are centralized in the `services/` directory.

### Key Endpoints Used:
- `POST /auth/login` - User authentication
- `GET /posts` - Fetch all posts
- `GET /posts/search?keyword={term}` - Search posts
- `GET /posts/{id}` - Get specific post
- `POST /posts` - Create new post
- `PUT /posts/{id}` - Update post
- `DELETE /posts/{id}` - Delete post
- `GET /users` - Fetch users with pagination
- `POST /users` - Create user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### API Service Architecture
- **Centralized Configuration**: `api.ts` handles base URL, headers, and authentication
- **Service Modules**: Separate files for different domains (posts, users)
- **Error Handling**: Consistent error processing across all API calls
- **Type Safety**: TypeScript interfaces for all API responses

## 🧭 Navigation Structure
The app uses a combination of Stack and Tab navigation:

### Main Tab Navigator
- **Feed Tab**: Post list and details (accessible to all users)
- **Admin Tab**: Administrative functions (professors only)
- **Account Tab**: Profile and authentication

### Stack Navigators
- **Post Stack**: Home → Post Details
- **Admin Stack**: Admin Panel → Create/Edit Post, User Management
- **Auth Stack**: Login → Register

## 🎨 Design System
The application follows a consistent design system defined in `theme.ts`:

## 📱 Screen Details

### Home Screen
- **Features**: Post list, search functionality, pull-to-refresh
- **Components**: Search input, post cards, loading states
- **Interactions**: Tap post card → navigate to details

### Post Details Screen
- **Features**: Full post content display
- **Components**: Title, author, date, content
- **Navigation**: Back button to return to list

### Admin Panel Screen
- **Features**: Post management dashboard
- **Components**: Post list with edit/delete actions
- **Navigation**: Buttons to create new posts or manage users

### Create/Edit Post Screen
- **Features**: Form for post creation/editing
- **Validation**: Required fields, minimum lengths
- **API Integration**: Create or update post via API

### User Management Screen
- **Features**: Paginated user list with CRUD operations
- **Components**: User cards, create/edit forms
- **Role Filtering**: Separate views for professors and students

### Login/Register Screens
- **Features**: Authentication forms
- **Validation**: Email format, password requirements
- **Storage**: Secure token storage post-login

## 🔄 State Management
The application uses React Context API for global state:

### AuthContext
- **State**: user object, loading state, professor flag
- **Actions**: login(), logout()
- **Persistence**: User data and tokens stored securely

### Local State
- Screen-level state managed with useState hooks
- Loading, error, and data states for API interactions

## 🛠 Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android emulator) or Xcode (for iOS simulator)

### Installation
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

5. **Run on device/emulator**:
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app on physical device

## 🧪 Testing
- Test authentication flow for both roles
- Verify API integration with mock data
- Test navigation between screens
- Validate form submissions and error handling
- Test on multiple device sizes

## 🔧 Configuration Files
- **app.json**: Expo configuration
- **babel.config.js**: Babel presets for React Native
- **tsconfig.json**: TypeScript configuration
- **package.json**: Dependencies and scripts

## 🐛 Challenges Faced
- **Navigation Complexity**: Managing nested navigators with role-based visibility
- **API Error Handling**: Implementing consistent error states across all screens
- **State Persistence**: Ensuring authentication state survives app restarts
- **UI Consistency**: Maintaining design system across multiple screens
- **Type Safety**: Defining proper TypeScript interfaces for API responses

## 📚 Additional Resources
- [React Native Documentation](https://reactnative.dev/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Documentation](https://reactnavigation.org/docs)
- [Axios Documentation](https://axios-http.com/docs)

## 📄 License
This project is part of the FIAP Tech Challenge and follows academic guidelines.
