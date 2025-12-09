export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  templatesCollectionId: import.meta.env.VITE_APPWRITE_TEMPLATES_COLLECTION_ID,
  logsCollectionId: import.meta.env.VITE_APPWRITE_LOGS_COLLECTION_ID,
  eventsCollectionId: import.meta.env.VITE_APPWRITE_EVENTS_COLLECTION_ID,
  accountsCollectionId: import.meta.env.VITE_APPWRITE_ACCOUNTS_COLLECTION_ID,
  inboxCollectionId: import.meta.env.VITE_APPWRITE_INBOX_COLLECTION_ID,
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
};
