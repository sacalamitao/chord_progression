# 📱 Frontend Architecture: React Native + Expo (Rails API Backend)

## 1. Purpose

This document defines a scalable, maintainable mobile frontend architecture using **Expo + React Native**, designed to work with a **Rails API backend**.

### Goals

- Scalability
- Maintainability
- Clear separation of concerns
- Feature isolation
- Developer productivity

---

## 2. Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router (or React Navigation)
- TanStack Query
- Axios
- Expo SecureStore (for tokens)

---

## 3. High-Level Architecture

The application follows a layered architecture with a formal validation boundary:

UI (Screens / Components)
↓
Form Layer (React Hook Form + Zod)
↓
Hooks / Mutations (Orchestration Layer)
↓
API Layer (HTTP calls)
↓
Core (Infrastructure)
↓
Backend (Rails API)

### Why this matters

- Validation schemas belong to the **feature boundary**, not inside UI components or random hooks.
- Forms own form-state concerns (field state, dirty state, validation errors).
- Hooks own orchestration concerns (modal lifecycle, mutation flow, side effects).
- APIs accept typed payload objects (DTOs), not positional arguments.

---

## 4. Folder Structure

```txt
src/
  app/                # Expo Router entry (or navigation setup)
    (auth)/
    (tabs)/
    _layout.tsx

  providers/

  features/
    auth/
    users/
    raffles/

  shared/
    components/
    hooks/
    utils/
    constants/

  core/
    api/
    config/
    storage/

  domain/             # optional
```

> 🔥 Key difference from web: `app/` replaces traditional router config when using Expo Router.

---

## 5. App Layer (`app/`)

### Responsibility

- Navigation structure
- Layouts
- Entry point (Expo-managed)

### Example: `app/_layout.tsx`

```tsx
import { Stack } from 'expo-router'
import { AppProviders } from '../providers'

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }} />
    </AppProviders>
  )
}
```

### Route Example

```txt
app/
  (auth)/
    login.tsx
  (tabs)/
    index.tsx
```

---

## 6. Providers

Same concept as web, adapted for React Native.

### 6.1 QueryProvider

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

### 6.2 AuthProvider

Uses secure storage instead of cookies/localStorage.

```tsx
import { createContext, useContext, useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'

type User = {
  id: string
  email: string
}

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      const token = await SecureStore.getItemAsync('token')
      if (token) {
        // fetch current user
      }
      setLoading(false)
    }

    bootstrap()
  }, [])

  return <AuthContext.Provider value={{ user, loading, setUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
```

### 6.3 AppProviders

```tsx
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  )
}
```

---

## 7. Navigation / Routing

### Option A (Recommended): Expo Router

File-based routing:

```txt
app/
  (auth)/login.tsx
  (tabs)/index.tsx
```

#### Protected Layout Example

```tsx
import { Redirect } from 'expo-router'
import { ActivityIndicator } from 'react-native'
import { useAuth } from '../providers/AuthProvider'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <ActivityIndicator />
  if (!user) return <Redirect href="/login" />

  return <>{children}</>
}
```

### Option B: React Navigation

If you prefer explicit control:

- Stack Navigator
- Tab Navigator
- Auth stack vs App stack

---

## 8. Features Layer (`features/`)

Same principle as your web architecture: **feature-first modules**.

### Example

```txt
features/
  auth/
    components/
    screens/
    forms/
    hooks/
    schemas/
    api.ts
    types.ts
```

### Recommended feature structure for scalable form-heavy modules

```txt
features/
  events/
    api/
      createEvent.ts
      updateEvent.ts

    components/
      EventForm.tsx
      EventModal.tsx

    forms/
      eventForm.schema.ts
      useEventForm.ts

    hooks/
      useCreateEventModal.ts

    schemas/
      eventResponse.schema.ts

    types/
      event.ts
```

### Example API

```ts
import api from '@/core/api/client'

type LoginPayload = {
  email: string
  password: string
}

export const login = (payload: LoginPayload) => api.post('/login', payload)
```

### DTO-first API design (recommended)

Prefer this:

```ts
type CreateEventPayload = {
  name: string
  scheduledOn?: string | null
  imageUrl?: string | null
}

export const createEvent = (payload: CreateEventPayload) =>
  api.post('/events', payload)
```

Avoid this:

