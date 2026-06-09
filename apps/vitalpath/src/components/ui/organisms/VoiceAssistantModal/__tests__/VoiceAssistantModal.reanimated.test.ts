import * as fs from 'fs';
import * as path from 'path';

const componentPath = path.resolve(__dirname, '../VoiceAssistantModal.tsx');

describe('VoiceAssistantModal — Reanimated migration (PERF-B3-T01)', () => {
  let source: string;

  beforeAll(() => {
    source = fs.readFileSync(componentPath, 'utf-8');
  });

  it('does NOT import Animated from react-native', () => {
    const hasRNAnimated =
      /from\s+['"]react-native['"]\s*;/.test(source) &&
      /\bAnimated\b/.test(
        source.match(/import\s+.*from\s+['"]react-native['"]/)?.[0] ?? '',
      );
    expect(hasRNAnimated).toBe(false);
  });

  it('imports withRepeat from react-native-reanimated', () => {
    expect(source).toMatch(/withRepeat/);
    expect(source).toMatch(/from\s+['"]react-native-reanimated['"]/);
  });

  it('imports withSequence from react-native-reanimated', () => {
    expect(source).toMatch(/withSequence/);
  });

  it('does NOT use Animated.loop', () => {
    expect(source).not.toMatch(/Animated\.loop/);
  });

  it('does NOT use Animated.timing from react-native', () => {
    expect(source).not.toMatch(/new Animated\.Value/);
  });
});
