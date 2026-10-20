import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  // identificador único nas lojas; não pode mudar depois da primeira publicação
  appId: 'com.oreapalavra.app',
  appName: 'Ore a Palavra',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      iconColor: '#2f6fa3',
    },
  },
}

export default config
