import { ID, Permission, Role, account, client, tablesDB, APPWRITE_CONFIG } from "./app";

const requireProfileConfig = () => {
  const missing = [];
  if (!APPWRITE_CONFIG.databaseId) missing.push("EXPO_PUBLIC_APPWRITE_DATABASE_ID");
  if (!APPWRITE_CONFIG.usersTableId) missing.push("EXPO_PUBLIC_APPWRITE_USERS_TABLE_ID");
  if (missing.length) throw new Error(`Missing Appwrite database configuration: ${missing.join(", ")}`);
};

const createUserProfile = (user) => tablesDB.createRow({
  databaseId: APPWRITE_CONFIG.databaseId,
  tableId: APPWRITE_CONFIG.usersTableId,
  rowId: user.$id,
  data: {
    username: user.name?.trim() || user.email.split("@")[0],
    email: user.email,
    avatar: "",
    accountId: user.$id,
  },
  permissions: [Permission.read(Role.any()), Permission.update(Role.user(user.$id)), Permission.delete(Role.user(user.$id))],
});

export const getUserProfile = async (userId) => {
  requireProfileConfig();
  return tablesDB.getRow({
    databaseId: APPWRITE_CONFIG.databaseId,
    tableId: APPWRITE_CONFIG.usersTableId,
    rowId: userId,
  });
};

const getOrCreateUserProfile = async (user) => {
  try {
    return await getUserProfile(user.$id);
  } catch (error) {
    if (error?.code !== 404 && error?.type !== "row_not_found") throw error;
    try {
      return await createUserProfile(user);
    } catch (createError) {
      // A concurrent sign-in may have created the row after our initial read.
      if (createError?.code === 409 || createError?.type === "row_already_exists") {
        return getUserProfile(user.$id);
      }
      throw createError;
    }
  }
};

export const createUserAccount = async ({ email, password, username }) => {
  requireProfileConfig();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();
  const user = await account.create({ userId: ID.unique(), email: normalizedEmail, password, name: normalizedUsername });
  await account.createEmailPasswordSession({ email: normalizedEmail, password });
  const profile = await getOrCreateUserProfile(user);
  return { ...user, profile };
};

export const createUser = createUserAccount;

export const signInUser = async ({ email, password }) => {
  // Appwrite rejects a second email/password session when this client still has
  // an active session. Clear the previous account before authenticating again.
  try {
    await account.deleteSession({ sessionId: "current" });
  } catch {
    // A missing or expired session is expected when signing in from a clean start.
  } finally {
    delete client.headers["X-Appwrite-Session"];
  }

  const normalizedEmail = email.trim().toLowerCase();
  await account.createEmailPasswordSession({ email: normalizedEmail, password });
  const user = await account.get();
  const profile = await getOrCreateUserProfile(user);
  return { ...user, profile };
};

export const signOutUser = async () => {
  try {
    await account.deleteSession({ sessionId: "current" });
  } finally {
    delete client.headers["X-Appwrite-Session"];
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    const profile = await getOrCreateUserProfile(user);
    return { ...user, profile };
  } catch {
    return null;
  }
};
