# Smart Study Planner - Architecture Documentation

## 📋 Overview
This document explains the frontend and backend separation of the Smart Study Planner application, designed for SRS project requirements.

---

## 🏗️ System Architecture

The application follows a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React + TypeScript + Tailwind CSS + Motion (Framer)       │
│  Location: /App.tsx, /components/, /utils/, /styles/       │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ HTTP Requests
                   │ (fetch API)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER                            │
│  Supabase Edge Function + Hono Web Server                  │
│  Location: /supabase/functions/server/index.tsx            │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Database Operations
                   │ (KV Store API)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE                               │
│  Supabase PostgreSQL with Key-Value Store                  │
│  Utility: /supabase/functions/server/kv_store.tsx          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 FRONTEND

### **Location**
All frontend code is located outside the `/supabase/functions/server/` directory.

### **Core Files**

#### **1. Main Application**
- **`/App.tsx`** - Main application component
  - Authentication state management
  - Route/view management (Dashboard, Tasks, Timer, Scheduler, Analytics)
  - API communication with backend
  - User session handling

#### **2. Components** (`/components/`)
| Component | Purpose |
|-----------|---------|
| `LoginPage.tsx` | User login interface with validation |
| `SignupPage.tsx` | User registration interface |
| `Dashboard.tsx` | Main dashboard showing analytics and upcoming tasks |
| `TaskManager.tsx` | Task creation, editing, and deletion |
| `FocusTimer.tsx` | Pomodoro timer with motivational quotes |
| `StudyScheduler.tsx` | AI-powered study schedule generator |
| `Analytics.tsx` | Study progress tracking and insights |
| `DebugHelper.tsx` | Developer tool for debugging authentication |
| `QuickStartGuide.tsx` | User onboarding guide |
| `LoginHelperPanel.tsx` | Real-time input validation helper |
| `SkeletonLoader.tsx` | Loading state components |

#### **3. UI Components** (`/components/ui/`)
- ShadCN UI library components (44 components)
- Reusable UI primitives for consistent design

#### **4. Utilities** (`/utils/`)
- **`supabase/client.tsx`** - Supabase client initialization (frontend)
- **`supabase/info.tsx`** - Project configuration (projectId, publicAnonKey)
- **`ThemeContext.tsx`** - Dark mode theme provider

#### **5. Styles** (`/styles/`)
- **`globals.css`** - Global Tailwind CSS styles and custom typography

### **Technology Stack**
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4.0 with custom pastel color scheme
- **Animations**: Motion (Framer Motion)
- **UI Components**: ShadCN UI
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Authentication**: Supabase Auth

### **Key Frontend Features**
✅ User authentication (login/signup)  
✅ Real-time input validation  
✅ Password visibility toggle  
✅ Dark mode support  
✅ Responsive design (mobile & desktop)  
✅ Optimistic UI updates  
✅ Skeleton loading states  
✅ Toast notifications  
✅ Animation transitions  

---

## ⚙️ BACKEND

### **Location**
All backend code is located in `/supabase/functions/server/`

### **Core Files**

#### **1. Main Server** (`/supabase/functions/server/index.tsx`)
- **Framework**: Hono Web Server
- **Runtime**: Deno (Supabase Edge Function)
- **Authentication**: Supabase Auth with JWT tokens

### **API Endpoints**

#### **Public Endpoints** (No authentication required)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/make-server-62ce5e0f/health` | GET | Server health check |
| `/make-server-62ce5e0f/signup` | POST | User registration |
| `/make-server-62ce5e0f/ensure-demo-account` | POST | Create demo account |
| `/make-server-62ce5e0f/check-user` | POST | Check if user exists (debugging) |

#### **Protected Endpoints** (Authentication required)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/make-server-62ce5e0f/tasks` | GET | Get all user tasks |
| `/make-server-62ce5e0f/tasks` | POST | Create new task |
| `/make-server-62ce5e0f/tasks/:id` | PUT | Update task |
| `/make-server-62ce5e0f/tasks/:id` | DELETE | Delete task |
| `/make-server-62ce5e0f/sessions` | GET | Get all study sessions |
| `/make-server-62ce5e0f/sessions` | POST | Create study session |
| `/make-server-62ce5e0f/analytics` | GET | Get analytics data |
| `/make-server-62ce5e0f/all-data` | GET | **Batched endpoint** - Get tasks, sessions, and analytics in one call |
| `/make-server-62ce5e0f/generate-schedule` | POST | Generate AI study schedule |

### **Database Utility** (`/supabase/functions/server/kv_store.tsx`)
- **⚠️ PROTECTED FILE** - Do not modify
- Provides key-value store operations: `get`, `set`, `del`, `mget`, `mset`, `mdel`, `getByPrefix`

### **Technology Stack**
- **Framework**: Hono
- **Runtime**: Deno
- **Database**: Supabase PostgreSQL (KV Store)
- **Authentication**: Supabase Auth (Service Role Key)
- **CORS**: Enabled for all origins

