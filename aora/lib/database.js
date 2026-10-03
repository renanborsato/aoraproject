import { ID, Permission, Query, Role, tablesDB, APPWRITE_CONFIG } from "./app";

export const getAllPosts = async () => {
  if (!APPWRITE_CONFIG.databaseId || !APPWRITE_CONFIG.videosTableId) {
    throw new Error("Missing Appwrite database or videos table configuration.");
  }

  const result = await tablesDB.listRows({
    databaseId: APPWRITE_CONFIG.databaseId,
    tableId: APPWRITE_CONFIG.videosTableId,
    queries: [Query.orderDesc("$createdAt"), Query.limit(25)],
  });
  return result.rows;
};

export const getLatestPosts = async () => {
  if (!APPWRITE_CONFIG.databaseId || !APPWRITE_CONFIG.videosTableId) {
    throw new Error("Missing Appwrite database or videos table configuration.");
  }

  const result = await tablesDB.listRows({
    databaseId: APPWRITE_CONFIG.databaseId,
    tableId: APPWRITE_CONFIG.videosTableId,
    queries: [Query.orderDesc("$createdAt"), Query.limit(7)],
  });
  return result.rows;
};

export const searchPosts = async (searchTerm) => {
  const query = searchTerm.trim();
  if (query.length < 3) return [];

  if (!APPWRITE_CONFIG.databaseId || !APPWRITE_CONFIG.videosTableId) {
    throw new Error("Missing Appwrite database or videos table configuration.");
  }

  const result = await tablesDB.listRows({
    databaseId: APPWRITE_CONFIG.databaseId,
    tableId: APPWRITE_CONFIG.videosTableId,
    queries: [Query.search("title", query), Query.orderDesc("$createdAt"), Query.limit(25)],
  });
  return result.rows;
};

export const getUserProfile = (userId) => tablesDB.getRow({
  databaseId: APPWRITE_CONFIG.databaseId,
  tableId: APPWRITE_CONFIG.usersTableId,
  rowId: userId,
});

export const createVideo = ({ title, thumbnail, video, prompt, creatorId }) => tablesDB.createRow({
  databaseId: APPWRITE_CONFIG.databaseId,
  tableId: APPWRITE_CONFIG.videosTableId,
  rowId: ID.unique(),
  data: {
    title: title.trim(),
    thumbnail,
    video,
    prompt: prompt.trim().slice(0, 5000),
    creator: creatorId,
  },
  permissions: [Permission.read(Role.any()), Permission.update(Role.user(creatorId)), Permission.delete(Role.user(creatorId))],
});
