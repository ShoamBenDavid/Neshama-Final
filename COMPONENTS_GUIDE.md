# CalmAI App - Components Guide

## 📱 Overview

I've recreated the CalmAI mental wellness app design based on the reference you provided. The app is now styled with a beautiful purple theme, Hebrew language support (RTL), and modern UI components.

## ✅ Completed Components

### 1. **StatCard** (`app/components/StatCard.tsx`)
- Displays statistics with icon, value, and label
- Used for the 4 statistics cards:
  - 🛡️ Anxiety disorders count
  - 📅 Weekly streak
  - 📊 Anxiety reduction percentage
  - ❤️ Average mood score

### 2. **ProgressBar** (`app/components/ProgressBar.tsx`)
- Shows progress with customizable color
- Displays label and value
- Optional icon support
- Used in the Weekly Summary section

### 3. **ActionCard** (`app/components/ActionCard.tsx`)
- Interactive cards with icon, title, subtitle
- "התחל >" (Start) button
- Custom background and icon colors
- Used for the 4 main action items:
  - 👥 Community Forum
  - 🧘 Calming Content
  - 💬 Support Chat
  - 📖 Emotional Journal

### 4. **SectionHeader** (`app/components/SectionHeader.tsx`)
- Consistent section titles with optional icons
- Used throughout the dashboard

### 5. **NavigationSidebar** (`app/components/NavigationSidebar.tsx`)
- Right-side navigation menu (for tablets/web)
- Active state highlighting
- 6 navigation items with icons

### 6. **AppLayout** (`app/components/AppLayout.tsx`)
- Wraps the app with optional sidebar
- Responsive: shows sidebar only on tablets/larger screens
- Handles RTL layout

### 7. **DashboardScreen** (`app/screens/DashboardScreen.tsx`)
- Complete home screen matching the reference design
- Includes all sections:
  - Header with greeting and CalmAI logo
  - Main title and MVP badge
  - Statistics cards (scrollable)
  - Weekly summary with progress bars
  - Action cards grid (2x2)
  - Mood chart placeholder

## 🎨 Design System

### Colors (`app/config/colors.js`)
Updated to match CalmAI brand:

- **Primary**: `#8B5CF6` (Purple)
- **Accent Colors**: Blue, Orange, Green, Teal, Pink
- **Light variants** for card backgrounds
- **Gray scale** for text and backgrounds

### Typography
- Bold headers
- Hebrew text support (RTL)
- Consistent font sizes

## 🚀 How to Use

### Running the App

```bash
# Start the development server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web
```

### Project Structure

```
NESHEMA/
├── app/
│   ├── components/
│   │   ├── StatCard.tsx          ✅ NEW
│   │   ├── ProgressBar.tsx       ✅ NEW
│   │   ├── ActionCard.tsx        ✅ NEW
│   │   ├── SectionHeader.tsx     ✅ NEW
│   │   ├── NavigationSidebar.tsx ✅ NEW
│   │   ├── AppLayout.tsx         ✅ NEW
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Icon.tsx
│   │   ├── Screen.tsx
│   │   ├── Text.tsx
│   │   └── TextInput.tsx
│   ├── screens/
│   │   ├── DashboardScreen.tsx   ✅ NEW
│   │   └── WelcomeScreen.tsx
│   └── config/
│       └── colors.js              ✅ UPDATED
└── App.tsx                        ✅ UPDATED
```

## 📋 Next Steps

### Recommended Enhancements

1. **Add Chart Library**
   ```bash
   npm install react-native-chart-kit react-native-svg
   ```
   Replace the mood chart placeholder with actual charts

2. **Create Additional Screens**
   - Emotional Journal screen
   - Support Chat screen
   - Community Forum screen
   - Calming Content library
   - Profile/Settings screen

3. **Navigation**
   - Install React Navigation:
     ```bash
     npm install @react-navigation/native @react-navigation/stack
     npm install react-native-screens react-native-safe-area-context
     ```
   - Create stack/tab/drawer navigation
   - Connect NavigationSidebar to actual navigation

4. **RTL Support**
   - The app currently forces RTL in DashboardScreen
   - For production, configure it app-wide in `app.json`:
     ```json
     {
       "expo": {
         "extra": {
           "supportsRTL": true
         }
       }
     }
     ```

5. **State Management**
   - Add Redux/Zustand/Context for global state
   - Manage user data, mood tracking, statistics

6. **Authentication**
   - Implement login/register screens
   - Connect WelcomeScreen to auth flow

7. **Backend Integration**
   - Connect to API for real data
   - Implement mood tracking
   - Add chat functionality

8. **Animations**
   - Add smooth transitions
   - Animate progress bars
   - Card entrance animations

9. **Accessibility**
   - Add proper labels for screen readers
   - Test with Hebrew screen readers
   - Ensure color contrast meets WCAG standards

10. **Testing**
    - Add unit tests for components
    - Integration tests for screens
    - E2E testing

## 🎯 Features Implemented

✅ Modern, clean UI matching reference design
✅ Purple brand color scheme
✅ Hebrew language support (RTL)
✅ Responsive layout (mobile + tablet/web)
✅ Statistics dashboard
✅ Weekly summary with progress tracking
✅ Quick action cards
✅ Navigation sidebar
✅ Reusable component library
✅ TypeScript support
✅ No linter errors

## 💡 Tips

1. **Customizing Colors**: Edit `app/config/colors.js`
2. **Changing Text**: All Hebrew text is in `DashboardScreen.tsx`
3. **Adding Icons**: Use MaterialCommunityIcons from `@expo/vector-icons`
4. **Testing RTL**: Test on both iOS and Android for RTL layout
5. **Performance**: Use `React.memo()` for components if needed

## 🐛 Known Limitations

1. **Mood Chart**: Currently a placeholder - needs chart library
2. **Navigation**: Sidebar doesn't navigate yet (needs React Navigation)
3. **Data**: All data is hardcoded - needs backend integration
4. **Mobile Sidebar**: Sidebar only shows on tablet+ sizes
5. **Animations**: Static design, no animations yet

## 📚 Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Material Community Icons](https://materialdesignicons.com/)
- [React Navigation](https://reactnavigation.org/)
- [Chart Kit](https://github.com/indiespirit/react-native-chart-kit)

---

**Created by**: AI Assistant
**Date**: December 2024
**Version**: 1.0.0

