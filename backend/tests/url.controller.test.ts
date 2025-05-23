// url.controller.test.ts
import request from 'supertest';
import express from 'express';
import urlController from '../src/controllers/url.controller';
import urlService from '../src/services/url.service';

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}


jest.mock('../src/services/url.service');


jest.mock('../src/middleware/authMiddleware', () => ({
  authenticate: jest.fn((req, res, next) => {
    req.userId = 'mock-user-id';
    next();
  })
}));

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.userId = 'mock-user-id';
  next();
});

app.post('/encode', urlController.encodeUrl);
app.get('/decode/:shortCode', urlController.decodeUrl);
app.get('/:shortCode', urlController.redirect);


describe('UrlController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('encodeUrl', () => {
    it('should return 400 if longUrl is missing', async () => {
      const response = await request(app)
        .post('/encode')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('longUrl is required');
    });

   it('should successfully encode a URL without custom code', async () => {
  const mockShorten = urlService.shortenUrl as jest.Mock;
  mockShorten.mockImplementation((req, longUrl, userId, customCode) => {
    return Promise.resolve({
      shortCode: 'abc123',
      shortUrl: 'http://localhost/abc123'
    });
  });

  const response = await request(app)
    .post('/encode')
    .send({ longUrl: 'https://example.com' });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    shortCode: 'abc123',
    shortUrl: 'http://localhost/abc123'
  });
  

  expect(mockShorten).toHaveBeenCalled();
  
  
  const callArgs = mockShorten.mock.calls[0];
  
  
  expect(callArgs[1]).toBe('https://example.com'); // longUrl
  expect(callArgs[2]).toBe('mock-user-id'); // userId
  expect(callArgs[3]).toBeUndefined(); // customCode
});

    it('should successfully encode a URL with custom code', async () => {
      const mockShorten = urlService.shortenUrl as jest.Mock;
      mockShorten.mockResolvedValue({
        shortUrl: 'http://localhost/mycustom'
      });

      const mockGetLongUrl = urlService.getLongUrl as jest.Mock;
      mockGetLongUrl.mockResolvedValue(null);

      const response = await request(app)
        .post('/encode')
        .send({ 
          longUrl: 'https://example.com',
          customCode: 'mycustom'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        shortCode: 'mycustom',
        shortUrl: 'http://localhost/mycustom'
      });
    });

    it('should return 400 if custom code is taken', async () => {
      const mockGetLongUrl = urlService.getLongUrl as jest.Mock;
      mockGetLongUrl.mockResolvedValue('https://existing.com');

      const response = await request(app)
        .post('/encode')
        .send({ 
          longUrl: 'https://example.com',
          customCode: '6FAEM0'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Custom code is already taken');
    });
  });
});






describe('decodeUrl', () => {
  it('should return 404 if URL not found', async () => {
    const mockGetLongUrl = urlService.getLongUrl as jest.Mock;
    mockGetLongUrl.mockResolvedValue(null);

    const response = await request(app)
      .get('/decode/notfound');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('URL not found');
  });

  it('should successfully decode a short URL', async () => {
    const mockGetLongUrl = urlService.getLongUrl as jest.Mock;
    mockGetLongUrl.mockResolvedValue('https://example.com');

    const response = await request(app)
      .get('/decode/abc123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      longUrl: 'https://example.com'
    });
  });
});