### **Key Backend Features**
✅ User authentication with email/password  
✅ Automatic demo account creation  
✅ Email validation and duplicate checking  
✅ JWT token-based authorization  
✅ Batched API endpoints for performance  
✅ AI-powered study schedule generation  
✅ Real-time analytics calculation  
✅ Comprehensive error handling and logging  
✅ Session tracking and management  

### **Data Models**

#### **Task**
```typescript
{
  id: string                    // UUID
  title: string                 // Task name
  subject: string               // Subject category
  estimatedHours: number        // Estimated study time
  deadline: string              // ISO date string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  createdAt: string             // ISO date string
}
```

#### **Session**
```typescript
{
  id: string                    // UUID
  taskId: string                // Reference to task
  duration: number              // Minutes studied
  completedAt: string           // ISO date string
}
```

#### **User**
```typescript
{
  id: string                    // Supabase user ID
  email: string
  user_metadata: {
    name: string
  }
}
```

---

## 🔐 Authentication Flow

### **Signup Process**
```
1. User enters email, password, name on frontend
2. Frontend sends POST to /signup
3. Backend validates password (min 6 chars)
4. Backend checks for duplicate email
5. Backend creates user with Supabase Auth
6. Backend returns user object
7. Frontend automatically logs in user
8. Frontend redirects to dashboard
```

### **Login Process**
```
1. User enters email and password on frontend
2. Frontend calls Supabase Auth signInWithPassword
3. Supabase validates credentials
4. Frontend receives access token
5. Frontend stores token in state
6. Frontend uses token for all API requests
```

### **Authorization**
- All protected endpoints verify JWT token using `verifyUser()` function
- Token is sent in `Authorization: Bearer <token>` header
- Invalid/expired tokens return 401 Unauthorized

---

## 📡 Frontend-Backend Communication

### **Request Flow Example (Adding a Task)**

```typescript
// FRONTEND (App.tsx)
const handleAddTask = async (task: any) => {
  // 1. Optimistic UI update
  const optimisticTask = { id: `temp-${Date.now()}`, ...task }
  setTasks(prev => [...prev, optimisticTask])
  
  // 2. Send request to backend
  const res = await fetch(`${serverUrl}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(task)
  })
  
  // 3. Handle response
  const data = await res.json()
  if (res.ok) {
    setTasks(prev => prev.map(t => 
      t.id === optimisticTask.id ? data.task : t
    ))
  }
}
```

```typescript
// BACKEND (index.tsx)
app.post('/make-server-62ce5e0f/tasks', async (c) => {
  // 1. Verify user authentication
  const { error, userId } = await verifyUser(c.req.raw)
  if (error) return c.json({ error }, 401)
  
  // 2. Extract task data
  const { title, subject, estimatedHours, deadline, priority } = 
    await c.req.json()
  
  // 3. Get existing tasks from database
  const tasksKey = `tasks:${userId}`
  const existingTasks = await kv.get(tasksKey) || []
  
  // 4. Create new task
  const newTask = {
    id: crypto.randomUUID(),
    title, subject,
    estimatedHours: Number(estimatedHours),
    deadline, priority,
    completed: false,
    createdAt: new Date().toISOString()
  }
  
  // 5. Save to database
  await kv.set(tasksKey, [...existingTasks, newTask])
  
  // 6. Return task to frontend
  return c.json({ task: newTask })
})
```

---

## 🚀 Performance Optimizations

### **1. Batched API Endpoint**
Instead of 3 separate requests on dashboard load:
```typescript
// ❌ OLD (3 requests)
await fetch('/tasks')
await fetch('/sessions')  
await fetch('/analytics')

// ✅ NEW (1 request)
await fetch('/all-data')  // Returns tasks, sessions, analytics
```

### **2. Optimistic UI Updates**
- Frontend updates UI immediately before backend confirmation
- Better perceived performance
- Reverts on error

### **3. Skeleton Loading States**
- Custom loading skeletons for each component
- Better UX than spinners or blank screens

### **4. Parallel Data Fetching**
Backend uses `Promise.all()` for concurrent database queries:
```typescript
const [tasks, sessions] = await Promise.all([
  kv.get(tasksKey),
  kv.get(sessionsKey)
])
```

---

## 🎨 Design System

### **Color Scheme (Pastel Theme)**
- **Purple**: `purple-300` - Primary brand color
- **Blue**: `blue-300` - Secondary actions
- **Pink**: `pink-300` - Accents and gradients
- **Green**: `green-300` - Success states
- **Orange**: `orange-300` - Warnings/highlights

### **Dark Mode**
- Fully supported across all components
- Toggle available in navigation bar
- Context-based theme management

---

## 📝 Environment Variables

### **Frontend Access**
```typescript
import { projectId, publicAnonKey } from './utils/supabase/info'
```

### **Backend Access**
```typescript
Deno.env.get('SUPABASE_URL')
Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
Deno.env.get('SUPABASE_ANON_KEY')
```

### **Security Notes**
- ⚠️ **Never expose `SUPABASE_SERVICE_ROLE_KEY` to frontend**
- ✅ Frontend only uses `publicAnonKey` (read-only access)
- ✅ Backend uses Service Role Key for admin operations

---

## 🐛 Debugging Features

### **Login Debug Tools**
1. **Real-time Input Validation** - Shows validation status as user types
2. **Check Email Tool** - Verifies if email has an account
3. **Password Visibility Toggle** - Shows/hides password
4. **Quick Start Guide** - Appears after failed login
5. **Comprehensive Console Logging** - Detailed error information

### **Console Logging Examples**
```
🔑 LOGIN ATTEMPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email entered: "user@example.com"
Password length: 8
Email has spaces: NO ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📦 Demo Account

