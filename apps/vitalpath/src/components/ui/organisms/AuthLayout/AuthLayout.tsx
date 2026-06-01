import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/hooks/useTheme';

export interface AuthLayoutProps {
  heroContent: React.ReactNode;
  children?: React.ReactNode;
  noCard?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AuthLayout = ({
  heroContent,
  children,
  noCard = false,
  style,
}: AuthLayoutProps) => {
  const t = useTheme();

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: t.background }, style]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
        >
          {heroContent}
          {noCard ? (
            children
          ) : (
            <View
              testID="auth-layout-card"
              style={[
                s.card,
                {
                  backgroundColor: t.surface,
                  borderTopLeftRadius: t.radiusSheet,
                  borderTopRightRadius: t.radiusSheet,
                },
              ]}
            >
              {children}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 48,
  },
  card: {
    marginTop: -32,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
});
