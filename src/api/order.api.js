const ORDER_API_BASE = ""; // ✅ we will use relative routes with proxy
const getToken = () => localStorage.getItem("fixserv_token");

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function normalizeOrderResponse(data) {
  const payload = data?.data || data?.order || data;
  const id = payload?.id || payload?._id || payload?.orderId;
  return id ? { ...payload, id } : payload;
}

/**
 * Create draft order
 * POST /api/orders/draft
 */
export async function createDraftOrder(payload) {
  const token = getToken();
  if (!token) throw new Error("Token not found. Please login again.");

  const res = await fetch(`/api/orders/api/orders/draft`, {
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
 * Client order history
 * GET /api/orders/client-history
 */
export async function getClientHistory() {
  const token = getToken();
  if (!token) throw new Error("Token not found. Please login again.");

  const res = await fetch(`/api/orders/api/orders/client-history`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      (Array.isArray(data?.errors) ? data.errors?.[0]?.message : null) ||
      "Failed to fetch client history";
    throw new Error(msg);
  }

  // common shapes
  const orders = data?.data?.orders || data?.orders || data?.data || [];
  return Array.isArray(orders) ? orders : [];
}

/**
 * Fetch a specific order (ORDER SERVICE)
 * GET /api/orders/:orderId/getOrder
 */
export async function getOrderById(orderId) {
  if (!orderId) throw new Error("orderId is required");

  const token = getToken();
  if (!token) throw new Error("Token not found. Please login again.");

  const res = await fetch(`/api/order-service/api/orders/${orderId}/getOrder`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

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