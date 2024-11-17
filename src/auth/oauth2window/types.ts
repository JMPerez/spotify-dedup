export interface AuthWindowConfig {
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface AuthWindowState {
  window: Window | null;
  timers: NodeJS.Timeout[];
} 