# KoineFlash

KoineFlash is a specialized React Native mobile application built with Expo for mastering Koine Greek grammar. It provides students with interactive tools to drill noun declensions and verb conjugations through flashcards and multiple-choice quizzes.

## 🏛 Features

- **Grammar Drills**: Comprehensive coverage of 1st, 2nd, and 3rd declension nouns, and various verb tenses (Present, Imperfect, Aorist, Future).
- **Interactive Flashcards**: Smooth flip animations and gesture-based interactions (swipe to mark correct/incorrect).
- **Multiple-Choice Quizzes**: Test your knowledge with dynamically generated plausible distractors.
- **Progress Tracking**: Local persistence of your scores and per-card performance using `AsyncStorage`.
- **Scholarly Aesthetic**: A carefully designed UI featuring parchment tones and classical typography (Crimson Pro) to match the subject matter.
- **Cross-Platform**: Built to run seamlessly on both iOS and Android.

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 55)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Gestures**: [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- **Storage**: [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)
- **Typography**: [Expo Google Fonts](https://docs.expo.dev/guides/using-custom-fonts/) (Crimson Pro)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📂 Project Structure

```text
├── app/                  # Expo Router screens
│   ├── _layout.tsx       # Root layout & navigation configuration
│   ├── index.tsx         # Home screen (Category selection)
│   ├── flashcard.tsx     # Flashcard drill session
│   ├── quiz.tsx          # Multiple-choice quiz session
│   ├── results.tsx       # Session summary & performance review
│   └── settings.tsx      # App settings & progress reset
├── src/
│   ├── components/       # Reusable UI components (Cards, Buttons, Progress Bars)
│   ├── constants/        # Theme colors, typography, and layout constants
│   ├── data/             # Static grammar data and category definitions
│   ├── hooks/            # Custom hooks for progress and session management
│   ├── types/            # TypeScript interfaces and types
│   └── utils/            # Helper functions (shuffling, storage, quiz logic)
└── assets/               # Icons, splash screens, and static images
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Expo Go](https://expo.dev/go) app on your mobile device or an emulator (iOS Simulator / Android Emulator)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/koineflash.git
   cd koineflash
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Open the app:
   - Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS).
   - Press `i` for iOS simulator or `a` for Android emulator.

## 📖 Usage

1. **Select a Category**: Choose from various noun declensions or verb tenses on the home screen.
2. **Choose Mode**: Pick between **Flashcards** for study or **Quiz** for testing.
3. **Study/Test**:
   - In **Flashcards**, tap to flip and swipe right if you knew it, left if you didn't.
   - In **Quiz**, select the correct grammatical ending from the options provided.
4. **Review Results**: See your score, check missed cards, and retry them specifically to reinforce learning.

## 📜 License

This project is private and intended for educational purposes.
