export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  templatesCollectionId: import.meta.env.VITE_APPWRITE_TEMPLATES_COLLECTION_ID,
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
};
