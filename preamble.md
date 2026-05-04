You are assisting in building a production-grade mobile application using React Native, Expo, and TypeScript.

## Architecture Overview

This project follows a scalable, maintainable, feature-based architecture with clear separation of concerns, optimized for mobile development.

### Folder Structure

src/
app/        → Navigation structure (Expo Router layouts, screens)
providers/  → Global providers (auth, query, etc.)
features/   → Business domains (auth, users, etc.)
shared/     → Reusable UI and utilities (no business logic)
core/       → Infrastructure (API client, config, storage)
domain/     → (Optional) Pure business logic (framework-agnostic)

---

## Architectural Rules (STRICT)

1. Separation of Concerns

* UI components/screens must NOT contain business logic or API calls
* Logic should live in hooks
* API calls should live in feature-level `api.ts` or core API layer

2. Feature-Based Design

* Code must be organized by feature (e.g., `features/auth`)
* Each feature is self-contained:
  * components/
  * screens/
  * hooks/
  * api.ts
  * types.ts

3. Dependency Direction

* features → shared → core
* NEVER import across features directly unless absolutely necessary
* core must not depend on features

4. Shared Layer Rules

* `shared/` contains ONLY reusable, generic code
* No feature-specific logic allowed
* Includes:
  * UI components (Button, Input, etc.)
  * reusable hooks
  * utilities

5. Core Layer Rules

* `core/` handles:

  * API client (axios)
  * interceptors
  * environment config
  * storage utilities (SecureStore / AsyncStorage)

* No UI or business logic

6. Providers (Global State)

* Use providers only for:

  * authentication state
  * server state (React Query)

* Avoid unnecessary global state

7. Data Fetching

* Use React Query (TanStack Query) for server state
* Do not manually manage loading/error states inside components/screens

8. Navigation (Expo Router)

* Use Expo Router for file-based navigation
* Navigation structure lives inside `app/`
* Use layout files (`_layout.tsx`) for shared wrappers
* Protect routes using auth-aware layouts (not inline checks in screens)

9. Storage

* Do NOT use localStorage (not available in React Native)
* Use:

  * SecureStore for sensitive data (tokens)
  * AsyncStorage for non-sensitive persistence

10. Clean Code Practices

* Prefer small, focused components
* Extract logic into hooks
* Use TypeScript types per feature
* Avoid duplication (DRY)
* Keep components presentational

11. Mobile-Specific Constraints

* No DOM APIs
* Use React Native primitives (`View`, `Text`, `Pressable`, etc.)
* Handle loading states with native components (`ActivityIndicator`)
* Be mindful of performance (avoid unnecessary re-renders)

---

## Expected Output Style

When generating code:

* Follow the folder structure exactly
* Always show correct file paths (e.g., `features/auth/hooks/useLogin.ts`)
* Keep logic, UI, and API clearly separated
* Do not mix concerns
* Prefer production-ready patterns over shortcuts
* Use React Native + Expo-compatible APIs only

---

## Context

This mobile app communicates with a Rails API backend using JSON over HTTP.

Authentication is handled via:
* JWT (stored in SecureStore), or
* HTTP-only cookies (if supported)

---

Always follow this architecture unless explicitly told otherwise.