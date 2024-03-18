const registerPushNotification = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/service-worker.js"
      );
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey:
          "BNr9OE-1zMBj_P5_gjaNsKUr9Bbg0NEdQG8k0_fiSMdGhgJzkgt9H7n2J2LigYoEh93fGKULKyPqFfbflys36NQ",
      });
      return pushSubscription;
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

// …

export { registerPushNotification };
