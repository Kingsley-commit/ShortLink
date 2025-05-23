import { Url, IUrl } from '../models/url.model';
import { Types } from 'mongoose';

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
    userId: string,
    customCode?: string
  ): Promise<{ shortCode: string; shortUrl: string }> {
    try {
      if (!longUrl || typeof longUrl !== 'string') {
        throw new Error('Invalid URL provided');
      }

      if (longUrl.length > 2048) {
        throw new Error('URL too long');
      }

      let shortCode = customCode;
      
      if (!shortCode) {
       
        do {
          shortCode = this.generateShortCode();
        } while (await this.findByShortCode(shortCode));
      } else {
        
        const existing = await this.findByShortCode(shortCode);
        if (existing) {
          throw new Error('Short code already in use');
        }
      }

  
      const newUrl = new Url({
        longUrl,
        shortCode,
        userId: new Types.ObjectId(userId),
        visits: 0,
        createdAt: new Date()
      });

      const created = await newUrl.save();
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

  async getLongUrl(shortCode: string): Promise<string | null> {
    try {
      const entry = await this.findByShortCode(shortCode);
      if (!entry) return null;

     
      await this.incrementVisits(shortCode);
      return entry.longUrl;
    } catch (error) {
      console.error('Error getting long URL:', error);
      return null;
    }
  }

  async getUrlStats(shortCode: string, req: any, userId?: string) {
    try {
      const entry = await this.findByShortCode(shortCode);
      if (!entry) return null;

     
      if (userId && entry.userId.toString() !== userId) {
        return null;
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;

      return {
        longUrl: entry.longUrl,
        shortUrl: `${baseUrl}/${entry.shortCode}`,
        shortCode: entry.shortCode,
        visits: entry.visits,
        createdAt: entry.createdAt,
        lastVisit: entry.visits > 0 ? new Date() : null,
      };
    } catch (error) {
      console.error('Error getting URL stats:', error);
      return null;
    }
  }

  async getAllUrls(req: any, userId: string) {
    try {
      const urls = await Url.find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 }); 

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      return urls.map(entry => ({
        longUrl: entry.longUrl,
        shortUrl: `${baseUrl}/${entry.shortCode}`,
        shortCode: entry.shortCode,
        visits: entry.visits,
        createdAt: entry.createdAt,
      }));
    } catch (error) {
      console.error('Error getting all URLs:', error);
      return [];
    }
  }

  async searchUrls(query: string, userId: string) {
    try {
      if (query.length < 3) return [];
      
      const urls = await Url.find({
        userId: new Types.ObjectId(userId),
        longUrl: { $regex: query, $options: 'i' } 
      }).sort({ createdAt: -1 });

      return urls.map(entry => ({
        id: entry._id,
        longUrl: entry.longUrl,
        shortCode: entry.shortCode,
        visits: entry.visits,
        createdAt: entry.createdAt,
      }));
    } catch (error) {
      console.error('Error searching URLs:', error);
      return [];
    }
  }

  async checkUrlOwnership(shortCode: string, userId: string): Promise<boolean> {
    try {
      const entry = await Url.findOne({ 
        shortCode, 
        userId: new Types.ObjectId(userId) 
      });
      return !!entry;
    } catch (error) {
      console.error('Error checking URL ownership:', error);
      return false;
    }
  }

  // Helper methods
  private async findByShortCode(shortCode: string): Promise<IUrl | null> {
    try {
      return await Url.findOne({ shortCode });
    } catch (error) {
      console.error('Error finding by short code:', error);
      return null;
    }
  }

  private async incrementVisits(shortCode: string): Promise<void> {
    try {
      await Url.findOneAndUpdate(
        { shortCode },
        { $inc: { visits: 1 } }
      );
    } catch (error) {
      console.error('Error incrementing visits:', error);
    }
  }
}

export default new UrlService();