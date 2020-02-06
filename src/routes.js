import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res)=>{
  res.json({ oi: 'oi'})
});

export default routes;