# Hana Teacher App — Cấu trúc Source Code

## 1. Thông tin dự án

| Thuộc tính | Giá trị |
|---|---|
| Package name | `@hana/teacher` |
| App name | Hana Teacher |
| Bundle ID (iOS) | `terasolutions.app.fnb` |
| Package (Android) | `terasolutions.app.fnb` |
| Entry point | `expo-router/entry` |
| Orientation | Portrait only |
| New Architecture | Enabled |

---

## 2. Công nghệ sử dụng

### Core Framework
| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| expo | 54.0.30 | React Native framework |
| react-native | 0.81.5 | Native mobile |
| expo-router | 6.0.21 | File-based routing |

### State Management
| Thư viện | Mục đích |
|---|---|
| mobx | Reactive state (local/global) |
| mobx-react-lite | MobX bindings cho React |
| @tanstack/react-query 5.90.11 | Server state, caching, mutations |

### UI
| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| react-native-paper | 5.14.5 | Material Design components |
| react-native-reanimated | 4.1.1 | Animations |
| react-native-gesture-handler | 2.28.0 | Gestures |
| react-native-safe-area-context | 5.6.0 | Safe area |
| react-native-screens | 4.16.0 | Navigation optimization |
| react-native-svg | 15.12.1 | SVG rendering |
| lucide-react-native | 1.20.0 | Icon set |

### Forms & Validation
| Thư viện | Mục đích |
|---|---|
| react-hook-form | Form state management |
| yup | Schema validation |
| zod | Type-safe validation |

### Network & Data
| Thư viện | Mục đích |
|---|---|
| axios | HTTP client |
| socket.io-client | WebSocket (real-time) |
| @nozbe/watermelondb 0.28.0 | Local database |

### Dev Tools
| Thư viện | Mục đích |
|---|---|
| reactotron-react-native | Debug inspector |
| react-native-toast-message | Toast notifications |

---

## 3. Cấu hình

### tsconfig.json — Path Aliases

```
@app/*          → src/app
@components/*   → src/components
@screens/*      → src/screens
@states/*       → src/states
@hooks/*        → src/hooks
@provider/*     → src/provider
@types/*        → src/types
@hana/teacher/services/*  → src/services
```

Monorepo packages (từ workspace `@tera/*`):
- `@tera/commons`, `@tera/components`, `@tera/databases`
- `@tera/api`, `@tera/stores`, `@tera/modules`, `@tera/assets`

Compiler options: `strict`, `experimentalDecorators`, `moduleResolution: bundler`

### babel.config.js

- Preset: `babel-preset-expo` với `unstable_transformImportMeta`
- Plugins:
  - `module-resolver` — path aliases
  - `@babel/plugin-proposal-decorators` legacy mode (cho MobX)
  - `react-native-reanimated/plugin`
  - `@babel/plugin-syntax-import-meta`

### metro.config.js

- Cấu hình monorepo: `watchFolders` tới workspace root
- SVG transformer: dùng `react-native-svg-transformer`
- `disableHierarchicalLookup: true` — tránh lỗi React hooks trong monorepo
- `extraNodeModules`: trỏ React/RN về local `node_modules`

### app.json — Expo Plugins

```
expo-router, expo-splash-screen, expo-font,
expo-web-browser, expo-task-manager,
expo-background-fetch, expo-location
```

Experiments enabled: `typedRoutes`, `reactCompiler`, `tsconfigPaths`

### .eslintrc

- Parser: `@typescript-eslint/parser`
- Extends: `@typescript-eslint/recommended`, `prettier`
- Rules bắt buộc:
  - `semi: error`
  - `react-hooks/rules-of-hooks: error`
  - `@typescript-eslint/no-unused-vars: error`
  - `prettier/prettier: error`

