import { Router } from 'express';
import urlController from '../controllers/url.controller';
import { authenticate, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

router.get('/', (req, res) => {
  res.redirect('https://get.shortlnk.live'); 
});


router.post('/encode', authenticate, (req: AuthenticatedRequest, res) => {
  urlController.encodeUrl(req, res);
});


router.get('/statistic/:shortCode', authenticate, (req: AuthenticatedRequest, res) => {
  urlController.getStats(req, res);
});

router.get('/list', authenticate, (req: AuthenticatedRequest, res) => {
  urlController.listUrls(req, res);
});

router.get('/search', authenticate, (req: AuthenticatedRequest, res) => {
  urlController.searchUrls(req, res);
});


router.get('/decode/:shortCode', (req, res) => {
  urlController.decodeUrl(req, res);
});

router.get('/:shortCode', (req, res) => {
  urlController.redirect(req, res);
});



// router.use((req, res) => {
//   res.redirect('https://get.shortlnk.live/404');
// });

export default router;
