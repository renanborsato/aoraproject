import { InputFile } from "react-native-appwrite";
import { ID, Permission, Role, storage, APPWRITE_CONFIG, getFileViewUrl } from "./app";

export const uploadFile = async ({ uri, name, userId }) => {
  if (!APPWRITE_CONFIG.bucketId) throw new Error("Missing EXPO_PUBLIC_APPWRITE_BUCKET_ID.");
  if (!uri) throw new Error("A local file URI is required.");
  const file = await storage.createFile({
    bucketId: APPWRITE_CONFIG.bucketId,
    fileId: ID.unique(),
    file: InputFile.fromPath(uri, name || uri.split("/").pop()),
    permissions: [Permission.read(Role.any()), ...(userId ? [Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))] : [])],
  });
  return { ...file, url: getFileViewUrl(file.$id) };
};
export const uploadThumbnail = uploadFile;
export const uploadVideo = uploadFile;
