console.log("Service Worker started");

self.addEventListener("push", (e) => {
  console.log("Event fired");
  console.log(e);
  self.registration.showNotification("Reminder Notification", {
    body: "Notify",
  });
});
