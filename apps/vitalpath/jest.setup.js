jest.mock('expo', () => ({
  registerRootComponent: jest.fn(),
  Constants: {},
}));

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn().mockReturnValue(true),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  Link: 'Link',
}));

jest.mock('react-native-reanimated', () => {
  const makeFadeIn = () => ({
    delay: () => ({
      springify: () => ({
        damping: () => ({}),
      }),
    }),
  });
  const AnimatedDefault = {
    View: require('react-native').View,
    Text: require('react-native').Text,
    Image: require('react-native').Image,
    ScrollView: require('react-native').ScrollView,
    FlatList: require('react-native').FlatList,
    createAnimatedComponent: component => component,
  };
  return {
    __esModule: true,
    default: AnimatedDefault,
    ...AnimatedDefault,
    useSharedValue: init => ({ value: init }),
    useAnimatedStyle: fn => fn(),
    withTiming: val => val,
    withSpring: val => val,
    withDelay: (_, val) => val,
    withSequence: (...vals) => vals[vals.length - 1],
    withRepeat: val => val,
    cancelAnimation: jest.fn(),
    runOnJS: fn => fn,
    runOnUI: fn => fn,
    interpolate: jest.fn(val => val),
    Extrapolate: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      bezier: jest.fn(),
      in: jest.fn(),
      out: jest.fn(),
      inOut: jest.fn(),
    },
    FadeIn: makeFadeIn(),
    FadeOut: {},
    FadeInDown: makeFadeIn(),
    FadeInUp: makeFadeIn(),
    SlideInDown: {},
    SlideOutDown: {},
    createAnimatedComponent: component => component,
    useReducedMotion: () => false,
  };
});

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest
      .fn()
      .mockImplementation(({ children }) => children(inset)),
    SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
    useSafeAreaInsets: jest.fn().mockReturnValue(inset),
  };
});

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: jest.fn().mockImplementation(({ children }) => children),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ granted: true }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ cancelled: true }),
  MediaTypeOptions: { All: 'All', Videos: 'Videos', Images: 'Images' },
}));

jest.mock('expo-audio', () => ({
  useAudioRecorder: jest.fn(() => ({
    startRecording: jest.fn(),
    stopRecording: jest.fn(),
  })),
  AudioModule: {
    requestRecordingPermissionsAsync: jest
      .fn()
      .mockResolvedValue({ granted: true }),
  },
  RecordingPresets: { HIGH_QUALITY: {} },
  setAudioModeAsync: jest.fn(),
}));

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  isSpeakingAsync: jest.fn().mockResolvedValue(false),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy' },
  NotificationFeedbackType: {
    Success: 'Success',
    Warning: 'Warning',
    Error: 'Error',
  },
}));

jest.mock('react-native-gesture-handler', () => {
  const {
    View,
    TouchableOpacity,
    ScrollView,
    FlatList,
  } = require('react-native');
  return {
    GestureHandlerRootView: View,
    GestureDetector: View,
    Gesture: {
      Pan: jest.fn(() => ({
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
      })),
    },
    Swipeable: View,
    DrawerLayout: View,
    ScrollView,
    FlatList,
    TouchableOpacity,
    PanGestureHandler: View,
    TapGestureHandler: View,
    State: {},
    Directions: {},
  };
});

jest.mock('expo-modules-core', () => ({
  EventEmitter: class EventEmitter {
    addListener() {
      return { remove: jest.fn() };
    }
    removeAllListeners() {}
    emit() {}
    listenerCount() {
      return 0;
    }
    addListener() {
      return { remove: jest.fn() };
    }
  },
  requireNativeModule: jest.fn(() => ({
    impactAsync: jest.fn(),
    notificationAsync: jest.fn(),
    selectionAsync: jest.fn(),
  })),
  requireOptionalNativeModule: jest.fn(() => ({
    impactAsync: jest.fn(),
    notificationAsync: jest.fn(),
    selectionAsync: jest.fn(),
  })),
  NativeModulesProxy: {},
  Platform: { OS: 'ios' },
  CodedError: class CodedError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
    }
  },
  UnavailabilityError: class UnavailabilityError extends Error {
    constructor(module, property) {
      super(`${module}.${property} is not available`);
    }
  },
}));
