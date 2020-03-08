import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryStatusController from './app/controllers/DeliveryStatusController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import authMiddleware from './app/middlewares/auth';
import checkAdminMiddleware from './app/middlewares/checkAdmin'

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Rotas para entregadores.
routes.get('/deliveryman/:id/deliveries', DeliveryStatusController.index);
routes.put('/deliveryman/:id/deliveries', DeliveryStatusController.update);

routes.post('/delivery/:id/problems', DeliveryProblemController.store);
// Fim das rotas para entregadores

routes.use(authMiddleware);

// Rotas para usuários supervisores(admin === 0).
routes.put('/users', UserController.update);

routes.get('/deliverymans', DeliverymanController.index);

routes.get('/delivery', DeliveryController.index);

routes.get('/delivery/problems', DeliveryProblemController.index);
routes.get('/delivery/:id/problems', DeliveryProblemController.index);
// Fim das rotas para usuários supervisores.

routes.use(checkAdminMiddleware);

// Rotas para usuários admnistradores.
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.post('/delivery', DeliveryController.store);
routes.put('/delivery/:id', DeliveryController.update);
routes.delete('/delivery/:id', DeliveryController.delete);

routes.delete('/problem/:id/cancel-delivery', DeliveryStatusController.delete);

// Fim das rotas para usuários admnistradores.
export default routes;
