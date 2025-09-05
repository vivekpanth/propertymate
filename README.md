# PropertyMate

A React Native real-estate video app built with Expo SDK 52 and Supabase. Features TikTok-style "Hero" reels and immersive property tours with section-wise video galleries.

## 🚀 Features

- **TikTok-style Feed**: Vertical video scrolling with auto-play and smooth transitions
- **Property Cards**: Modern UI components for property listings
- **Video Player**: High-performance video playback with expo-video
- **Authentication**: Email magic link sign-in with Supabase
- **Responsive Design**: Optimized for mobile-first property browsing

## 🛠 Tech Stack

- **Frontend**: React Native, Expo SDK 52, TypeScript
- **Backend**: Supabase (Database, Auth, RLS)
- **Navigation**: React Navigation v6
- **Video**: expo-video for optimal performance
- **UI**: Custom design system with haptic feedback
- **Testing**: Jest, React Native Testing Library

## 🏃‍♂️ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run ios     # iOS simulator
npm run android # Android emulator
npm run web     # Web browser

# Run checks
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm test           # Jest tests
```

## 📱 Current Status

**Phase 4 Complete**: TikTok-style video feed with:

- Full-screen video playback (covers screen except bottom tab)
- Smooth vertical scrolling with paging
- Auto-play based on visibility
- Overlay controls (like, comment, share, mute)
- Performance optimizations for 55-60 FPS scrolling

## 🗂 Project Structure

```
src/
├── components/
│   ├── ui/           # Button, Card, Chip, Sheet, etc.
│   └── video/        # VideoPlayer component
├── features/
│   ├── auth/         # Sign-in screens
│   ├── feed/         # TikTok-style video feed
│   ├── search/       # Property search
│   └── ...
├── services/
│   └── supabase.ts   # Database client
├── theme/            # Design tokens & ThemeProvider
└── utils/            # Haptics, helpers
```

## 🎯 Performance Targets

- **Cold start**: < 3s (mid-range Android)
- **Video first frame**: ≤ 1.2s P50
- **Feed scrolling**: 55-60 FPS
- **Memory usage**: < 250MB typical

## 📋 Development Phases

Work is organized by phases. Each phase ends with lint/type/tests passing and a PR.

- ✅ **Phase 0**: Foundation (Navigation, Theme, UI Kit)
- ✅ **Phase 1**: Visual System & PropertyCard
- ✅ **Phase 2**: Database Setup (Supabase)
- ✅ **Phase 3**: Authentication & RBAC
- ✅ **Phase 4**: Feed (Mock) - TikTok-style video feed
- 🔄 **Phase 5**: Areas Gallery (Mock)
- ⏳ **Phase 6**: Wire Feed/Areas to Supabase
- ⏳ **Phase 7**: Search & Saved (Real)
- ⏳ **Phase 8**: Agent Tools
- ⏳ **Phase 9**: Admin Review & Publish
- ⏳ **Phase 10**: Messaging & Push
- ⏳ **Phase 11**: Quality, Offline, Analytics
- ⏳ **Phase 12**: Deployment Prep

## 🔧 Environment Setup

Create `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📖 Documentation

- [Database Setup](docs/DB_SETUP.md)
- [Testing Guide](docs/TESTING.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/description`
2. Make changes with tests
3. Run checks: `npm run lint && npm run typecheck && npm test`
4. Create PR with screenshots and CI status

## 📄 License

Private project - All rights reserved
