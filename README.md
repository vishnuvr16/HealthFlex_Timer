# ⏱️ HealthFlex Timer App

A lightweight, offline-first timer management app built with **React Native + Expo**, designed for productivity and tracking time efficiently.

---

## 🚀 Setup Instructions

Follow the steps below to get the app running on your device:

### 1. Clone the Repository
```bash
git clone https://github.com/vishnuvr16/HealthFlex_Timer.git
cd HealthFlex_Timer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Expo Development Server
```bash
npx expo start
```

### 4. Run on Your Mobile Device
- Install the Expo Go app:
  - Android – Play Store
  - iOS – App Store
- Scan the QR code displayed in your terminal or browser using Expo Go.

✅ You're now ready to use the app on your phone!

## 📦 Tech Stack
- React Native (via Expo)
- TypeScript
- React Navigation
- AsyncStorage for local persistence
- Custom hooks for theme and timer logic

## 🎯 Features
- Start, pause, reset individual timers
- Run multiple timers simultaneously
- Switch between light and dark themes
- Filter and track completed timer history
- Export history as JSON (via native share)
- Fully offline — no backend required

## 🧠 Assumptions Made During Development
- The app should work offline without requiring a backend
- Local storage is sufficient for persisting timer data
- Core timer functionality (start, pause, reset) is most important
- Bulk actions save time for managing multiple timers
- History tracking provides value for analyzing completed timers
- Theme switching accommodates different user preferences
- Users need to manage multiple timers simultaneously

## 🧑‍💻 Author
Developed by Vishnu Vardhan Reddy
