import { ID, Permission, Role, account, tablesDB, APPWRITE_CONFIG } from "./app";

const requireProfileConfig = () => {
  const missing = [];
  if (!APPWRITE_CONFIG.databaseId) missing.push("EXPO_PUBLIC_APPWRITE_DATABASE_ID");
  if (!APPWRITE_CONFIG.usersTableId) missing.push("EXPO_PUBLIC_APPWRITE_USERS_TABLE_ID");
  if (missing.length) throw new Error(`Missing Appwrite database configuration: ${missing.join(", ")}`);
};

export const createUserAccount = async ({ email, password, username }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();
  const user = await account.create({ userId: ID.unique(), email: normalizedEmail, password, name: normalizedUsername });
  await account.createEmailPasswordSession({ email: normalizedEmail, password });
  requireProfileConfig();
  await tablesDB.createRow({
    databaseId: APPWRITE_CONFIG.databaseId,
    tableId: APPWRITE_CONFIG.usersTableId,
    rowId: user.$id,
    data: { username: normalizedUsername, email: normalizedEmail, avatar: "", accountId: user.$id },
    permissions: [Permission.read(Role.any()), Permission.update(Role.user(user.$id)), Permission.delete(Role.user(user.$id))],
  });
  return user;
};

export const signInUser = async ({ email, password }) => {
  try {
    await account.deleteSession({ sessionId: "current" });
  } catch {
    // No active session is the normal sign-in case.
  }
  await account.createEmailPasswordSession({ email: email.trim().toLowerCase(), password });
  return account.get();
};

export const signOutUser = () => account.deleteSession({ sessionId: "current" });
export const getCurrentUser = async () => {
  try { return await account.get(); } catch { return null; }
};
