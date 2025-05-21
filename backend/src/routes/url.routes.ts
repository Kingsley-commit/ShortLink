import { Router } from 'express';
import urlController from '../controllers/url.controller';

const router = Router();

// this are the api endpoints
router.post('/encode', (req, res) => urlController.encodeUrl(req, res));
router.get('/decode/:shortCode', (req, res) => urlController.decodeUrl(req, res));
router.get('/statistic/:shortCode', (req, res) => urlController.getStats(req, res));
router.get('/list', (req, res) => urlController.listUrls(req, res));
router.get('/search', (req, res) => urlController.searchUrls(req, res));

// the redirect endpoint
router.get('/:shortCode', (req, res) => urlController.redirect(req, res));
export default router;
