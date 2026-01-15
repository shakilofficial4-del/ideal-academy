
import { UserProfile, ChatMessage, AdminConfig, ClassCategory } from '../types';

const DB_KEYS = {
  USERS: 'ideal_db_users',
  CURRENT_USER: 'ideal_db_session',
  CONTENT: 'ideal_db_content',
  MESSAGES: 'ideal_db_messages',
  SETTINGS: 'ideal_db_settings'
};

const delay = (ms: number = 200) => new Promise(res => setTimeout(res, ms));

export const Database = {
  // --- USER SESSION ---
  async getUserSession(): Promise<UserProfile | null> {
    try {
      const data = localStorage.getItem(DB_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  async login(mobile: string, pass: string): Promise<UserProfile | null> {
    const users = await this.getAllUsers();
    const user = users.find(u => u.studentMobile === mobile && u.password === pass);
    if (user) {
      const cloned = JSON.parse(JSON.stringify(user));
      localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(cloned));
      return cloned;
    }
    return null;
  },

  async saveUserSession(user: UserProfile): Promise<void> {
    try {
      const cloned = JSON.parse(JSON.stringify(user));
      localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(cloned));
      
      const users = await this.getAllUsers();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx > -1) {
        users[idx] = cloned;
      } else {
        users.push(cloned);
      }
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
      await delay();
    } catch (e) {
      console.error("DB Error:", e);
    }
  },

  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const data = localStorage.getItem(DB_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
  },

  // --- CONTENT & SETTINGS ---
  async getContentClasses(): Promise<ClassCategory[]> {
    try {
      const data = localStorage.getItem(DB_KEYS.CONTENT);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  async saveSettings(settings: AdminConfig): Promise<void> {
    const cloned = JSON.parse(JSON.stringify(settings));
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(cloned));
    if (settings.classes) {
      localStorage.setItem(DB_KEYS.CONTENT, JSON.stringify(settings.classes));
    }
  },

  async getSettings(): Promise<AdminConfig | null> {
    try {
      const data = localStorage.getItem(DB_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  // --- MESSAGES ---
  async getMessages(): Promise<ChatMessage[]> {
    try {
      const data = localStorage.getItem(DB_KEYS.MESSAGES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  async sendMessage(msg: ChatMessage): Promise<void> {
    const msgs = await this.getMessages();
    msgs.push(JSON.parse(JSON.stringify(msg)));
    localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(msgs));
  },

  // --- INITIALIZATION ---
  async init(initialConfig: AdminConfig) {
    if (!localStorage.getItem(DB_KEYS.SETTINGS)) {
      await this.saveSettings(initialConfig);
    }
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.MESSAGES)) {
      localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify([]));
    }
  }
};
