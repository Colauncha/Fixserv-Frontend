const ORDER_API_BASE = "https://dev-order-api.fixserv.co"; // create/start/complete
const ORDER_SERVICE_BASE = "https://dev-order-service.fixserv.co"; // fetch order

const getToken = () => localStorage.getItem("fixserv_token");

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function normalizeOrderResponse(data) {
  // handle common shapes
  const payload = data?.data || data?.order || data;

  // try to normalize id
  const id = payload?.id || payload?._id || payload?.orderId;

  return id ? { ...payload, id } : payload;
}

/**
 * Create draft order (booking)
 * POST /api/orders/draft
 */
export async function createDraftOrder(payload) {
  const token = getToken();
  if (!token) throw new Error("Token not found. Please login again.");

  const res = await fetch(`${ORDER_API_BASE}/api/orders/draft`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      (Array.isArray(data?.errors) ? data.errors?.[0]?.message : null) ||
      "Failed to create booking (draft order)";
    throw new Error(msg);
  }

  return normalizeOrderResponse(data);
}

/**
 * Fetch a specific order
 * GET /api/orders/:orderId/getOrder
 */
export async function getOrderById(orderId) {
  if (!orderId) throw new Error("orderId is required");

  const token = getToken();
  if (!token) throw new Error("Token not found. Please login again.");

  // primary (recommended)
  let res = await fetch(`${ORDER_SERVICE_BASE}/api/orders/${orderId}/getOrder`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });

  // fallback (in case dev backend uses odd route)
  if (res.status === 404) {
    res = await fetch(`${ORDER_SERVICE_BASE}/api/orders/orderId/getOrder`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
  }

  const data = await safeJson(res);

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      (Array.isArray(data?.errors) ? data.errors?.[0]?.message : null) ||
      "Failed to fetch booking";
    throw new Error(msg);
  }

  return normalizeOrderResponse(data);
}