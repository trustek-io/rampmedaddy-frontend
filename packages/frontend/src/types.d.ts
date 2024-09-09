declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void
        expand: () => void
        initDataUnsafe: Record<string, any>
        MainButton: {
          text: string
          show: () => void
          onClick: (callback: () => void) => void
          offClick: () => void
        }
        showPopup: VoidFunction
        BackButton: {
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

export { }