### .prettierrc

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "jsxBrackets": false
}
```

### eas.json — Build Profiles

| Profile | Platform | Output |
|---|---|---|
| preview | Android | APK (`NODE_ENV=production`) |
| production | Android | App bundle |

---

## 4. Cấu trúc thư mục

```
apps/hana-teacher/
├── src/
│   ├── app/                        # Expo Router — file-based routes
│   │   ├── _layout.tsx             # Root layout: providers, fonts
│   │   ├── (tabs)/                 # Bottom tab navigator (5 tabs)
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx           # → HomeScreen
│   │   │   ├── classroom.tsx       # → ClassroomScreen
│   │   │   ├── lesson-plan.tsx     # → LessonPlanScreen
│   │   │   ├── teaching-schedule.tsx # → TeachingScheduleScreen
│   │   │   └── account.tsx         # → AccountScreen
│   │   ├── auth/
│   │   │   └── login.tsx           # → LoginScreen
│   │   ├── edu/                    # Stack navigator — edu flows
│   │   │   ├── _layout.tsx
│   │   │   ├── achievement.tsx
│   │   │   ├── assignment-grading.tsx
│   │   │   ├── homework.tsx
│   │   │   ├── lesson.tsx
│   │   │   └── timetable.tsx
│   │   ├── student/                # Stack navigator — student flows
│   │   │   ├── _layout.tsx
│   │   │   └── attendance.tsx
│   │   └── navigation/
│   │       └── RootNavigator.tsx   # Auth check + redirect logic
│   │
│   ├── assets/
│   │   ├── fonts/                  # Roboto (6 weights) + MaterialCommunityIcons
│   │   ├── icons/                  # SVG icons (ic_*.svg)
│   │   └── images/                 # PNG: logo, splash, launcher
│   │
│   ├── components/
│   │   ├── ui/                     # Primitive UI wrappers (Button, TextInput…)
│   │   │   ├── index.tsx           # Barrel export
│   │   │   ├── Button/
│   │   │   ├── TextInput/
│   │   │   ├── InputPassword/
│   │   │   ├── SelectBox/
│   │   │   ├── DateTime/
│   │   │   ├── Switch/
│   │   │   ├── Loading/
│   │   │   ├── ScreenLoader/
│   │   │   ├── SearchInput/
│   │   │   └── Splash/
│   │   ├── shared/                 # Reusable cross-screen components
│   │   │   ├── BaseScreen.tsx
│   │   │   ├── Form/               # Form.Input, Form.InputPassword, Form.DateTime, Form.Switch
│   │   │   ├── CalculatorDialog.tsx
│   │   │   ├── FloatButtonModal.tsx
│   │   │   ├── MyErrorBoundary.tsx
│   │   │   ├── SuspenseWith.tsx
│   │   │   └── LazyWithPreload.tsx
│   │   ├── common/                 # Generic utility components
│   │   │   ├── AppCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   └── external-link.tsx
│   │   └── domain/                 # Business-domain components
│   │       ├── Card.tsx
│   │       └── DrawerFilter.tsx
│   │
│   ├── screens/                    # Screen implementations
│   │   ├── Root.tsx                # Root wrapper (SafeAreaProvider + queries)
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen/
│   │   │   ├── index.tsx
│   │   │   ├── style.ts
│   │   │   └── components/
│   │   │       ├── HeaderSection/
│   │   │       ├── TodayScheduleCard/
│   │   │       ├── QuickActionGrid/
│   │   │       ├── ClassOverviewCard/
│   │   │       ├── StudentOverviewCard/
│   │   │       ├── TodoSection/
│   │   │       └── NotificationSection/
│   │   ├── ClassroomScreen/
│   │   │   ├── index.tsx
│   │   │   ├── style.ts
│   │   │   ├── types.tsx
│   │   │   ├── mocks.tsx
│   │   │   └── components/
│   │   ├── AccountScreen/
│   │   │   ├── index.tsx
│   │   │   ├── style.ts
│   │   │   ├── types.ts
│   │   │   ├── constants.ts
│   │   │   └── components/
│   │   ├── AttendanceScreen/
│   │   ├── LessonPlanScreen/
│   │   ├── LessonScreen/
│   │   ├── TeachingScheduleScreen/
│   │   ├── TimetableScreen/
│   │   ├── HomeworkScreen/
│   │   ├── AchievementScreen/
│   │   └── AssignmentGradingScreen/
│   │
│   ├── services/
│   │   ├── api/                    # API modules (mỗi domain 1 file)
│   │   │   ├── AuthAPI.ts
│   │   │   ├── UserAPI.ts
│   │   │   ├── BusinessAPI.ts
│   │   │   ├── BusinessLocationAPI.ts
│   │   │   ├── CustomerAPI.ts
│   │   │   ├── SyncAPI.ts
│   │   │   └── TradingAPI.ts
│   │   ├── drivers/
│   │   │   ├── index.ts            # Axios instance + helper methods
│   │   │   └── _interceptor.ts     # Request/response interceptors
│   │   ├── auth.service.ts         # React Query hooks (useLogin, useLogout…)
│   │   ├── business.service.ts
│   │   └── print_bluetooth.service.ts
│   │
│   ├── states/                     # MobX stores
│   │   ├── index.ts                # RootStore factory + Context
│   │   ├── _interface.ts           # TypeScript interfaces
│   │   ├── authStore.ts            # Token, user, role, isHydrated
│   │   ├── generalStore.ts         # Device, version, offline status
│   │   ├── uiStore.ts              # Industry, business_info
│   │   └── printStore.ts           # Bluetooth printer state
│   │
│   ├── hooks/
│   │   └── useStates.ts            # Hook truy cập RootStore
│   │
│   ├── provider/
│   │   └── SocketProvider.tsx      # Socket.io context provider
│   │
│   └── types/
│       ├── global.d.ts             # Console.tron, nativeWatermelonCreateAdapter
│       ├── images.d.ts             # declare module '*.png'
│       ├── svg.d.ts                # declare module '*.svg'
│       └── toast.d.ts              # Augment react-native-toast-message
│
├── app.json
├── babel.config.js
├── metro.config.js
├── tsconfig.json
├── .eslintrc
├── .prettierrc
├── eas.json
├── index.js
└── ReactotronConfig.js
```

---

## 5. Luồng Navigation

```
Root (_layout.tsx)
 └─ Providers: GestureHandler → PaperProvider → QueryClient → Toast
     └─ Root.tsx (SafeAreaProvider + init queries)
         └─ RootNavigator.tsx
             ├─ Chưa đăng nhập → /auth/login
             └─ Đã đăng nhập → SocketProvider
                 ├─ (tabs) — Bottom Tab Navigation
                 │   ├─ /          HomeScreen
                 │   ├─ /classroom ClassroomScreen
                 │   ├─ /lesson-plan LessonPlanScreen
                 │   ├─ /teaching-schedule TeachingScheduleScreen
                 │   └─ /account  AccountScreen
                 ├─ /edu — Stack Navigator
                 │   ├─ lesson, homework, assignment-grading
                 │   ├─ achievement, timetable
                 └─ /student — Stack Navigator
                     └─ attendance
