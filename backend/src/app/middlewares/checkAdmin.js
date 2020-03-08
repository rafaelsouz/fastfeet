import User from '../models/User';

export default async (req, res, next) => {
  const checkAdmin = await User.findByPk(req.userId);

  if (checkAdmin.admin === 0) {
    return res.status(401).json({ error: 'You are not allowed to do this' });
  }
  return next();
}
