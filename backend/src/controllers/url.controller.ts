import { Request, Response } from 'express';
import urlService from '../services/url.service';

class UrlController {
  async encodeUrl(req: Request, res: Response): Promise<void> {
    try {
      const { longUrl, customCode } = req.body;

      if (!longUrl) {
        res.status(400).json({ error: 'longUrl is required' });
        return;
      }

      if (customCode) {
        const existing = await urlService.getLongUrl(customCode);
        if (existing) {
          res.status(400).json({ error: 'Url is already taken' });
          return;
        }

        const { shortUrl } = await urlService.shortenUrl(req, longUrl, customCode);
        res.json({ shortCode: customCode, shortUrl });
      } else {
        const { shortCode, shortUrl } = await urlService.shortenUrl(req, longUrl);
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

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const { shortCode } = req.params;
     const stats = urlService.getUrlStats(shortCode, req)

      if (!stats) {
        res.status(404).json({ error: 'URL not found' });
        return;
      }

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async listUrls(req: Request, res: Response): Promise<void> {
    try {
      const urls = urlService.getAllUrls(req); // ✅ pass req to build dynamic base URL
      res.json(urls);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchUrls(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.query;
      if (typeof query !== 'string' || query.length < 3) {
        res.status(400).json({ error: 'Query must be at least 3 characters' });
        return;
      }

      const results = urlService.searchUrls(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new UrlController();
