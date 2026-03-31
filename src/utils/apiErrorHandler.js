let isRedirecting = false;

export const APP_ERROR_EVENT = "fixserv:app-error";

const AUTH_KEYWORDS = [
  "token expired",
  "jwt expired",
  "invalid token",
  "unauthorized",
  "forbidden",
  "session expired",
  "authentication failed",
  "access denied",
];

const TECHNICAL_KEYWORDS = [
  "failed to fetch",
  "network error",
  "request failed with status code",
  "internal server error",
  "timeout",
  "socket hang up",
  "cors",
  "jwt",
  "token expired",
  "mongodb",
  "sql",
  "stack",
  "<html",
];

function getBackendMessage(error) {
  const data = error?.response?.data;

  if (!data) return "";

  if (typeof data === "string") return data;

  return (
    data.message ||
    data.error ||
    data.details ||
    data.title ||
    data.msg ||
    ""
  );
}

function looksTechnical(message = "") {
  const value = String(message).toLowerCase().trim();

  if (!value) return true;

  return TECHNICAL_KEYWORDS.some((word) => value.includes(word));
}

function isAuthError(status, message = "") {
  const value = String(message).toLowerCase();

  return status === 401 || status === 403 || AUTH_KEYWORDS.some((word) => value.includes(word));
}

export function emitGlobalError(message, type = "error") {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(APP_ERROR_EVENT, {
      detail: { message, type },
    })
  );
}

function clearAuthStorage() {
  localStorage.removeItem("fixserv_token");
  localStorage.removeItem("fixserv_user");
  localStorage.removeItem("fixserv_role");
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  if (isRedirecting) return;

  isRedirecting = true;
  clearAuthStorage();

  setTimeout(() => {
    window.location.href = "/log-in";
  }, 1200);
}

export function getUserFriendlyMessage(error) {
  const status = error?.response?.status;
  const backendMessage = getBackendMessage(error);

  if (!error?.response) {
    return "Unable to connect right now. Please check your internet connection and try again.";
  }

  if (isAuthError(status, backendMessage)) {
    return "Your session has expired. Please log in again.";
  }

  if (status === 400) {
    return looksTechnical(backendMessage)
      ? "The request could not be completed. Please check your input and try again."
      : backendMessage;
  }

  if (status === 404) {
    return "The requested resource was not found.";
  }

  if (status === 409) {
    return looksTechnical(backendMessage)
      ? "This record already exists or conflicts with an existing one."
      : backendMessage;
  }

  if (status === 422) {
    return looksTechnical(backendMessage)
      ? "Some of the information provided is invalid. Please review and try again."
      : backendMessage;
  }

  if (status === 429) {
    return "Too many requests right now. Please wait a little and try again.";
  }

  if (status >= 500) {
    return "Something went wrong on the server. Please try again shortly.";
  }

  if (!looksTechnical(backendMessage)) {
    return backendMessage;
  }

  return "Something went wrong. Please try again.";
}

export function normalizeApiError(error) {
  const status = error?.response?.status || 0;
  const backendMessage = getBackendMessage(error);
  const message = getUserFriendlyMessage(error);

  emitGlobalError(message, "error");

  if (isAuthError(status, backendMessage)) {
    redirectToLogin();
  }

  const normalizedError = new Error(message);
  normalizedError.status = status;
  normalizedError.backendMessage = backendMessage;
  normalizedError.originalError = error;

  return normalizedError;
}