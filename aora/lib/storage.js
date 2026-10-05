import { File, Paths } from "expo-file-system";
import { ID, Permission, Role, client, APPWRITE_CONFIG, getFileViewUrl } from "./app";

export const prepareUploadAsset = async (asset) => {
  const source = new File(asset.uri);
  const extension = asset.name?.match(/\.[a-z0-9]+$/i)?.[0] || "";
  const cached = new File(Paths.cache, `selected-${ID.unique()}${extension}`);
  try {
    // Copy the granted content URI into this app's scoped cache, not the picker's cache.
    await source.copy(cached);
    if (!cached.exists || !Number.isFinite(cached.size) || cached.size <= 0) {
      throw new Error("The selected document could not be copied into the app. Try a file stored on your device.");
    }
    return { ...asset, uri: cached.uri, size: cached.size };
  } catch (error) {
    if (cached.exists) cached.delete();
    throw error;
  }
};

export const uploadFile = async ({ uri, name, mimeType, userId }) => {
  if (!APPWRITE_CONFIG.bucketId) throw new Error("Missing EXPO_PUBLIC_APPWRITE_BUCKET_ID.");
  if (!uri) throw new Error("A local file URI is required.");

  const localFile = new File(uri.replace(/^file:\/*/, "file:///"));
  const fileSize = localFile.size;
  if (!localFile.exists) {
    throw new Error("The selected file is no longer accessible. Reselect the video and thumbnail to create fresh app-local copies.");
  }
  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    throw new Error("Could not determine the selected file size. Please choose the file again.");
  }

  const fileName = name || uri.split("/").pop()?.split("?")[0] || "upload";
  const fileId = ID.unique();
  const permissions = [Permission.read(Role.any()), ...(userId ? [Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))] : [])];
  const endpoint = `${APPWRITE_CONFIG.endpoint}/storage/buckets/${APPWRITE_CONFIG.bucketId}/files`;
  // Avoid the SDK's legacy base64 reader; keep memory bounded to one 5 MiB chunk.
  const chunkSize = 5 * 1024 * 1024;
  const handle = localFile.open();
  let uploaded;
  try {
    for (let offset = 0; offset < fileSize;) {
      const bytes = handle.readBytes(Math.min(chunkSize, fileSize - offset));
      if (!bytes.length) throw new Error("The selected file could not be read completely. Please select it again.");
      const chunk = new File(Paths.cache, `upload-${fileId}-${offset}`);
      try {
        chunk.create();
        chunk.write(bytes);
        const headers = { "content-type": "multipart/form-data" };
        if (fileSize > chunkSize) {
          headers["content-range"] = `bytes ${offset}-${offset + bytes.length - 1}/${fileSize}`;
        }
        if (uploaded) headers["x-appwrite-id"] = uploaded.$id;
        // client.call preserves the authenticated Appwrite session and error handling.
        uploaded = await client.call("post", new URL(endpoint), headers, {
          fileId,
          permissions,
          file: { uri: chunk.uri, name: fileName, type: mimeType || localFile.type || "application/octet-stream" },
        });
      } finally {
        if (chunk.exists) chunk.delete();
      }
      offset += bytes.length;
    }
    return { ...uploaded, url: getFileViewUrl(uploaded.$id) };
  } finally {
    handle.close();
  }
};
export const uploadThumbnail = uploadFile;
export const uploadVideo = uploadFile;
