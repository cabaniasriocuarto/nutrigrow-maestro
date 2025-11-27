import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.a91c6c84265d4d58bdc072a6ef45eb4b',
  appName: 'Dr Cannabis',
  webDir: 'dist',
  server: {
    url: 'https://a91c6c84-265d-4d58-bdc0-72a6ef45eb4b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF',
      sound: 'beep.wav'
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
