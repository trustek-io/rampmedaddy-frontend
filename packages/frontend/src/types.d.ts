declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void
        expand: () => void
        MainButton: {
          text: string
          show: () => void
          onClick: (callback: () => void) => void
          offClick: () => void
        }
        sendData: (data: string) => void
      }
    }
  }
}

export {}
