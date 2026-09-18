import { ID, Permission, Role, tablesDB, APPWRITE_CONFIG } from "./app";

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
