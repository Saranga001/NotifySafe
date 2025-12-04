import { Databases, Functions, ID, Query, Permission, Role } from "appwrite";
import { client, account } from "../api/authService";
import { appwriteConfig } from "../config";

const databases = new Databases(client);
const functions = new Functions(client);

const DB_ID = appwriteConfig.databaseId;
const COL_ID = appwriteConfig.templatesCollectionId;
const FUNC_ID = import.meta.env.VITE_APPWRITE_FUNCTION_ID || null;

const TYPES = {
  TEMPLATE: "template",
  LOG: "log",
  INBOX: "inbox",
};

function now() {
  return new Date().toISOString();
}

export async function ensureDefaultTemplates() {
  try {
    const list = await databases.listDocuments({
      databaseId: DB_ID,
      collectionId: COL_ID,
      queries: [Query.equal("type", TYPES.TEMPLATE), Query.limit(1)],
    });
    if (list.total > 0) return;

    const defaultTemplates = [
      {
        $id: "t1",
        name: "LOGIN_SUCCESS",
        versions: [
          {
            v: 1,
            body: "Welcome {{user}} — login successful at {{time}}",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "t2",
        name: "ACCOUNT_DEBITED",
        versions: [
          {
            v: 1,
            body: "Account debited {{amount}} at {{time}}",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "t3",
        name: "PASSWORD_CHANGED",
        versions: [
          {
            v: 1,
            body: "Your password was changed at {{time}}",
            createdAt: now(),
          },
        ],
      },
      {
        $id: "t4",
        name: "OTP_SENT",
        versions: [
          {
            v: 1,
            body: "Your OTP is {{code}} (val$id for 10 minutes)",
            createdAt: now(),
          },
        ],
      },
    ];

    for (const tpl of defaultTemplates) {
      await databases.createDocument({
        databaseId: DB_ID,
        collectionId: COL_ID,
        documentId: tpl.$id,
        data: {
          ...tpl,
          versions: tpl.versions.map((obj) => JSON.stringify(obj)),
          type: TYPES.TEMPLATE,
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

export const firestoreBackend = {
  async init() {
    await ensureDefaultTemplates();
  },

  async getTemplates() {
    const res = await databases.listDocuments({
      databaseId: DB_ID,
      collectionId: COL_ID,
      queries: [Query.equal("type", TYPES.TEMPLATE)],
    });

    return (res.documents || []).map((d) => d);
  },

  async getLogs(userId = null) {
    const queries = [Query.equal("type", TYPES.LOG), Query.limit(200)];
    if (userId) {
      queries.unshift(Query.equal("userId", userId));
    }
    const res = await databases.listDocuments(DB_ID, COL_ID, queries);
    return (res.documents || []).sort(
      (a, b) => (b.timestamp || b.createdAt) - (a.timestamp || a.createdAt)
    );
  },

  async getInbox(userId) {
    const res = await databases.listDocuments({
      databaseId: DB_ID,
      collectionId: COL_ID,
      queries: [
        Query.equal("type", TYPES.INBOX),
        Query.equal("userId", userId),
        Query.orderDesc("createdAt"),
        Query.limit(100),
      ],
    });
    return (res.documents || []).map((d) => d);
  },

  async saveTemplateEdit(templateId, newBody, editor) {
    try {
      const tpl = await databases.getDocument(DB_ID, COL_ID, templateId);
      if (!tpl) return null;
      const versions = tpl.versions || [];
      const latest = versions[versions.length - 1] || { v: 0 };
      const nextV = latest.v + 1;
      versions.push({ v: nextV, body: newBody, createdAt: now(), editor });
      const updated = await databases.updateDocument(
        DB_ID,
        COL_ID,
        templateId,
        {
          ...tpl,
          versions,
        }
      );

      await databases.createDocument(DB_ID, COL_ID, ID.unique(), {
        type: TYPES.LOG,
        action: "TEMPLATE_EDIT",
        templateId,
        editor,
        timestamp: now(),
      });

      return updated;
    } catch (err) {
      console.error("saveTemplateEdit error:", err.message || err);
      return null;
    }
  },

  async renderTemplate(templateName, vars) {
    try {
      const res = await databases.listDocuments(DB_ID, COL_ID, [
        Query.equal("type", TYPES.TEMPLATE),
        Query.equal("name", templateName),
        Query.limit(1),
      ]);
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

  async triggerEvent(
    eventType,
    {
      userId = "guest",
      metadata = {},
      channels = ["email", "sms", "inapp"],
      actor,
    } = {}
  ) {
    const payload = { eventType, userId, metadata, channels, actor };
    try {
      if (FUNC_ID) {
        try {
          const exec = await functions.createExecution(
            FUNC_ID,
            JSON.stringify(payload)
          );
          return { success: true, data: exec };
        } catch (err) {
          console.warn("function execution failed:", err.message || err);
        }
      }

      // Fallback: store a log and return success:false (simulated)
      await databases.createDocument(DB_ID, COL_ID, ID.unique(), {
        type: TYPES.LOG,
        eventType,
        userId,
        metadata,
        channels,
        timestamp: now(),
      });

      return { success: true, channel: null };
    } catch (err) {
      console.error("triggerEvent error:", err.message || err);
      return { success: false, error: err.message };
    }
  },

  async logEvent(entry) {
    try {
      await databases.createDocument(DB_ID, COL_ID, ID.unique(), {
        ...entry,
        type: TYPES.LOG,
        timestamp: now(),
      });
    } catch (err) {
      console.warn("logEvent error:", err.message || err);
    }
  },
};