```ts
createEvent(name, scheduledOn, imageUrl)
```

### Example Hook

```ts
import { useMutation } from '@tanstack/react-query'
import { login } from './api'

export function useLogin() {
  return useMutation({
    mutationFn: login,
  })
}
```

---

## 9. Shared Layer (`shared/`)

Reusable, generic code only:

```txt
shared/
  components/
  hooks/
  utils/
  constants/
```

Examples:

- Buttons
- Inputs
- Layout wrappers
- Utility hooks (e.g., `useDebounce`)

---

## 10. Core Layer (`core/`)

### Structure

```txt
core/
  api/
  config/
  storage/
```

### API Client

```ts
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
})

export default api
```

### Interceptors

```ts
import * as SecureStore from 'expo-secure-store'

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Storage Helper

```ts
import * as SecureStore from 'expo-secure-store'

export const storage = {
  get: (key: string) => SecureStore.getItemAsync(key),
  set: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  remove: (key: string) => SecureStore.deleteItemAsync(key),
}
```

---

## 11. Domain Layer (`domain/`) – Optional

```txt
domain/
  models/
  usecases/
  mappers/
```

Use this when:

- Business logic becomes complex
- You want framework-independent domain rules

---

## 12. Data Flow

Screen/Modal → Form Layer (RHF + Zod) → Hook/Mutation → API → Core → Backend

---

## 13. Form & Validation Strategy

### Principles

- Use **React Hook Form** for form state management.
- Use **Zod** for validation, DTO parsing, and runtime contract enforcement.
- Keep schemas inside the feature that owns them (`features/<feature>/forms` or `features/<feature>/schemas`).
- Do **not** create a broad `shared/schemas/` folder too early.

### Senior form architecture pattern

```txt
schema.ts
↓
form hook
↓
presentational form component
↓
screen/modal
```

### Example form schema

```ts
import { z } from 'zod'

export const eventFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Event name is required')
    .max(100, 'Event name is too long'),
  scheduledOn: z.date().nullable(),
  imageUrl: z.string().trim().url('Must be a valid URL').optional().or(z.literal('')),
})

export type EventFormValues = z.infer<typeof eventFormSchema>
```

### Example form hook

```ts
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventFormSchema, type EventFormValues } from './eventForm.schema'

export function useEventForm(initialValues?: Partial<EventFormValues>) {
  return useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: '',
      scheduledOn: null,
      imageUrl: '',
      ...initialValues,
    },
  })
}
```

### Hook responsibilities after introducing form layer

`useCreateEventModal` should focus on:

- visible
- mode
- editing id
- submit orchestration
- modal lifecycle

It should **not** own:

- field state
- validation rules
- error mapping
- dirty tracking

### Zod beyond forms

Zod is not only form validation. Use it for:

- runtime validation
- API contract validation
- DTO parsing
- boundary transformations

Example:

```ts
const eventResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
})

const parsed = eventResponseSchema.parse(response.data)
```

---

## 14. Mobile-Specific Considerations

1. **Navigation replaces routing**
   - No traditional URLs (except deep linking)
   - Stack/tab mental model

2. **Storage differences**
   - No cookies/localStorage
   - Use SecureStore or AsyncStorage

3. **Network handling**
   - Handle offline states
   - Use retry/stale-time strategies (TanStack Query)

4. **UI differences**
   - No DOM
   - Use `View`, `Text`, `Pressable`, etc.

---

## 15. Key Principles (Unchanged)

- Separation of concerns
- Feature isolation
- Clear dependency direction
- Minimal global state
- Avoid premature abstraction

---

## 15. What You Did Right (Important Insight)

Your emphasis on **feature-first architecture** is exactly what scales in React Native too.

Many RN apps fail because they:

- Group by file type globally (all components/screens/hooks together)
- Create tight coupling across modules
- Become hard to maintain as features grow

Your structure avoids that trap.

---

## 16. Optional Enhancements

- Add form management (React Hook Form + Zod)
- Add a design system inside `shared/components`
- Add global error boundary strategy
- Add offline-first support and cache hydration

---

## 17. Conclusion

This adaptation preserves the strengths of your web architecture while making it:

- Mobile-friendly
- Expo-native
- Secure for token handling
- Navigation-aware
- Scalable for long-term development
- Explicit at boundaries (validation + DTO contracts)
