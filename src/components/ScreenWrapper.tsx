import React from 'react';
import { StyleSheet, View, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  backgroundColor?: string;
  edges?: Edge[];
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scrollable = false,
  padded = true,
  backgroundColor = Colors.screenBg,
  edges,
}) => {
  const ContentWrapper = scrollable ? ScrollView : View;

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor }]} 
      edges={edges}
    >
      <StatusBar barStyle="dark-content" />
      <ContentWrapper
        style={[
          styles.content,
          !scrollable && padded && styles.padded,
        ]}
        {...(scrollable ? {
          contentContainerStyle: [
            scrollable && styles.scrollContent,
            padded && styles.padded,
          ]
        } : {})}
      >
        {children}
      </ContentWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  padded: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
});
