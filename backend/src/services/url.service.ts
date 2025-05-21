import urlModel from '../models/url.model';

class UrlService {
  private generateShortCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async shortenUrl(
    req: any,
    longUrl: string,
    customCode?: string
  ): Promise<{ shortCode: string; shortUrl: string }> {
    try {
      if (!longUrl || typeof longUrl !== 'string') {
        throw new Error('Invalid URL provided');
      }

      if (longUrl.length > 2048) {
        throw new Error('URL too long');
      }

      const shortCode = customCode || this.generateShortCode();
      const existing = await urlModel.findByShortCode(shortCode);
      if (existing) {
        throw new Error('Short code already in use');
      }

      const created = await urlModel.create(longUrl, shortCode);
      if (!created) {
        throw new Error('Failed to create URL entry');
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;

      return {
        shortCode,
        shortUrl: `${baseUrl}/${shortCode}`,
      };
    } catch (error) {
      console.error('Error shortening URL:', error);
      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to shorten URL');
      } else {
        throw new Error('Failed to shorten URL');
      }
    }
  }

  getLongUrl(shortCode: string): string | null {
    const entry = urlModel.findByShortCode(shortCode);
    if (!entry) return null;

    urlModel.incrementVisits(shortCode);
    return entry.longUrl;
  }

  getUrlStats(shortCode: string, req: any) {
    const entry = urlModel.findByShortCode(shortCode);
    if (!entry) return null;

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    return {
      longUrl: entry.longUrl,
      shortUrl: `${baseUrl}/${entry.shortCode}`,
      visits: entry.visits,
      createdAt: entry.createdAt,
      lastVisit: entry.visits > 0 ? new Date() : null,
    };
  }

  getAllUrls(req: any) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return urlModel.findAll().map(entry => ({
      longUrl: entry.longUrl,
      shortUrl: `${baseUrl}/${entry.shortCode}`,
      visits: entry.visits,
      createdAt: entry.createdAt,
    }));
  }

  searchUrls(query: string) {
    if (query.length < 3) return [];
    return urlModel.search(query);
  }
}

export default new UrlService();
