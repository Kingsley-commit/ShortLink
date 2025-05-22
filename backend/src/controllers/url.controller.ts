import { Request, Response } from 'express';
import urlService from '../services/url.service';


interface AuthenticatedRequest extends Request {
  userId?: string;
}

class UrlController {
  async encodeUrl(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { longUrl, customCode } = req.body;
      const userId = req.userId; 

      if (!longUrl) {
        res.status(400).json({ error: 'longUrl is required' });
        return;
      }

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (customCode) {
        const existing = await urlService.getLongUrl(customCode);
        if (existing) {
          res.status(400).json({ error: 'Url is already taken' });
          return;
        }

        const { shortUrl } = await urlService.shortenUrl(req, longUrl, userId, customCode);
        res.json({ shortCode: customCode, shortUrl });
      } else {
        const { shortCode, shortUrl } = await urlService.shortenUrl(req, longUrl, userId);
        res.json({ shortCode, shortUrl });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async decodeUrl(req: Request, res: Response): Promise<void> {
    try {
      const { shortCode } = req.params;
      const longUrl = urlService.getLongUrl(shortCode);

      if (!longUrl) {
        res.status(404).json({ error: 'URL not found' });
        return;
      }

      res.json({ longUrl });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async redirect(req: Request, res: Response): Promise<void> {
    try {
      const { shortCode } = req.params;
      const longUrl = urlService.getLongUrl(shortCode);

      if (!longUrl) {
        res.status(404).json({ error: 'URL not found' });
        return;
      }

      res.redirect(301, longUrl);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { shortCode } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      
      const stats = urlService.getUrlStats(shortCode, req, userId);

      if (!stats) {
        res.status(404).json({ error: 'URL not found or access denied' });
        return;
      }

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async listUrls(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Only get URLs created by the authenticated user
      const urls = urlService.getAllUrls(req, userId);
      res.json(urls);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchUrls(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { query } = req.query;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (typeof query !== 'string' || query.length < 3) {
        res.status(400).json({ error: 'Query must be at least 3 characters' });
        return;
      }

      // Only search within user's own URLs
      const results = urlService.searchUrls(query, userId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new UrlController();