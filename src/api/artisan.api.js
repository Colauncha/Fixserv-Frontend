const USER_BASE_URL = "https://dev-user-api.fixserv.co/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("fixserv_token");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const safeJson = async (res) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
};

export const getArtisanById = async (artisanId) => {
  const res = await fetch(`${USER_BASE_URL}/admin/user/${artisanId}`, {
    headers: getAuthHeaders(),
  });

  const json = await safeJson(res);

  if (!res.ok) {
    throw new Error(json?.message || "Failed to fetch artisan");
  }

  return json?.data || json?.user || json;
};

export const getAllArtisans = async () => {
  const res = await fetch(`${USER_BASE_URL}/admin/getAll?role=ARTISAN`, {
    headers: getAuthHeaders(),
  });

  const json = await safeJson(res);

  if (!res.ok) {
    throw new Error(json?.message || "Failed to fetch artisans");
  }

  return json?.users || json?.data || [];
};

export const getArtisanServices = async (artisanId) => {
  const res = await fetch(`/api/service/artisan/${artisanId}`, {
    headers: getAuthHeaders(),
  });

  const json = await safeJson(res);

  if (!res.ok) {
    throw new Error(json?.message || `Failed to fetch artisan services (${res.status})`);
  }

  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.services)) return json.services;
  if (Array.isArray(json?.data?.services)) return json.data.services;

  return [];
};