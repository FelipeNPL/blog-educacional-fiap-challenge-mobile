Alright — this is a solid project, but also big enough that if you don’t structure it well from day one, it turns into chaos.

A `gemini.md` file (assuming you're using it as a project guide for AI-assisted development like Gemini/agents) should do one thing well: **give clear context + constraints so the AI produces consistent code across the app**.

Here’s a **clean, production-oriented `gemini.md`** you can drop into your repo:

---

```md
# 📱 Tech Challenge - Mobile Blogging App (React Native)

## 🧠 Project Context

This project is a mobile front-end application built with **React Native** that consumes an existing **Node.js REST API** for a blogging platform.

The app is designed for two main user roles:

- **Professors (Docentes)** → Can create, edit, delete content
- **Students (Alunos)** → Can only view content

The goal is to provide a **clean, intuitive, and performant mobile experience**.

---

## ⚙️ Tech Stack

- React Native (Expo preferred)
- Functional Components + Hooks
- React Navigation (Stack + Tab)
- Axios (API calls)
- Context API (global state)
- Optional: Redux Toolkit (if state grows too much)

---

## 🧱 Architecture Guidelines

### Folder Structure
```

src/
├── components/
├── screens/
├── navigation/
├── services/ # API calls
├── context/ # Auth + global state
├── hooks/
├── utils/
└── styles/

````

---

## 🔐 Authentication Rules

- Login is required for **professors**
- Store token securely (AsyncStorage or SecureStore)
- Attach token to all authenticated API requests
- Protect routes:
  - Admin / Create / Edit → Professors only
  - Read-only → Students allowed

---

## 📡 API Integration Rules

Use a centralized API service:

```js
// services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'YOUR_BACKEND_URL',
});
````

- Always handle:
  - loading state
  - error state

- Never call API directly inside UI components → use hooks/services

---

## 📱 Screens to Implement

### 1. Home (Post List)

- List all posts
- Show: title, author, description
- Search input (client-side or API)

---

### 2. Post Details

- Full content
- Optional: comments

---

### 3. Create Post (Professor)

- Fields: title, content, author
- Submit to API

---

### 4. Edit Post (Professor)

- Preload existing data
- Update via API

---

### 5. Professors CRUD

- Create
- Edit
- List (paginated)
- Delete

---

### 6. Students CRUD

- Same structure as professors

---

### 7. Admin Panel

- List all posts
- Edit / Delete buttons

---

### 8. Login Screen

- Authentication for professors
- Store session

---

## 🧠 State Management Strategy

Use Context API:

- `AuthContext`
  - user
  - token
  - login()
  - logout()

- `PostContext` (optional)

- `UserContext` (optional)

---

## 🎨 UI/UX Guidelines

- Keep UI minimal and clean
- Use consistent spacing and typography
- Prefer reusable components:
  - Card
  - Input
  - Button
  - ListItem

---

## 🔁 Reusable Patterns

### Loading Pattern

```js
if (loading) return <ActivityIndicator />;
```

### Error Pattern

```js
if (error) return <Text>Error loading data</Text>;
```

---

## 🧪 Validation Rules

- Validate all forms:
  - Required fields
  - Minimum lengths

- Prevent empty submissions

---

## 🚫 What NOT to Do

- Do NOT mix API logic with UI
- Do NOT duplicate components
- Do NOT hardcode data
- Do NOT skip loading/error handling

---

## 🧩 Expected Behavior

- Smooth navigation
- Fast API responses handling
- Clear feedback to user (loading, success, error)
- Role-based access control working correctly

---

## 📚 Documentation Requirements

Include in README:

- Setup instructions
- How to run the app
- Architecture explanation
- API integration details
- Challenges faced

---

## 🎯 Goal

Build a **scalable, maintainable mobile app**, not just something that “works”.

Think like a real product:

- Clean code
- Reusable components
- Clear structure

---

## 🤖 Instructions for AI Assistants (Gemini / ChatGPT)

When generating code:

- Always use **functional components + hooks**
- Follow the folder structure strictly
- Use clean and readable code
- Prefer small reusable components
- Separate logic from UI
- Add basic error handling

---

```

---

### Quick reality check

This file is good enough to:
- Keep your team aligned
- Help AI generate consistent code
- Avoid spaghetti structure (very common in RN projects)

If you want next step, I can help you:
- :contentReference[oaicite:0]{index=0}
- :contentReference[oaicite:1]{index=1}
- Or :contentReference[oaicite:2]{index=2}

Don’t try to build everything at once — start with:
**Login → Post List → Post Details**

That’s your backbone.
```

The swagger-doc.txt file has all the documentation of the backend rest api.
