const BASE_URL = "https://api.kinoxii.redberryinternship.ge/api";

export async function api(path, { body, headers, ...options } = {}) {
  const token = localStorage.getItem("token");
  const isForm = body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(body && !isForm && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: !body ? undefined : isForm ? body : JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) window.dispatchEvent(new Event("auth-unauthorized"));
    const error = new Error(data?.message || "Something went wrong");
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}
