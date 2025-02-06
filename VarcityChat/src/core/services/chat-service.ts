import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExtendedMessage } from "@/api/chats/types";

export class MessagePersistenceManager {
  static readonly STORAGE_PREFIX = "@messages:";
  static readonly LAST_SYNC_KEY = "@messages:lastSync";
  static readonly BATCH_SiZE = 50;

  static async saveMessages(chatId: string, messages: ExtendedMessage[]) {
    try {
      const chunks = this.chunkArray(messages, this.BATCH_SiZE);

      for (let i = 0; i < chunks.length; i++) {
        const key = `${this.STORAGE_PREFIX}${chatId}:${i}`;
        await AsyncStorage.setItem(key, JSON.stringify(chunks[i]));

        // Save chunk count
        await AsyncStorage.setItem(
          `${this.STORAGE_PREFIX}${chatId}:count`,
          `${chunks.length}`
        );
      }
    } catch (error) {
      console.error(`Error saving messages:`, error);
    }
  }

  static async loadMessages(chatId: string): Promise<ExtendedMessage[]> {
    try {
      const countStr = await AsyncStorage.getItem(
        `${this.STORAGE_PREFIX}${chatId}:count`
      );
      if (!countStr) return [];

      const count = parseInt(countStr, 10);
      const messages: ExtendedMessage[] = [];

      for (let i = 0; i < count; i++) {
        const key = `${this.STORAGE_PREFIX}${chatId}:${i}`;
        const chunk = await AsyncStorage.getItem(key);
        if (chunk) {
          messages.push(...JSON.parse(chunk));
        }
      }
      return messages;
    } catch (error) {
      console.error(`Error loading messages:`, error);
      return [];
    }
  }

  static async updateMessage(chatId: string, message: ExtendedMessage) {
    try {
      const messages = await this.loadMessages(chatId);
      const index = messages.findIndex((m) => m._id === message._id);
      if (index !== -1) {
        messages[index] = message;
        await this.saveMessages(chatId, messages);
      }
    } catch (error) {
      console.error(`Error updating message:`, error);
    }
  }

  private static chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
