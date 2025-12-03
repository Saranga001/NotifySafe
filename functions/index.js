const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

// Simulated channel delivery (email, SMS, in-app)
async function sendChannel(channel, payload) {
  // Simulate realistic success/failure rates
  const rnd = Math.random();
  let success = true;
  if (channel === "email") success = rnd > 0.15;
  if (channel === "sms") success = rnd > 0.4;
  if (channel === "inapp") success = true;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ channel, success });
    }, 300 + Math.random() * 300);
  });
}

// Main notification delivery function
exports.deliverNotification = functions.https.onCall(async (data, context) => {
  const { eventType, userId, metadata, channels, actor } = data;
  const timestamp = new Date().toISOString();

  try {
    // Log the event
    await db.collection("activity_logs").add({
      type: "EVENT",
      eventType,
      userId,
      metadata,
      actor,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Render template
    const templatesSnap = await db
      .collection("notification_templates")
      .where("name", "==", eventType)
      .limit(1)
      .get();

    let message = eventType + " (template not found)";
    if (!templatesSnap.empty) {
      const template = templatesSnap.docs[0].data();
      const body = template.versions[template.versions.length - 1].body;
      message = body
        .replace(/{{user}}/g, userId)
        .replace(/{{time}}/g, timestamp)
        .replace(/{{amount}}/g, metadata.amount || "")
        .replace(/{{code}}/g, metadata.code || "");
    }

    // Try delivery channels with fallback
    const fallbackEvents = [];
    for (const ch of channels) {
      const res = await sendChannel(ch, { userId, message, metadata });

      await db.collection("activity_logs").add({
        type: "DELIVERY_ATTEMPT",
        channel: ch,
        success: res.success,
        userId,
        message: message.slice(0, 120),
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      if (res.success) {
        await db.collection("activity_logs").add({
          type: "DELIVERY_SUCCESS",
          channel: ch,
          userId,
          eventType,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { success: true, channel: ch, fallbackEvents };
      } else {
        fallbackEvents.push({ failed: ch, reason: "simulated-failure" });
      }
    }

    // All channels failed — save to in-app inbox
    const inboxRef = db
      .collection("user_inbox")
      .doc(userId)
      .collection("messages");

    const msgId = inboxRef.doc().id;
    await inboxRef.doc(msgId).set({
      id: msgId,
      message,
      metadata,
      eventType,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection("activity_logs").add({
      type: "DELIVERY_ALL_FAILED",
      userId,
      message: message.slice(0, 120),
      eventType,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: false, fallbackEvents, savedToInbox: true };
  } catch (error) {
    console.error("Notification delivery error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// MFA/OTP sender (simulated)
exports.sendMfaOtp = functions.https.onCall(async (data, context) => {
  const { userId, phone } = data;

  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // In production, integrate with Twilio or similar
    console.log(`[Simulated SMS to ${phone}] Your OTP is: ${code}`);

    // Store OTP in Firestore for verification
    await db
      .collection("mfa_codes")
      .doc(userId)
      .set({
        code,
        phone,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: new Date(Date.now() + 10 * 60000), // 10 minutes
      });

    return { success: true, message: `OTP sent to ${phone}` };
  } catch (error) {
    console.error("MFA OTP send error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// Verify MFA code
exports.verifyMfaOtp = functions.https.onCall(async (data, context) => {
  const { userId, code } = data;

  try {
    const mfaDoc = await db.collection("mfa_codes").doc(userId).get();

    if (!mfaDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "No OTP found for this user"
      );
    }

    const mfaData = mfaDoc.data();
    if (mfaData.code !== code) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid OTP code"
      );
    }

    if (new Date() > mfaData.expiresAt.toDate()) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "OTP has expired"
      );
    }

    // Clear the OTP
    await db.collection("mfa_codes").doc(userId).delete();

    return { success: true, message: "MFA verified successfully" };
  } catch (error) {
    console.error("MFA verification error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
