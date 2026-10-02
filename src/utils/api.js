const BASE_URL = "https://api.kinoxii.redberryinternship.ge/api";

export async function api(path, { body, ...options } = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.message || "Something went wrong");
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}
