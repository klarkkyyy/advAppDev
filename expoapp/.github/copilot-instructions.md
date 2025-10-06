## Quick orientation — important facts for code edits

- This is an Expo + React Native app using the Expo Router (file-based routing). Top-level routes live in `app/`. The root stack is configured in `app/_layout.tsx` and the grouped drawer routes are in `app/(drawer)/_layout.tsx`.
- Screens: `app/login.tsx`, `app/signup.tsx`, `app/home.tsx` and drawer screens under `app/(drawer)/` (home, playlists, profile, settings).

## Architecture & navigation

- Router: `expo-router` with typed routes enabled (`app.json` experiments.typedRoutes). Use `useRouter()` for navigation (`router.push`, `router.replace`). See `app/index.tsx` redirects to `/login`.
- Navigation patterns: Stack for top-level auth and a grouped drawer for the main app. Drawer layout wraps screens with a `DrawerAnimatedWrapper` (reanimated) to animate scale/borderRadius during drawer open/close (`useDrawerProgress()` in `app/(drawer)/_layout.tsx`).

## Key dependencies & integration points

- Expo SDK 54 + React Native 0.81.4 (see `package.json`).
- Important native/animation libs: `react-native-reanimated` (requires `react-native-reanimated/plugin` in `babel.config.js`), `react-native-gesture-handler`, and `expo-navigation-bar` (used in drawer layout setup).
- Image/assets: app uses `require('../../assets/images/...')` for bundled images (look at `app/(drawer)/home.tsx`, `app/(drawer)/profile.tsx`). Do not change these paths without verifying the asset exists in `assets/images/`.

## Project conventions and patterns

- File-based routes: route filenames map to paths; grouped routes use folders like `(drawer)` to control router grouping and presentation.
- Dark theme by default. Styles are file-local `StyleSheet.create(...)` with hard-coded color tokens (e.g. `#121212`, `#1DB954`). Prefer consistency when adding UI.
- Animations: many screens use native animations (Animated API or Reanimated). Preserve the Babel plugin and avoid changing animation-related config unless you run the app.
- TypeScript: `tsconfig.json` extends `expo/tsconfig.base` and has `strict: true`.

## Dev workflow & commands

- Install: `npm install` (project root).
- Start: `npm start` or `npx expo start`. Platform shortcuts exist in `package.json`: `npm run android`, `npm run ios`, `npm run web`.
- Lint: `npm run lint` (uses Expo ESLint config in `eslint.config.js`).
- Note: `package.json` lists `reset-project` -> `node ./scripts/reset-project.js` but the `scripts/` file is not present in the repo. Do not rely on this script until it's added.

## Tests and CI

- There are no unit tests or CI config in the repository. If adding tests, follow Expo / React Native test setups (Jest + @testing-library/react-native) and keep them out of `app/` routing files.

## Common edit patterns for agents (examples)

- Add a new route: create `app/new-screen.tsx` and export a default React component. The router auto-creates `/new-screen`.
- Add a drawer item: add a file in `app/(drawer)/` and register any custom label/icon in `app/(drawer)/_layout.tsx` if you need a custom Drawer.Screen option.
- Update animations: keep `babel.config.js` (contains `react-native-reanimated/plugin`). Run the app locally after changes to animation code — Reanimated often requires a native reload.

## Gotchas and safety checks

- Reanimated plugin: removing it will break animated features. Don't edit `babel.config.js` lightly.
- Images: use `require()` with relative paths to `assets/images/`. Changing to remote URIs is allowed, but check platform behavior on web.
- Navigation typed routes: `app/.expo/types/router.d.ts` is generated; do not hand-edit it.

If anything above is unclear or you want the instructions expanded (e.g., adding PR checklist or local debug steps for Android/iOS emulators), tell me which section to expand.
