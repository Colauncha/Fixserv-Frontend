export function getApiError(data, status, rawText = "") {
  return (
    data?.message ||
    data?.error ||
    data?.detail ||
    (Array.isArray(data?.errors) ? data.errors.join(", ") : null) ||
    rawText ||
    `Request failed (HTTP ${status})`
  );
}