```

---

## 6. Luồng dữ liệu

### Authentication
```
LoginScreen (react-hook-form)
  → useLogin() mutation
  → AuthApi.login(params)
  → axios interceptor (gắn headers)
  → onSuccess: authStore.updateUser() + uiStore.setIndustry()
  → RootNavigator redirect về /
```

### Truy cập Store
```
Component (observer)
  → useStates() hook
  → rootStoreContext
  → RootStore { authStore, generalStore, uiStore, printStore }
  → MobX reactive state
  → AsyncStorage persistence
```

### API Request
```
Service hook (useQuery / useMutation)
  → API module function (e.g. AuthApi.login)
  → drivers/index.ts (axios wrapper)
  → _interceptor.ts (thêm Authorization, device-code, business-id headers)
  → Backend response
  → _requestResponse (check code === 200)
```

---

## 7. Danh sách Screens

| Screen | Route | Loại |
|---|---|---|
| LoginScreen | `/auth/login` | Auth |
| HomeScreen | `/(tabs)/` | Tab |
| ClassroomScreen | `/(tabs)/classroom` | Tab |
| LessonPlanScreen | `/(tabs)/lesson-plan` | Tab |
| TeachingScheduleScreen | `/(tabs)/teaching-schedule` | Tab |
| AccountScreen | `/(tabs)/account` | Tab |
| LessonScreen | `/edu/lesson` | Stack |
| HomeworkScreen | `/edu/homework` | Stack |
| AssignmentGradingScreen | `/edu/assignment-grading` | Stack |
| AchievementScreen | `/edu/achievement` | Stack |
| TimetableScreen | `/edu/timetable` | Stack |
| AttendanceScreen | `/student/attendance` | Stack |