// src/PWABadge.jsx
import { useRegisterSW } from "virtual:pwa-register/react";

function registerPeriodicSync(period, swUrl, r) {
  if (period <= 0) return;

  setInterval(async () => {
    if ("onLine" in navigator && !navigator.onLine) return;

    const resp = await fetch(swUrl, {
      cache: "no-store",
      headers: {
        cache: "no-store",
        "cache-control": "no-cache",
      },
    });

    if (resp?.status === 200) {
      await r.update();
    }
  }, period);
}

function PWABadge() {
  const period = 60 * 60 * 1000; // cek update tiap 1 jam

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;
      if (!r) return;

      if (r.active?.state === "activated") {
        registerPeriodicSync(period, swUrl, r);
      } else if (r.installing) {
        r.installing.addEventListener("statechange", (e) => {
          const sw = e.target;
          if (sw.state === "activated") {
            registerPeriodicSync(period, swUrl, r);
          }
        });
      }
    },
  });

  function close() {
    setOfflineReady(false);
    setNeedRefresh(false);
  }

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-0 right-0 m-4 z-50" role="alert">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[320px]">
        <div className="mb-3">
          {offlineReady ? (
            <span className="text-sm text-gray-700">
              Aplikasi siap digunakan <b>offline</b>.
            </span>
          ) : (
            <span className="text-sm text-gray-700">
              Ada konten baru. Klik tombol <b>Reload</b> untuk memperbarui aplikasi.
            </span>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          {needRefresh && (
            <button
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md"
              onClick={() => updateServiceWorker(true)}
            >
              Reload
            </button>
          )}
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-md"
            onClick={close}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default PWABadge;
