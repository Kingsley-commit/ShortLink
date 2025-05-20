interface UrlEntry {
  id: string;
  longUrl: string;
  shortCode: string;
  createdAt: Date;
  visits: number;
}

class UrlModel {
  private urls: Map<string, UrlEntry>;
  private codeToId: Map<string, string>;

  constructor() {
    this.urls = new Map();
    this.codeToId = new Map();
  }

  create(longUrl: string, shortCode: string): UrlEntry {
    const id = Date.now().toString();
    const newEntry: UrlEntry = {
      id,
      longUrl,
      shortCode,
      createdAt: new Date(),
      visits: 0,
    };
    this.urls.set(id, newEntry);
    this.codeToId.set(shortCode, id);
    return newEntry;
  }

  findByShortCode(shortCode: string): UrlEntry | undefined {
    const id = this.codeToId.get(shortCode);
    if (!id) return undefined;
    return this.urls.get(id);
  }

  incrementVisits(shortCode: string): void {
    const id = this.codeToId.get(shortCode);
    if (!id) return;
    const entry = this.urls.get(id);
    if (entry) {
      entry.visits++;
    }
  }

  findAll(): UrlEntry[] {
    return Array.from(this.urls.values());
  }

  search(query: string): UrlEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.findAll().filter(entry => 
      entry.longUrl.toLowerCase().includes(lowerQuery)
    );
  }
}

export default new UrlModel();