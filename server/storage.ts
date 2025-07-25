import { type User, type InsertUser, type Website, type InsertWebsite } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getWebsite(id: string): Promise<Website | undefined>;
  createWebsite(website: Omit<Website, 'id' | 'createdAt'>): Promise<Website>;
  getUserWebsites(limit?: number): Promise<Website[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private websites: Map<string, Website>;

  constructor() {
    this.users = new Map();
    this.websites = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getWebsite(id: string): Promise<Website | undefined> {
    return this.websites.get(id);
  }

  async createWebsite(websiteData: Omit<Website, 'id' | 'createdAt'>): Promise<Website> {
    const id = randomUUID();
    const website: Website = { 
      ...websiteData, 
      id, 
      createdAt: new Date()
    };
    this.websites.set(id, website);
    return website;
  }

  async getUserWebsites(limit: number = 10): Promise<Website[]> {
    return Array.from(this.websites.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
