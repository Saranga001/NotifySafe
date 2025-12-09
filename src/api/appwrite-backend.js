import { Databases, Client, ID, Query, Permission, Role } from "appwrite";
import { account } from "./authService";
import { appwriteConfig } from "../config";
import { toast } from "react-hot-toast";

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const databases = new Databases(client);

const DB_ID = appwriteConfig.databaseId;
const templates_COL_ID = appwriteConfig.templatesCollectionId;
const logs_COL_ID = appwriteConfig.logsCollectionId;
const events_COL_ID = appwriteConfig.eventsCollectionId;
const accounts_COL_ID = appwriteConfig.accountsCollectionId;
const inbox_COL_ID = appwriteConfig.inboxCollectionId;
const FUNC_ID = import.meta.env.VITE_APPWRITE_FUNCTION_ID || null;

const TYPES = {
  TEMPLATE: "template",
  LOG: "log",
  INBOX: "inbox",
};

function now() {
  return new Date().toISOString();
}

function templateToMessageBuilder(template, data = {}) {
  // --- Helpers ---
  const randomOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const randomAmount = () => {
    const amount = Math.floor(Math.random() * (9999 - 100 + 1)) + 100; // 3-4 digits
    return `${amount}.00`;
  };

  const formatTime = (date = new Date()) => {
    const d = date;
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const day = d.getDate();
    const month = d.toLocaleString("default", { month: "short" });
    const year = d.getFullYear();
    return `${hours}:${minutes}, ${day} ${month} ${year}`;
  };

  const addMinutes = (minutes) => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + minutes);
    return d;
  };

  // --- Replacement Handler ---
  const handlers = {
    user: () => data.user.email.split("@")[0] || "User1",
    time: () => formatTime(addMinutes(2)), // +2 min buffer
    otp: () => data.otp || randomOTP(),
    amount: () => data.amount || randomAmount(),
    validity: () => data.validity || 3,
    email: () => data.user.email || "example@email.com",
    device: () => data.device || "Unknown Device",
    service: () => data.service || "the 'SERVICE'",
    location: () => data.location || "'Unknown Location'",
    date: () => data.date || formatTime(), // can be overridden
    offer_details: () => data.offer_details || "special offer",
    expiry: () => data.expiry || formatTime(addMinutes(60)),
    link: () => data.link || "https://example.com/unlock",
    account: () => data.user.acc_no.slice(-4) || "0000",
  };

  // --- Main Replace Logic ---
  return template.replace(/{{\s*([\w_]+)\s*}}/g, (_, key) => {
    if (handlers[key]) return handlers[key]();
    return data[key] || ""; // fallback if key exists in data
  });
}

function checkSuccess(threshold = 0.8) {
  // Example: 0.8 = 80% success rate
  const randomValue = Math.random(); // generates 0–1
  return randomValue <= threshold; // success if <= threshold
}

