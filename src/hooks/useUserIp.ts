import { useState, useEffect } from "react";

const STORAGE_KEY = "user_ip_address";

export function useUserIp(): string | null {
  const [ipAddress, setIpAddress] = useState<string | null>(() => {
    const cachedIp = sessionStorage.getItem(STORAGE_KEY);
    return cachedIp || null;
  });

  useEffect(() => {
    if (ipAddress) {
      return;
    }

    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        if (!response.ok) {
          throw new Error("Failed to fetch IP");
        }
        const data = await response.json();
        const ip = data.ip || "unknown";

        sessionStorage.setItem(STORAGE_KEY, ip);
        setIpAddress(ip);
      } catch (error) {
        console.error("Ошибка при получении IP-адреса:", error);

        const fallbackIp = "unknown";
        sessionStorage.setItem(STORAGE_KEY, fallbackIp);
        setIpAddress(fallbackIp);
      }
    };

    fetchIp();
  }, [ipAddress]);

  return ipAddress;
}
