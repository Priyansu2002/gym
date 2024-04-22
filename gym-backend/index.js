// backend/index.js

const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const webpush = require("web-push");
const bodyParser = require("body-parser");

var admin = require("firebase-admin");

var serviceAccount = require("./gym-sample-e8859-firebase-adminsdk-1yky4-a1debffa46.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const subscriptions = [];

// Initialize web-push with VAPID keys
const vapidKeys = {
  publicKey:
    "BNr9OE-1zMBj_P5_gjaNsKUr9Bbg0NEdQG8k0_fiSMdGhgJzkgt9H7n2J2LigYoEh93fGKULKyPqFfbflys36NQ",
  privateKey: "OOwdkA-mTIs5muVT1ZKGdxt-nmMIDxCdOVmJkp7z2Ic",
};

webpush.setVapidDetails(
  "mailto:example@example.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

async function getUserTasksByTime(time, day) {
  try {
    const usersSnapshot = await db.collection("users").get();
    const usersData = [];
    console.log(day, time);
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const tasksSnapshot = await userDoc.ref
        .collection("tasks")
        .doc(day)
        .get();

      // console.log("tasksData", day, tasksSnapshot.data());
      if (tasksSnapshot.exists) {
        const tasksData = tasksSnapshot.data();
        // Check if the task time matches the specified time
        if (tasksData?.time === time) {
          usersData.push({
            userData: userData,
            tasksData: tasksData,
          });
        }
      }
    }

    return usersData;
  } catch (error) {
    console.error("Error getting user tasks by time:", error);
    throw error;
  }
}

async function updateUserTask(userId, day, time, subscription) {
  try {
    const userRef = db.collection("users").doc(userId);
    const tasksRef = userRef.collection("tasks").doc(day);

    // Update the task data
    await tasksRef.set(
      {
        time,
        subscription,
      },
      { merge: true }
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating user task:", error);
    throw error;
  }
}

// Endpoint to subscribe a user for notifications
app.post("/subscribe", async (req, res) => {
  const { subscription, time, userId, day } = req.body;
  subscriptions.push(subscription);
  const val = await updateUserTask(userId, day, time, subscription);
  res.status(201).json(val);
});

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
// Schedule notifications
cron.schedule("* * * * *", async () => {
  // This function will run every minute, you can adjust the schedule as needed
  const date = new Date();
  const currentTime = date.toLocaleTimeString("en-US", { hour12: false });
  console.log(date.getUTCDay());
  const day = daysOfWeek[date.getUTCDay()];

  // console.log(currentTime, day);
  const subscribers = await getUserTasksByTime(currentTime, day);
  console.log("subscriptions", subscriptions);

  // Send notifications to subscribers
  subscribers.forEach((subscriber) => {
    console.log(subscriber);
    if (!subscriber?.tasksData?.subscription) return;
    sendNotification(subscriber?.tasksData?.subscription);
  });
});

// Function to send a notification to a subscriber
function sendNotification(subscription) {
  webpush
    .sendNotification(subscription, "Your Push Payload Text")
    .then(() => console.log("Notification sent"))
    .catch((error) => console.error("Error sending notification:", error));
}

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
