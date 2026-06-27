# Hana Teacher App — Coding Conventions

## 1. Cấu trúc Screen

Mỗi screen là một thư mục riêng trong `src/screens/`, cấu trúc chuẩn:

```
ScreenName/
├── index.tsx       # Component chính của screen
├── style.ts        # StyleSheet (hoặc styles.ts)
├── types.ts        # TypeScript types/interfaces của screen
├── constants.ts    # Hằng số, mock data tĩnh
├── mocks.tsx       # Mock data (chỉ dùng khi chưa có API)
├── data.ts         # Static data definitions
└── components/     # Sub-components chỉ dùng trong screen này
    └── ComponentName/
        ├── index.tsx
        └── style.ts
```

Route file (`src/app/`) chỉ re-export từ screen:
```typescript
// src/app/(tabs)/index.tsx
export { default } from '@screens/HomeScreen';
```

---

## 2. Đặt tên

### Files & Folders
| Loại | Convention | Ví dụ |
|---|---|---|
| Screen folder | PascalCase + "Screen" suffix | `HomeScreen/`, `AttendanceScreen/` |
| Screen component | PascalCase | `HomeScreen`, `LoginScreen` |
| Sub-component folder | PascalCase | `HeaderSection/`, `TodayScheduleCard/` |
| Style file | `style.ts` hoặc `styles.ts` | `style.ts` |
| Type file | `types.ts` | `types.ts` |
| Constant file | `constants.ts` | `constants.ts` |
| API module | PascalCase + "API" suffix | `AuthAPI.ts`, `UserAPI.ts` |
| Service hook file | kebab-case + `.service.ts` | `auth.service.ts` |
| Store file | camelCase + "Store" suffix | `authStore.ts`, `uiStore.ts` |
| Hooks | camelCase + `use` prefix | `useStates.ts` |
| Provider | PascalCase + "Provider" suffix | `SocketProvider.tsx` |

### Components
- Functional component: **PascalCase**
- Props interface: `ComponentNameProps`
- Export default cho screen chính, named export cho sub-components

---

## 3. Component Pattern

### Screen chính (Tab hoặc Stack)
```typescript
// Dùng observer nếu cần đọc MobX store
const HomeScreen = observer(() => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <HeaderSection />
        <TodayScheduleCard />
      </ScrollView>
    </View>
  );
});

export default HomeScreen;
```

### Sub-component
```typescript
interface HeaderSectionProps {
  title: string;
}

export default function HeaderSection({ title }: HeaderSectionProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
```

### UI Wrapper component
```typescript
// Wrap library component, extend props
export const Button = ({ style, ...props }: ButtonProps) => {
  return (
    <ButtonPaper
      mode="contained"
      textColor={colors.white}
      {...props}
      style={[styles.button, style]}
    />
  );
};
```

---

## 4. Styling

- Dùng `StyleSheet.create()` — luôn tách ra file riêng (`style.ts`)
- Không inline style trừ giá trị dynamic
- Tên style key: camelCase, mô tả layout/role (`container`, `header`, `title`, `cardWrapper`)

```typescript
// style.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
});
```

```typescript
// index.tsx
import { styles } from './style';
```

---

## 5. State Management

### MobX — Global/Persistent State

Dùng cho: auth token, user info, device code, industry, printer settings.

```typescript
// Đọc store
const { authStore, generalStore } = useStates();

// Component cần re-render khi store thay đổi
const MyComponent = observer(() => {
  const { authStore } = useStates();
  return <Text>{authStore.user?.name}</Text>;
});
```

### React Query — Server State

Dùng cho: fetch data từ API, mutations (login, logout, update).

```typescript
// Query
const { data, isLoading } = useQuery({
  queryKey: ['key'],
  queryFn: () => SomeAPI.getData(),
  staleTime: Infinity,
});

// Mutation trong service file
export const useLogin = () => {
  return useMutation({
    mutationFn: (params) => AuthApi.login({ params }),
    onSuccess: (res) => {
      updateUser(res?.data);
    },
    onError: (error) => { /* Toast */ },
  });
};
```

### React Hook Form — Form State

Dùng cho: login form, bất kỳ form input nào.

```typescript
const { control, handleSubmit, formState: { errors } } = useForm({
  defaultValues: { username: '', password: '' },
});

// Kết hợp với Controller
<Controller
  control={control}
  rules={{ required: 'Bắt buộc nhập' }}
  render={({ field: { onChange, onBlur, value } }) => (
    <TextInput value={value} onChangeText={onChange} onBlur={onBlur} />
  )}
  name="username"
/>
```

---

## 6. API & Services

### API Module (`services/api/`)

Mỗi domain một file, export object với các function async:

```typescript
// UserAPI.ts
const endpointPortal = process.env.EXPO_PUBLIC_API_PORTAL;

export const UserAPI = {
  getProfile: async () => api.get(`${endpointPortal}/user/get-profile`),
  updateProfile: async ({ params }) =>
    api.put(`${endpointPortal}/user/update-profile`, params),
};
```

### Service Hooks (`*.service.ts`)

Wrap API calls thành React Query hooks, xử lý side effects:

