(() => {
  const googleReceiver = "https://docs.google.com/forms/d/e/1FAIpQLSf5eY91RJgXnplzBBtsvHL94oAUwrbsvlAPBLW8ZWYenIAxbA/formResponse";
  const notificationEndpoint = "https://learn.theblockcapital.ru/api/notifications/lead/";
  const path = window.location.pathname;
  const source = path.includes("/cs15-strategy-2026/start/") ? "strategy_start" : [
    ["/cs15-defi-2026/", "defi_2026"],
    ["/cs15-rwa/", "rwa"],
    ["/cs15-tokenized-stocks/", "rwa_global_assets"],
    ["/cs15-security/", "security"],
    ["/cs15-trading/", "trading"],
    ["/cs15-strategy-2026/", "strategy_2026"],
    ["/cs15-mining-2026/", "mining"],
  ].find(([prefix]) => path.startsWith(prefix))?.[1];
  if (!source) return;

  const nativeFetch = window.fetch.bind(window);
  const clean = (value) => typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, 1000) : "";
  const read = (body, key) => body instanceof URLSearchParams || body instanceof FormData ? clean(body.get(key)) : "";

  window.fetch = (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input?.url;
    const request = nativeFetch(input, init);
    if (url !== googleReceiver || init?.method !== "POST") return request;

    void request.then(() => {
      const body = init.body;
      const leadId = read(body, "entry.584325479");
      if (!leadId) return;
      void nativeFetch(notificationEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({
          eventType: "lead",
          leadId,
          source,
          fields: {
            phone: read(body, "entry.2026952326"),
            material: read(body, "entry.1524769482"),
            situation: read(body, "entry.641076309"),
            attribution: read(body, "entry.1010617250"),
          },
          honeypot: "",
        }),
        keepalive: true,
      }).catch(() => undefined);
    }).catch(() => undefined);
    return request;
  };
})();
