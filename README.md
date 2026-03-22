# Personal Task Tracker - Frontend

Modern web frontend built with NextJS, Tailwind CSS, and React Query.

## Tech Stack

- **Framework**: NextJS (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Shared Logic**: personal-task-tracker-core

## Features

- ✅ Task list with title, status badge, and creation date
- ✅ Filter tasks by status (All, To Do, In Progress, Done)
- ✅ Add new tasks with title and optional description
- ✅ Edit tasks inline via form (title, description, status)
- ✅ Delete tasks with confirmation
- ✅ Mark tasks as complete with a single click
- ✅ Immediate UI updates after API calls
- ✅ Clean, responsive design

## Development

```bash
npm install
npm run dev           # Development server
npm run build         # Production build
npm start             # Production server
```

## Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Providers
│   ├── page.tsx            # Home page with TaskList
│   └── globals.css         # Global styles
├── components/
│   ├── Providers.tsx       # React Query provider
│   ├── TaskList.tsx        # Main task list container
│   ├── TaskItem.tsx        # Individual task card
│   ├── TaskForm.tsx        # Add/Edit task form
│   └── StatusFilter.tsx    # Status filter buttons
├── hooks/
│   └── useTasks.ts         # React Query hooks for CRUD
└── lib/
    └── api.ts              # Axios API client
```
