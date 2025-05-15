interface WorkboxEvent {
  isUpdate: boolean;
}

interface Workbox {
  addEventListener(event: string, callback: (event: WorkboxEvent) => void): void;
  register(): void;
  messageSkipWaiting(): void;
}

declare global {
  interface Window {
    workbox: Workbox;
  }
}
