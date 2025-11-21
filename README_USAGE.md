# JNTU GV Placement Portal - Usage Guide

## Overview
This is a modern, accessible, and responsive placement management system built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API (see environment variables below)

## Installation

1. **Clone or navigate to the repository**
   ```bash
   cd college-placement-management-system/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Navbar.tsx           # Main navigation component
│   └── ui/                       # Reusable UI components
│       ├── stat-card.tsx         # Statistics display card
│       ├── tag-input.tsx         # Skills/tags input component
│       ├── file-upload.tsx       # File upload with validation
│       └── skeleton-loader.tsx   # Loading state components
├── pages/
│   ├── Landing.tsx               # Public landing page
│   ├── auth/
│   │   ├── Login.tsx             # Login page
│   │   └── Signup.tsx            # Registration page
│   ├── student/
│   │   ├── Dashboard.tsx         # Student dashboard
│   │   └── Profile.tsx           # Student profile form
│   ├── admin/
│   │   └── Dashboard.tsx         # TPO/Admin dashboard
│   └── recruiter/
│       └── Reports.tsx           # Recruiter student view
├── hooks/
│   └── use-theme.ts              # Theme toggle hook
├── lib/
│   └── utils.ts                  # Utility functions
├── index.css                      # Design system & CSS variables
└── App.tsx                        # Main app component with routing

```

## Key Features

### 1. **Landing Page** (`/`)
- Hero section with statistics
- Features overview
- How it works section
- Footer with contact info

### 2. **Authentication** (`/login`, `/signup`)
- Email/password authentication
- Role-based registration (Student/Recruiter)
- Client-side validation
- Social login placeholders

### 3. **Student Features**
- **Dashboard** (`/student/dashboard`)
  - Profile completion tracker
  - Application timeline
  - Quick actions
  - Statistics overview

- **Profile Form** (`/student/profile`)
  - Multi-tab form (Personal, Academic, Experience, Preferences)
  - Auto-save to localStorage
  - Resume upload with validation
  - Projects and certifications management
  - Skills tag input
  - Preview mode (matches recruiter view)

### 4. **Admin/TPO Features** (`/admin/dashboard`)
- Student list with filtering
  - By department, GPA, placement status
  - Search by name/email
  - Verified only filter
- Bulk actions (select multiple students)
- Profile verification
- Send profiles to recruiters
- Export reports (CSV/PDF)

### 5. **Recruiter Features** (`/recruiter/reports`)
- Browse verified student profiles
- Advanced filtering
  - Department, min GPA, skills
- View full student profiles (read-only)
- Request interviews
- Export filtered student lists

## Design System

### Theme Toggle
- Light/dark mode support
- Preference saved to localStorage
- Toggle in navbar

### Color Palette
Defined in `src/index.css`:
- **Primary**: Indigo (HSL: 239 84% 67%)
- **Secondary**: Teal (HSL: 174 62% 47%)
- **Success**: Green (HSL: 142 71% 45%)
- **Warning**: Orange (HSL: 38 92% 50%)
- **Destructive**: Red (HSL: 0 84% 60%)

### Accessibility Features
- Full keyboard navigation
- ARIA labels and attributes
- Focus states
- Semantic HTML
- Screen reader friendly
- Form validation with error messages

## API Integration

### Expected Endpoints

**Auth**
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

**Student**
- `GET /student/profile` - Get student profile
- `POST /student/profile` - Update student profile
- `GET /student/applications` - Get applications

**Admin**
- `GET /admin/students` - Get all students with filters
- `PUT /admin/students/:id/verify` - Verify student
- `POST /admin/students/send-to-recruiters` - Send profiles

**Recruiter**
- `GET /recruiter/students` - Get verified students
- `POST /recruiter/interview-request` - Request interview

### Sample API Call Pattern

```typescript
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

// Login example
const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE}/auth/login`, {
    email,
    password,
  });
  return response.data;
};
```

## Mock Data

All pages currently use mock data for development. Replace API calls in:
- `src/pages/auth/Login.tsx`
- `src/pages/auth/Signup.tsx`
- `src/pages/student/Dashboard.tsx`
- `src/pages/student/Profile.tsx`
- `src/pages/admin/Dashboard.tsx`
- `src/pages/recruiter/Reports.tsx`

Search for `// TODO: Replace with actual API call` comments.

## Building for Production

```bash
npm run build
# or
yarn build
```

Output will be in the `dist/` folder. Deploy to any static hosting service.

## Environment Variables

- `VITE_BACKEND_URL` - Backend API base URL (required)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Notes

1. **Auto-save**: Student profile form auto-saves to localStorage every second
2. **File Upload**: Supports PDF, DOC, DOCX up to 5MB (configurable)
3. **Tag Input**: Max 20 tags per field (configurable)
4. **Form Validation**: Client-side validation with error messages
5. **Loading States**: Skeleton loaders for better UX

## Customization

### Modify Colors
Edit `src/index.css` CSS variables under `:root` and `.dark`

### Add New Routes
Add routes in `src/App.tsx`:
```typescript
<Route path="/new-path" element={<NewComponent />} />
```

### Modify Filters
Edit filter logic in respective dashboard files

## Support

For issues or questions:
- Email: placements@jntugv.edu.in
- Check component comments for accessibility notes
