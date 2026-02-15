module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|react-native-vector-icons|react-native-safe-area-context|react-native-webview|react-native-fs|react-native-html-to-pdf|@react-native-async-storage|react-native-document-picker|react-native-image-picker|react-native-permissions|react-native-floating-action|react-native-reanimated|react-native-reanimated-carousel|react-native-gesture-handler)/)',
  ],
  setupFiles: ['./jest.setup.js'],
};
