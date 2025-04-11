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
router.post('/users' ,authenticateJWT(['admin', 'manager']), user.create);
router.post('/login', user.login);
router.get('/users' ,authenticateJWT(['admin', 'manager']) , user.getAll);
router.get('/users/:id' ,authenticateJWT(['admin', 'manager']), user.getOne);
router.put('/users/:id' ,authenticateJWT(['admin', 'manager']), user.update);
router.delete('/users/:id' ,authenticateJWT(['admin', 'manager']), user.delete);

// Store routes
router.post('/stores', authenticateJWT(['admin', 'manager']) , store.create);
router.get('/stores', authenticateJWT(['admin', 'manager']), store.getAll);

router.get('/stores/except/:excludeUserId', authenticateJWT(['admin', 'manager']), store.getAllExcept);

router.get('/stores/:id',  authenticateJWT(['admin', 'manager']), store.getOne);
router.put('/stores/:id',authenticateJWT(['admin', 'manager']),  store.update);
router.delete('/stores/:id', authenticateJWT(['admin', 'manager']), store.delete);

// Products routes
router.post('/products', authenticateJWT(['admin', 'manager']) , product.create);
router.get('/products/all/:storeId', authenticateJWT(['admin', 'manager']), product.getAll);
router.get('/products/:id',  authenticateJWT(['admin', 'manager']), product.getOne);
router.put('/products/:id',authenticateJWT(['admin', 'manager']),  product.update);
router.delete('/products/:id', authenticateJWT(['admin', 'manager']), product.delete);

// items routes
router.post('/items', authenticateJWT(['admin', 'manager']) , item.create);

router.put('/items/qty',authenticateJWT(['admin', 'manager']),  item.updateQty);
router.put('/items/:id',authenticateJWT(['admin', 'manager']),  item.update);
router.get('/items/by_store/:id',authenticateJWT(['admin', 'manager']), item.getItemsByStoreId)
router.get('/items/all/:productId', authenticateJWT(['admin', 'manager']), item.getAll);
router.get('/items/:id',  authenticateJWT(['admin', 'manager']), item.getOne);
router.delete('/items/:id', authenticateJWT(['admin', 'manager']), item.delete);

// category routes
router.post('/category', authenticateJWT(['admin', 'manager']) , category.create);
router.get('/category', authenticateJWT(['admin', 'manager']), category.getAll);
router.get('/categorybyproducts/:ProductId', authenticateJWT(['admin', 'manager']), category.getCategoriesForProduct);
router.delete('/category/:id', authenticateJWT(['admin', 'manager']), category.delete);

// store log routes
router.post('/store_log', authenticateJWT(['admin', 'manager']) , log.create);
router.get('/store_log', authenticateJWT(['admin', 'manager']), log.getAll);
router.get('/store_log/:id', authenticateJWT(['admin', 'manager']), log.getOne);

// invoice routes
router.post('/invoice', authenticateJWT(['admin', 'manager']) , invoice.create);
router.get('/invoice', authenticateJWT(['admin', 'manager']), invoice.getAll);
router.put('/invoice/:id', authenticateJWT(['admin', 'manager']), invoice.update);

// dashboard routes
router.get('/dashboard/storeSummary', authenticateJWT(['admin', 'manager']), dashboard.storeSummary);
router.get('/dashboard/invoice-summary', authenticateJWT(['admin', 'manager']), dashboard.invoiceSummary);

router.post('/accounts', authenticateJWT(['admin']), account.create);
router.get('/accounts', authenticateJWT(['admin', 'manager']), account.getAll);
router.get('/accounts/active', authenticateJWT(['admin', 'manager']), account.active);
router.get('/accounts/:id', authenticateJWT(['admin', 'manager']), account.getOne);
router.put('/accounts/:id', authenticateJWT(['admin']), account.update);


router.post('/transactions', authenticateJWT(['admin', 'manager']), transaction.create);
router.get('/transactions', authenticateJWT(['admin', 'manager']), transaction.getAll);
router.get('/transactions/search', authenticateJWT(['admin', 'manager']), transaction.search); //GET /api/transactions/search?searchValue=TX123&startDate=2024-01-01&endDate=2024-12-31
router.get('/transactions/:id', authenticateJWT(['admin', 'manager']), transaction.getOne);


export default router;
