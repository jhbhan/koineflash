import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, CrimsonPro_400Regular, CrimsonPro_600SemiBold, CrimsonPro_700Bold } from '@expo-google-fonts/crimson-pro';
import * as SplashScreen from 'expo-splash-screen';
import { Colors } from '../src/constants/colors';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    CrimsonPro_400Regular,
    CrimsonPro_600SemiBold,
    CrimsonPro_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.screenBg,
            },
            headerTintColor: Colors.ink,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontFamily: 'CrimsonPro_700Bold',
            },
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: Colors.screenBg,
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'KoineFlash',
            }}
          />
          <Stack.Screen
            name="flashcard"
            options={{
              title: 'Flashcards',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="quiz"
            options={{
              title: 'Quiz',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="results"
            options={{
              title: 'Session Results',
              headerLeft: () => null, // Prevent going back to session
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="custom-set"
            options={{
              title: 'Custom Practice',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: 'Settings',
              headerBackTitle: 'Back',
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
