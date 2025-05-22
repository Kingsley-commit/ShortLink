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
    userId: string, // Add userId parameter
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

      // Pass userId to create method
      const created = await urlModel.create(longUrl, shortCode, userId);
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

  getUrlStats(shortCode: string, req: any, userId?: string) {
    const entry = urlModel.findByShortCode(shortCode);
    if (!entry) return null;

    // If userId is provided, check if user owns this URL
    if (userId && entry.userId !== userId) {
      return null; // User doesn't own this URL
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    return {
      longUrl: entry.longUrl,
      shortUrl: `${baseUrl}/${entry.shortCode}`,
      visits: entry.visits,
      createdAt: entry.createdAt,
      lastVisit: entry.visits > 0 ? new Date() : null,
    };
  }

  // Updated to get URLs for specific user only
  getAllUrls(req: any, userId: string) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return urlModel.findByUserId(userId).map(entry => ({
      longUrl: entry.longUrl,
      shortUrl: `${baseUrl}/${entry.shortCode}`,
      shortCode: entry.shortCode,
      visits: entry.visits,
      createdAt: entry.createdAt,
    }));
  }

  // Updated to search within user's URLs only
  searchUrls(query: string, userId: string) {
    if (query.length < 3) return [];
    return urlModel.search(query, userId);
  }

  // New method to check URL ownership
  checkUrlOwnership(shortCode: string, userId: string): boolean {
    return urlModel.isOwner(shortCode, userId);
  }
}

export default new UrlService();