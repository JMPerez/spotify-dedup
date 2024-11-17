import { TokenRefreshReason } from "../types";

export interface TokenRefreshEvent extends CustomEvent {
  detail: {
    accessToken: string;
    reason?: TokenRefreshReason;
  };
} 