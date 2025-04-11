import { Router } from 'express';
import user from '../controllers/user';
import store from '../controllers/store';
import authenticateJWT from '../middleware/auth';
import product from '../controllers/product';
import category from '../controllers/category';
import item from '../controllers/item';
import log from '../controllers/product_log';
import invoice from '../controllers/invoice';
import dashboard from '../controllers/dashboard';
import account from '../controllers/account';
import transaction from '../controllers/transaction';
const router = Router();

// User routes
router.post('/users', user.create);
router.post('/login', user.login);
router.get('/users', user.getAll);
router.get('/users/:id', user.getOne);
router.put('/users/:id', user.update);
router.delete('/users/:id', user.delete);

// Store routes
router.post('/stores', authenticateJWT(['admin']) , store.create);
router.get('/stores', authenticateJWT(['admin']), store.getAll);

router.get('/stores/except/:excludeUserId', authenticateJWT(['admin']), store.getAllExcept);

router.get('/stores/:id',  authenticateJWT(['admin']), store.getOne);
router.put('/stores/:id',authenticateJWT(['admin']),  store.update);
router.delete('/stores/:id', authenticateJWT(['admin']), store.delete);

// Products routes
router.post('/products', authenticateJWT(['admin']) , product.create);
router.get('/products/all/:storeId', authenticateJWT(['admin']), product.getAll);
router.get('/products/:id',  authenticateJWT(['admin']), product.getOne);
router.put('/products/:id',authenticateJWT(['admin']),  product.update);
router.delete('/products/:id', authenticateJWT(['admin']), product.delete);

// items routes
router.post('/items', authenticateJWT(['admin']) , item.create);

router.put('/items/qty',authenticateJWT(['admin']),  item.updateQty);
router.put('/items/:id',authenticateJWT(['admin']),  item.update);
router.get('/items/by_store/:id',authenticateJWT(['admin']), item.getItemsByStoreId)
router.get('/items/all/:productId', authenticateJWT(['admin']), item.getAll);
router.get('/items/:id',  authenticateJWT(['admin']), item.getOne);
router.delete('/items/:id', authenticateJWT(['admin']), item.delete);

// category routes
router.post('/category', authenticateJWT(['admin']) , category.create);
router.get('/category', authenticateJWT(['admin']), category.getAll);
router.get('/categorybyproducts/:ProductId', authenticateJWT(['admin']), category.getCategoriesForProduct);
router.delete('/category/:id', authenticateJWT(['admin']), category.delete);

// store log routes
router.post('/store_log', authenticateJWT(['admin']) , log.create);
router.get('/store_log', authenticateJWT(['admin']), log.getAll);
router.get('/store_log/:id', authenticateJWT(['admin']), log.getOne);

// invoice routes
router.post('/invoice', authenticateJWT(['admin']) , invoice.create);
router.get('/invoice', authenticateJWT(['admin']), invoice.getAll);
router.put('/invoice/:id', authenticateJWT(['admin']), invoice.update);

// dashboard routes
router.get('/dashboard/storeSummary', authenticateJWT(['admin']), dashboard.storeSummary);
router.get('/dashboard/invoice-summary', authenticateJWT(['admin']), dashboard.invoiceSummary);

router.post('/accounts', authenticateJWT(['admin']), account.create);
router.get('/accounts', authenticateJWT(['admin']), account.getAll);
router.get('/accounts/active', authenticateJWT(['admin']), account.active);
router.get('/accounts/:id', authenticateJWT(['admin']), account.getOne);
router.put('/accounts/:id', authenticateJWT(['admin']), account.update);


router.post('/transactions', authenticateJWT(['admin']), transaction.create);
router.get('/transactions', authenticateJWT(['admin']), transaction.getAll);
router.get('/transactions/search', authenticateJWT(['admin']), transaction.search); //GET /api/transactions/search?searchValue=TX123&startDate=2024-01-01&endDate=2024-12-31
router.get('/transactions/:id', authenticateJWT(['admin']), transaction.getOne);


export default router;
