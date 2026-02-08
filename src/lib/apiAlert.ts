const API_NOT_CONFIGURED_MSG =
  "API key and secret are not configured. Please configure them in settings to place live orders.";

export function showApiNotConfiguredAlert(): void {
  if (typeof window !== "undefined") {
    alert(API_NOT_CONFIGURED_MSG);
  }
}

export function isApiConfigured(): boolean {
  return false; // Mock: always false for demo
}
