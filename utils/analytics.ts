export const logEvent = (eventName: string, data?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && (window as any).sa_event) {
    (window as any).sa_event(eventName, data);
  }
}; 