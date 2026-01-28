import { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
  name: 'Mintegram Mobile',
  slug: 'mintegram-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  scheme: 'mintegram',
  platforms: ['ios', 'android'],
  experiments: {
    typedRoutes: true
  },
  plugins: ['expo-router'],
  extra: {
    apiBaseUrl: process.env.API_BASE_URL ?? 'https://example.com/api'
  }
};

export default config;
