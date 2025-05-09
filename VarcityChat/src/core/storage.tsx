import { IUser } from "@/types/user";
import { MMKV } from "react-native-mmkv";
import { Storage } from "redux-persist";
import * as SecureStore from "expo-secure-store";

export const storage = new MMKV();

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  return value ? JSON.parse(value) || null : null;
}

export async function setItem<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export async function removeItem(key: string) {
  storage.delete(key);
}

export const reduxStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

// Handles secure store storages
class AuthStorage {
  private authDataKey = "authData";

  async storeAuthData(token: string, user: IUser, isAuthenticated: boolean) {
    await SecureStore.setItemAsync(
      this.authDataKey,
      JSON.stringify({ token, user, isAuthenticated })
    );
  }

  async getAuthData(): Promise<{
    token: string;
    user: IUser;
    isAuthenticated: boolean;
  } | null> {
    const authData = await SecureStore.getItemAsync(this.authDataKey);
    return authData && typeof authData === "string"
      ? JSON.parse(authData)
      : null;
  }

  removeAuthData() {
    SecureStore.deleteItemAsync(this.authDataKey);
  }
}

export const authStorage: AuthStorage = new AuthStorage();
