import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/src/hooks/useTheme';
import GradientHero from '../../atoms/GradientHero/GradientHero';
import type { GradientHeroSize } from '../../atoms/GradientHero/GradientHero.variants';

const BASE_PAD = 24;

export interface ScreenLayoutProps {
  showHero?: boolean;
  heroSize?: GradientHeroSize;
  heroContent?: React.ReactNode;
  edges?: Edge[];
  scrollable?: boolean;
  stickyHeader?: React.ReactNode;
  isSenior?: boolean;
  statusBarStyle?: 'light' | 'dark';
  contentStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ScreenLayout = ({
  showHero = false,
  heroSize = 'banner',
  heroContent,
  edges = ['top'],
  scrollable = true,
  stickyHeader,
  isSenior = false,
  statusBarStyle,
  contentStyle,
  children,
  style,
}: ScreenLayoutProps) => {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  const effectiveEdges: Edge[] = showHero
    ? edges.filter(e => e !== 'top')
    : edges;

  const mult = isSenior ? 1.4 : 1;
  const padH = Math.round(BASE_PAD * mult);
  const padT = Math.round(28 * mult);

  const cardStyle: ViewStyle = {
    backgroundColor: t.surface,
    borderTopLeftRadius: t.radiusSheet,
    borderTopRightRadius: t.radiusSheet,
    marginTop: showHero ? -32 : 0,
    paddingHorizontal: padH,
    paddingTop: padT,
    paddingBottom: 32,
  };

  const innerContent = (
    <>
      {showHero && (
        <>
          <GradientHero
            testID="gradient-hero"
            size={heroSize}
            style={{ paddingTop: insets.top }}
          >
            {heroContent}
          </GradientHero>
        </>
      )}
      <View
        testID="screen-layout-card"
        style={[cardStyle, { flex: 1 }, contentStyle]}
      >
        {children}
      </View>
    </>
  );

  return (
    <SafeAreaView
      edges={effectiveEdges}
      style={[s.root, { backgroundColor: t.background }, style]}
    >
      {stickyHeader}
      {scrollable ? (
        <ScrollView
          style={s.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
        >
          {innerContent}
        </ScrollView>
      ) : (
        <View style={s.flex}>{innerContent}</View>
      )}
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 48 },
});
