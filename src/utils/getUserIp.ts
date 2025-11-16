export async function getUserIp(): Promise<string> {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    if (!response.ok) {
      throw new Error("Failed to fetch IP");
    }
    const data = await response.json();
    return data.ip || "unknown";
  } catch (error) {
    console.error("Ошибка при получении IP-адреса:", error);
    return "unknown";
  }
}

export async function getCachedUserIp(): Promise<string> {
  const STORAGE_KEY = "user_ip_address";

  const cachedIp = sessionStorage.getItem(STORAGE_KEY);
  if (cachedIp) {
    return cachedIp;
  }

  const ip = await getUserIp();

  sessionStorage.setItem(STORAGE_KEY, ip);

  return ip;
}