**Pre-configured demo account:**
- **Email**: `demo@studyplanner.com`
- **Password**: `Demo123!`
- **Includes**: 2 sample tasks, 2 completed sessions

**Created automatically on server startup**

---

## 🔄 Data Flow Diagrams

### **User Signs Up**
```
Frontend                Backend                 Database
   │                       │                        │
   ├─ POST /signup ────────>│                        │
   │                       ├─ Check duplicate ──────>│
   │                       │<─ User exists? ─────────┤
   │                       ├─ Create user ──────────>│
   │                       │<─ User created ─────────┤
   │<─ User object ────────┤                        │
   ├─ Auto login ──────────>│                        │
   │<─ Access token ───────┤                        │
   │                       │                        │
```

### **User Completes Study Session**
```
Frontend                Backend                 Database
   │                       │                        │
   ├─ Show timer           │                        │
   ├─ Start countdown      │                        │
   ├─ Timer completes      │                        │
   ├─ POST /sessions ──────>│                        │
   │                       ├─ Verify auth ──────────>│
   │                       ├─ Get sessions ─────────>│
   │                       │<─ Sessions array ───────┤
   │                       ├─ Add new session       │
   │                       ├─ Save sessions ────────>│
   │                       │<─ Saved ────────────────┤
   │<─ Session object ─────┤                        │
   ├─ Update UI            │                        │
   ├─ Show toast           │                        │
   │                       │                        │
```

---

## 🎯 Key Separation Principles

### ✅ **What Frontend Does**
- User interface rendering
- User input handling
- Client-side validation
- State management (UI state)
- Authentication token storage
- Optimistic UI updates
- Navigation/routing

### ✅ **What Backend Does**
- User authentication (signup)
- Authorization (JWT verification)
- Data validation (server-side)
- Business logic (analytics calculation, schedule generation)
- Database operations (CRUD)
- Session management
- Error handling

### ✅ **What Database Does**
- Persistent data storage
- User account management (Supabase Auth)
- Key-value data storage
- Data retrieval

---

## 📊 File Structure Summary

```
Smart Study Planner/
│
├── 🎨 FRONTEND
│   ├── App.tsx                          # Main application
│   ├── components/                      # React components
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── TaskManager.tsx
│   │   ├── FocusTimer.tsx
│   │   ├── StudyScheduler.tsx
│   │   ├── Analytics.tsx
│   │   ├── DebugHelper.tsx
│   │   ├── QuickStartGuide.tsx
│   │   ├── LoginHelperPanel.tsx
│   │   ├── SkeletonLoader.tsx
│   │   └── ui/                          # 44 ShadCN components
│   ├── utils/
│   │   ├── ThemeContext.tsx
│   │   └── supabase/
│   │       ├── client.tsx               # Supabase client (frontend)
│   │       └── info.tsx                 # Config (projectId, publicAnonKey)
│   └── styles/
│       └── globals.css                   # Tailwind styles
│
└── ⚙️ BACKEND
    └── supabase/functions/server/
        ├── index.tsx                     # Main server (Hono)
        └── kv_store.tsx                  # Database utility (PROTECTED)
```

---

## 🔧 Development Commands

### **Frontend Development**
```bash
# Frontend runs automatically in the Make environment
# No build commands needed - hot reload enabled
```

### **Backend Development**
```bash
# Backend runs automatically as Supabase Edge Function
# Deno runtime handles all server operations
```

---

## 📈 Future Enhancements (Optional for SRS)

### **Frontend**
- [ ] Add progressive web app (PWA) support
- [ ] Implement offline mode with local storage
- [ ] Add data export (CSV/PDF)
- [ ] Create onboarding tutorial
- [ ] Add keyboard shortcuts

### **Backend**
- [ ] Implement rate limiting
- [ ] Add email notifications
- [ ] Create backup/restore endpoints
- [ ] Add advanced analytics (weekly/monthly reports)
- [ ] Implement collaborative study sessions

---

## 🎓 Conclusion

The Smart Study Planner successfully demonstrates a **clear separation between frontend and backend**, following industry-standard three-tier architecture. The frontend handles all user interactions and UI rendering, the backend manages business logic and data operations, and the database stores persistent data. This separation ensures:

✅ **Maintainability** - Easy to update frontend without touching backend  
✅ **Scalability** - Backend can serve multiple frontends (web, mobile, etc.)  
✅ **Security** - Sensitive operations only happen on backend  
✅ **Performance** - Optimized API calls and batched endpoints  
✅ **Testability** - Each layer can be tested independently  

Perfect for your SRS project documentation! 🚀
