const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const isFormData = typeof window !== "undefined" && options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    ...options.headers,
  };

  const config = {
    credentials: "include", // send secure httpOnly cookies to/from backend
    cache: "no-store",      // bypass Next.js fetch caching
    ...options,
    headers,
  };

  if (config.body && typeof config.body === "object" && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    let data = {};
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth";
      }
      let message = data.message || `API Error: ${response.status}`;
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        const details = data.errors.map(err => err.message || err.msg || JSON.stringify(err)).join(", ");
        message = `${message}: ${details}`;
      }
      throw new Error(message);
    }

    return data;
  } catch (error) {
    // Re-throw to let the caller handle/log the error appropriately without triggering Next.js dev overlay
    throw error;
  }
}