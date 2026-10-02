import "react-native-url-polyfill/auto";
import { Account, Client, ID, Permission, Role, Storage, TablesDB } from "react-native-appwrite";

const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const platform = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM;

export const client = new Client().setEndpoint(endpoint);
if (projectId) client.setProject(projectId);
if (platform) client.setPlatform(platform);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);
export { ID, Permission, Role };

export const APPWRITE_CONFIG = {
  endpoint,
  projectId,
  platform,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  usersTableId: process.env.EXPO_PUBLIC_APPWRITE_USERS_TABLE_ID,
  videosTableId: process.env.EXPO_PUBLIC_APPWRITE_VIDEOS_TABLE_ID,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
};

export const getFileViewUrl = (fileId) =>
  `${endpoint}/storage/buckets/${APPWRITE_CONFIG.bucketId}/files/${fileId}/view?project=${projectId}`;
