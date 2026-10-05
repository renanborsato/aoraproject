import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { account, client, APPWRITE_CONFIG } from "./app";

const sessionKey = `appwrite.${APPWRITE_CONFIG.projectId}.${new URL(APPWRITE_CONFIG.endpoint).hostname}`;

export const restoreSession = async () => {
  if (Platform.OS === "web") return;
  const cookie = await SecureStore.getItemAsync(sessionKey);
  if (cookie) client.headers["X-Fallback-Cookies"] = cookie;
};

export const clearSession = async () => {
  delete client.headers["X-Fallback-Cookies"];
  delete client.headers["X-Appwrite-Session"];
  delete client.headers.Cookie;
  if (Platform.OS !== "web") await SecureStore.deleteItemAsync(sessionKey);
};

export const createPasswordSession = async ({ email, password }) => {
  if (Platform.OS === "web") return account.createEmailPasswordSession({ email, password });
  // The native SDK discards this response header; capture it without logging credentials.
  const response = await fetch(`${APPWRITE_CONFIG.endpoint}/account/sessions/email`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...client.headers,
      "content-type": "application/json",
      Origin: `appwrite-${Platform.OS}://${APPWRITE_CONFIG.platform}`,
    },
    body: JSON.stringify({ email, password }),
  });
  const session = await response.json();
  if (!response.ok) {
    let message = session.message || "Unable to create a login session.";
    if (session.type === "general_unknown_origin" || /invalid origin/i.test(message)) {
      // Public configuration only: reveal which bundle/project the device actually uses.
      message += `\n\nEndpoint: ${APPWRITE_CONFIG.endpoint}\nProject: ${APPWRITE_CONFIG.projectId}\nOrigin: appwrite-${Platform.OS}://${APPWRITE_CONFIG.platform}`;
    }
    throw Object.assign(new Error(message), {
      code: response.status, type: session.type,
    });
  }
  let fallback = response.headers.get("X-Fallback-Cookies");
  if (!fallback) {
    const cookieName = `a_session_${APPWRITE_CONFIG.projectId}`;
    const cookie = response.headers.get("set-cookie")?.split(/,\s*(?=[^;,\s]+=)/)
      .map((part) => part.trim().split(";")[0])
      .find((part) => part.startsWith(`${cookieName}=`));
    const secret = cookie ? cookie.slice(cookieName.length + 1) : session.secret;
    if (secret) fallback = JSON.stringify({ [cookieName]: secret });
  }
  if (fallback) {
    client.headers["X-Fallback-Cookies"] = fallback;
    await SecureStore.setItemAsync(sessionKey, fallback);
  }
  return session;
};
