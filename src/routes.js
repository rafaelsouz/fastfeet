import { Router } from 'express';

import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  return res.json({ oi: 'oi' });
});

export default routes;