async function ensureDefaultTemplates() {
  try {
    const list = await databases.listDocuments({
      databaseId: DB_ID,
      collectionId: templates_COL_ID,
    });
    if (list.total > 0) return;

    const defaultTemplates = [
      {
        $id: "TEM001",
        name: "USER_LOGIN_SUCCESS",
        versions: [
          {
            v: 1,
            body: "Hello {{user}}, your login was successful at {{time}}.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM002",
        name: "USER_LOGIN_FAILURE",
        versions: [
          {
            v: 1,
            body: "A failed login attempt was detected on your account at {{time}}.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM003",
        name: "PASSWORD_RESET_REQUEST",
        versions: [
          {
            v: 1,
            body: "A password reset was requested for your account at {{time}}. If this wasn't you, please secure your account immediately.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM004",
        name: "PASSWORD_CHANGED",
        versions: [
          {
            v: 1,
            body: "Your password was successfully changed at {{time}}.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM005",
        name: "TRANSACTION_INITIATED",
        versions: [
          {
            v: 1,
            body: "A transaction of ₹{{amount}} was initiated at {{time}}. If unauthorized, contact support immediately.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM006",
        name: "TRANSACTION_COMPLETED",
        versions: [
          {
            v: 1,
            body: "Your transaction of ₹{{amount}} was successfully completed at {{time}}.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM007",
        name: "SUSPICIOUS_ACTIVITY_ALERT",
        versions: [
          {
            v: 1,
            body: "Suspicious activity was detected on your account at {{time}}. Please review immediately.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM008",
        name: "ACCOUNT_DETAILS_UPDATED",
        versions: [
          {
            v: 1,
            body: "Your account details were updated at {{time}}. If this was not you, please secure your account.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM009",
        name: "SERVICE_OUTAGE_NOTIFICATION",
        versions: [
          {
            v: 1,
            body: "We are experiencing a service outage affecting {{service}}. Our team is working to resolve it.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM010",
        name: "SERVICE_RESTORED",
        versions: [
          {
            v: 1,
            body: "Service {{service}} has been restored as of {{time}}. Thank you for your patience.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM011",
        name: "OTP_SENT",
        versions: [
          {
            v: 1,
            body: "Your OTP for verification is {{otp}}. It is valid for {{validity}} minutes.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM012",
        name: "OTP_VERIFICATION_SUCCESS",
        versions: [
          {
            v: 1,
            body: "Your OTP was successfully verified at {{time}}.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM013",
        name: "OTP_VERIFICATION_FAILED",
        versions: [
          {
            v: 1,
            body: "OTP verification failed at {{time}}. Please request a new OTP.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM014",
        name: "TRANSACTION_OTP_SENT",
        versions: [
          {
            v: 1,
            body: "Your OTP for authorizing a transaction of ₹{{amount}} is {{otp}}.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM015",
        name: "EMAIL_VERIFICATION_SENT",
        versions: [
          {
            v: 1,
            body: "An email verification link was sent to {{email}} at {{time}}.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM016",
        name: "EMAIL_VERIFIED",
        versions: [
          {
            v: 1,
            body: "Your email {{email}} has been successfully verified.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM017",
        name: "DEVICE_ADDED",
        versions: [
          {
            v: 1,
            body: "A new device {{device}} was added to your account at {{time}}.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM018",
        name: "DEVICE_REMOVED",
        versions: [
          {
            v: 1,
            body: "A device {{device}} was removed from your account at {{time}}.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM019",
        name: "UNUSUAL_LOCATION_LOGIN",
        versions: [
          {
            v: 1,
            body: "A login attempt was detected from an unusual location: {{location}} at {{time}}.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM020",
        name: "ACCOUNT_LOCKED",
        versions: [
          {
            v: 1,
            body: "Your account has been locked due to multiple failed attempts. Unlock at {{link}}.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM021",
        name: "ACCOUNT_UNLOCKED",
        versions: [
          {
            v: 1,
            body: "Your account was unlocked successfully at {{time}}.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM022",
        name: "SERVICE_MAINTENANCE_ALERT",
        versions: [
          {
            v: 1,
            body: "Scheduled maintenance for {{service}} will occur on {{date}}. Services may be temporarily unavailable.",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "TEM023",
        name: "PROMOTIONAL_OFFER",
        versions: [
          {
            v: 1,
            body: "Exclusive offer for you: {{offer_details}}. Valid until {{expiry}}.",
            createdAt: now(),
          },
        ],
      },
    ];

    for (const tpl of defaultTemplates) {
      await databases.createDocument({
        databaseId: DB_ID,
        collectionId: templates_COL_ID,
        documentId: tpl.$id,
        data: {
          name: tpl.name,
          versions: tpl.versions.map((obj) => JSON.stringify(obj)),
        },
        permissions: [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
        ],
      });
    }
  } catch (err) {
    console.warn("ensureDefaultTemplates error:", err.message || err);
  }
}

export const appwriteBackend = {
  async init() {
    await ensureDefaultTemplates();
  },

  async getTemplates() {
    const res = await databases.listDocuments({
      databaseId: DB_ID,
      collectionId: templates_COL_ID,
    });

    return (res.documents || []).map((d) => d);
  },

  async getTemplateByName(name) {
    const res = await databases.listDocuments({
      databaseId: DB_ID,
      collectionId: templates_COL_ID,
      queries: [Query.equal("name", name), Query.limit(1)],
    });

    return (res.documents || []).map((d) => d)[0];
  },

  async getEvents() {
    const res = await databases.listDocuments({
      databaseId: DB_ID,
      collectionId: events_COL_ID,
    });

    return (res.documents || []).map((d) => d);
  },

  async getDBAccounts() {
    const res = await databases.listDocuments({
      databaseId: DB_ID,
      collectionId: accounts_COL_ID,
    });

    return (res.documents || []).map((d) => d);
  },

  async getLogs(userId = null) {
    const queries = [Query.limit(200)];
    const res = await databases.listDocuments({
      databaseId: DB_ID,
      collectionId: logs_COL_ID,
      queries,
    });
    return (res.documents || []).sort((a, b) => b.$createdAt - a.$createdAt);
  },

  async getInbox(userId = null, type = null) {
    const queries = [Query.orderDesc("$createdAt"), Query.limit(100)];
    userId && queries.push(Query.equal("accounts", userId));
    userId && queries.push(Query.equal("is_delivered", true));

    type && queries.push(Query.equal("delivery_channel", type));

    const res = await databases.listDocuments({
      databaseId: DB_ID,
      collectionId: inbox_COL_ID,
      queries: [...queries],
    });
    return (res.documents || []).map((d) => d);
  },

  async saveTemplateEdit(templateId, newBody, editor) {
    try {
      const tpl = await databases.getDocument({
        databaseId: DB_ID,
        collectionId: templates_COL_ID,
        documentId: templateId,
      });
      if (!tpl) return null;
      const versions = tpl.versions || [];
      const latest = versions[versions.length - 1] || { v: 0 };
      const nextV = latest.v + 1;
      const newVersionObj = {
        v: nextV,
        body: newBody,
        createdAt: now(),
        editor,
      };
      versions.push(JSON.stringify(newVersionObj));
      const updated = await databases.updateDocument({
        databaseId: DB_ID,
        collectionId: templates_COL_ID,
        documentId: templateId,
        data: {
          ...tpl,
          versions,
        },
      });

      await databases.createDocument({
        databaseId: DB_ID,
        collectionId: logs_COL_ID,
        documentId: ID.unique(),
        data: {
          event_type: "TEMPLATE_EDIT",
          metadata: JSON.stringify({
            template: tpl.name,
            editor,
            version: nextV,
          }),
        },
      });

      return updated;
    } catch (err) {
      console.error("saveTemplateEdit error:", err.message || err);
      return null;
    }
  },

  async renderTemplate(templateName, vars) {
    try {
      const res = await databases.listDocuments({
        databaseId: DB_ID,
        collectionId: templates_COL_ID,
        queries: [Query.equal("name", templateName), Query.limit(1)],
      });
      if (!res.documents || res.documents.length === 0)
        return templateName + " (no template)";
      const template = res.documents[0];
      const body = template.versions[template.versions.length - 1].body;
      return body.replace(/{{\s*([\w.]+)\s*}}/g, (m, k) => vars[k] ?? "");
    } catch (err) {
      console.error("renderTemplate error:", err.message || err);
      return templateName + " (error)";
    }
  },

  async triggerEvent(event, template, { user, metadata = {}, actor } = {}) {
    const payload = {
      eventType: event.event_type,
      userId: user.$id,
      metadata,
      channels: event.intended_channel,
      actor,
    };
    try {
      const eventTemplate = JSON.parse(template.versions.at(-1)).body;

      const isPUSH = event.intended_channel.some((el) => el === "PUSH");
      const isEMAIL = event.intended_channel.some((el) => el === "EMAIL");
      const isSMS = event.intended_channel.some((el) => el === "SMS");

      const message = templateToMessageBuilder(eventTemplate, { user });

      if (isPUSH) {
        toast.success(message, { autoClose: false });
      }

      let isSuccess = false;
      let temp_DB_DATA = null;

      do {
        isSuccess = checkSuccess();

        if (!temp_DB_DATA) {
          if (isEMAIL) {
            temp_DB_DATA = {
              ...temp_DB_DATA,
              email: {},
            };
            temp_DB_DATA.email = await databases
              .createDocument({
                databaseId: DB_ID,
                collectionId: inbox_COL_ID,
                documentId: ID.unique(),
                data: {
                  event_type: event.event_type,
                  accounts: user.$id,
                  message,
                  delivery_channel: "EMAIL",
                  is_delivered: isSuccess,
                },
              })
              .then((res) => res);
          }

          if (isSMS) {
            temp_DB_DATA = {
              ...temp_DB_DATA,
              sms: {},
            };
            temp_DB_DATA.sms = await databases
              .createDocument({
                databaseId: DB_ID,
                collectionId: inbox_COL_ID,
                documentId: ID.unique(),
                data: {
                  event_type: event.event_type,
                  accounts: user.$id,
                  message,
                  delivery_channel: "SMS",
                  is_delivered: isSuccess,
                },
              })
              .then((res) => res);
          }
        } else {
          if (isEMAIL) {
            temp_DB_DATA.email = await databases
              .updateDocument({
                databaseId: DB_ID,
                collectionId: inbox_COL_ID,
                documentId: ID.unique(),
                data: {
                  retry_score: temp_DB_DATA.email.retry_score + 1,
                  is_delivered: isSuccess,
                },
              })
              .then((res) => res);
          }
          if (isSMS) {
            temp_DB_DATA.sms = await databases
              .updateDocument({
                databaseId: DB_ID,
                collectionId: inbox_COL_ID,
                documentId: ID.unique(),
                data: {
                  retry_score: temp_DB_DATA.sms.retry_score + 1,
                  is_delivered: isSuccess,
                },
              })
              .then((res) => res);
          }
        }
      } while (!isSuccess);

      await databases.createDocument({
        databaseId: DB_ID,
        collectionId: logs_COL_ID,
        documentId: ID.unique(),
        data: {
          event_type: event.event_type,
          accounts: user.$id,
          metadata: JSON.stringify({
            message,
            intended_channel: event.intended_channel,
            retry_score: {
              sms_retry: temp_DB_DATA?.sms?.retry_score,
              email_retry: temp_DB_DATA?.email?.retry_score,
            },
          }),
        },
      });

      return { success: true, channel: event.intended_channel };
    } catch (err) {
      console.error("triggerEvent error:", err);
      return { success: false, error: err?.message };
    }
  },

  async logEvent(entry) {
    try {
      await databases.createDocument({
        databaseId: DB_ID,
        collectionId: logs_COL_ID,
        documentId: ID.unique(),
        data: {
          ...entry,
        },
      });
    } catch (err) {
      console.warn("logEvent error:", err.message || err);
    }
  },
};
