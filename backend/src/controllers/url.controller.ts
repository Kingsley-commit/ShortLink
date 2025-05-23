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
        res.status(401).json({ error: 'Sign In To Access The Url Shortner' });
        return;
      }

      if (customCode) {
        const existing = await urlService.getLongUrl(customCode);
        if (existing) {
          res.status(400).json({ error: 'Custom code is already taken' });
          return;
        }

        const { shortUrl } = await urlService.shortenUrl(req, longUrl, userId, customCode);
        res.json({ shortCode: customCode, shortUrl });
      } else {
        const { shortCode, shortUrl } = await urlService.shortenUrl(req, longUrl, userId);
        res.json({ shortCode, shortUrl });
      }
    } catch (error) {
      console.error('Error encoding URL:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async decodeUrl(req: Request, res: Response): Promise<void> {
    try {
      const { shortCode } = req.params;
      const longUrl = await urlService.getLongUrl(shortCode); // Added await

      if (!longUrl) {
        res.status(404).json({ error: 'URL not found' });
        return;
      }

      res.json({ longUrl });
    } catch (error) {
      console.error('Error decoding URL:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async redirect(req: Request, res: Response): Promise<void> {
    try {
      const { shortCode } = req.params;
      const longUrl = await urlService.getLongUrl(shortCode); // Added await

      if (!longUrl) {
        res.status(404).json({ error: 'URL not found' });
        return;
      }

      res.redirect(301, longUrl);
    } catch (error) {
      console.error('Error redirecting:', error);
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

      const stats = await urlService.getUrlStats(shortCode, req, userId); // Added await

      if (!stats) {
        res.status(404).json({ error: 'URL not found or access denied' });
        return;
      }

      res.json(stats);
    } catch (error) {
      console.error('Error getting stats:', error);
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
      const urls = await urlService.getAllUrls(req, userId); // Added await
      res.json(urls);
    } catch (error) {
      console.error('Error listing URLs:', error);
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
      const results = await urlService.searchUrls(query, userId); // Added await
      res.json(results);
    } catch (error) {
      console.error('Error searching URLs:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new UrlController();