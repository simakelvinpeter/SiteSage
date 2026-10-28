import type { Website } from "@shared/schema";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

type SavedWebsite = { owner: string; website: Website };

export class FileStorage {
  private records: SavedWebsite[] = [];

  constructor(private file = process.env.DATA_FILE || "instance/websites.json") {
    this.file = resolve(file);
    if (existsSync(this.file)) {
      const saved = JSON.parse(readFileSync(this.file, "utf8"));
      if (!Array.isArray(saved)) throw new Error("Invalid website storage file");
      this.records = saved.map((record) => ({
        ...record,
        website: { ...record.website, createdAt: new Date(record.website.createdAt) },
      }));
    }
  }

  async getWebsite(id: string, owner: string): Promise<Website | undefined> {
    return this.records.find((record) => record.owner === owner && record.website.id === id)?.website;
  }

  async createWebsite(data: Omit<Website, "id" | "createdAt">, owner: string): Promise<Website> {
    const website = { ...data, id: randomUUID(), createdAt: new Date() };
    const next = [...this.records, { owner, website }];
    mkdirSync(dirname(this.file), { recursive: true });
    writeFileSync(`${this.file}.tmp`, JSON.stringify(next), { mode: 0o600 });
    renameSync(`${this.file}.tmp`, this.file);
    this.records = next;
    return website;
  }

  async getUserWebsites(limit = 10, owner: string): Promise<Website[]> {
    return this.records.filter((record) => record.owner === owner)
      .map((record) => record.website)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, Math.max(1, Math.min(limit, 50)));
  }
}

export const storage = new FileStorage();
