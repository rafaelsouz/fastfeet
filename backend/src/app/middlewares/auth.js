import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';
import User from '../models/User';

export default async (req, res, next) => {
  const authHead = req.headers.authorization;

  if (!authHead) {
    return res.status(401).json({ error: 'Token not provider' });
  }

  const [, token] = authHead.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    const user = await User.findByPk(req.userId);

    if (user.status === 0) {
      return res.status(401).json({ error: 'This user is disabled' });
    }

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