```typescript
// auth.service.ts
export const useLogin = (callback?: () => void) => {
  return useMutation({
    mutationFn: (params) => AuthApi.login({ params }),
    onSuccess: (res) => {
      updateUser(res?.data);
      setIndustry(res?.data?.user?.industry);
      queryClient.invalidateQueries({ queryKey: ['check_connect'] });
    },
    onError: (error) => { /* hiển thị toast */ },
  });
};
```

### HTTP Driver

Không gọi axios trực tiếp. Luôn dùng qua `drivers/index.ts`:
```typescript
import api from '@hana/teacher/services/drivers';

api.get(endpoint, params?, headers?)
api.post(endpoint, params?, headers?)
api.put(endpoint, params?, headers?)
```

---

## 7. MobX Store

Mỗi store là một class với `makeAutoObservable` và optional persistence:

```typescript
// authStore.ts
class AuthStore implements IAuthStore {
  token: string | null = null;
  user: UserType | null = null;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'AuthStore',
      properties: ['token', 'user'],
      storage: AsyncStorage,
    });
  }

  get authenticated() {
    return !!this.token;
  }

  updateToken(token: string) {
    this.token = token;
  }

  clear() {
    this.token = null;
    this.user = null;
    stopPersisting(this);
  }
}
```

Interface định nghĩa trong `_interface.ts`, class implement interface đó.

---

## 8. TypeScript

- Luôn bật `strict: true`
- Định nghĩa interface cho props, store, API response — đặt trong `types.ts` của screen hoặc `_interface.ts` của store
- Dùng `type` cho union/intersection types, `interface` cho object shapes
- Dùng `observer` chỉ khi component đọc MobX observable
- Experimental decorators enabled (cho MobX `makeAutoObservable`)

```typescript
// types.ts của screen
export interface MenuItemType {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  route?: string;
}
```

---

## 9. Form Components (shared)

`src/components/shared/Form/` cung cấp Form namespace với `useFormContext`:

```typescript
// Dùng trong form
<FormProvider {...methods}>
  <Form.Input name="username" label="Tên đăng nhập" />
  <Form.InputPassword name="password" label="Mật khẩu" />
  <Form.Switch name="rememberMe" label="Ghi nhớ" />
</FormProvider>
```

Mỗi Form.* component tự lấy `control` từ `useFormContext()`, hiển thị lỗi validation bên dưới field.

---

## 10. Navigation

- Dùng **Expo Router** file-based routing — không tạo navigator thủ công
- Route guard đặt trong `RootNavigator.tsx`, dùng `useSegments` + `useRouter`
- Không import router trong business logic — navigation chỉ trong component
- Tab screens: `src/app/(tabs)/`
- Stack screens: `src/app/edu/`, `src/app/student/`

```typescript
// RootNavigator.tsx — auth guard pattern
const RootNavigator = observer(() => {
  const { authStore } = useStates();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!authStore.isHydrated) return;
    const inAuth = segments[0] === 'auth';
    if (!authStore.authenticated && !inAuth) {
      router.replace('/auth/login');
    } else if (authStore.authenticated && inAuth) {
      router.replace('/');
    }
  }, [authStore.authenticated, authStore.isHydrated]);

  return authStore.authenticated ? (
    <SocketProvider>
      <Slot />
    </SocketProvider>
  ) : (
    <Slot />
  );
});
```

---

## 11. Assets

- SVG icons: `src/assets/icons/ic_*.svg` — import như React component
- PNG images: `src/assets/images/` — import qua `require()`
- Fonts: `src/assets/fonts/` — load qua `expo-font` trong `_layout.tsx`

```typescript
// SVG
import IconHome from '@assets/icons/ic_home.svg';
<IconHome width={24} height={24} />

// PNG
<Image source={require('@assets/images/logo.png')} />

// Monorepo assets
<Image source={require('@tera/assets/app/element_46.png')} />
```

---

## 12. Error Handling & UX

- Lỗi API: hiển thị qua `react-native-toast-message` trong `onError` của mutation
- Lỗi render: wrap bằng `MyErrorBoundary`
- Loading state: dùng `ScreenLoader` hoặc `Loading` component
- Async components: dùng `SuspenseWith` + `LazyWithPreload`

---

## 13. Quy tắc ESLint / Code Style

| Rule | Giá trị |
|---|---|
| Semicolons | Bắt buộc (`;`) |
| Quotes | Single quote (`'`) |
| Trailing comma | Always (kể cả multi-line) |
| JSX brackets | Không đặt `>` trên dòng riêng |
| Unused vars | Error — không để biến khai báo mà không dùng |
| React hooks rules | Error — phải tuân thủ Rules of Hooks |
| Indent | Theo Prettier (không config cứng) |

---

## 14. Barrel Exports

- `src/components/ui/index.tsx` — re-export tất cả UI components
- Mỗi component folder có `index.tsx` làm entry point
- Không export wildcard `*` — luôn named export hoặc default export rõ ràng

```typescript
// components/ui/index.tsx
export { Button } from './Button';
export { TextInput } from './TextInput';
export { Loading } from './Loading';
```