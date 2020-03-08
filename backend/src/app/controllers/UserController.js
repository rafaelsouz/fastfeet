import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: 'User already exist.' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
      admin: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { admin, status } = req.body;

    const user = await User.findByPk(req.userId);

    if (admin || req.params.id || status) {

      const userEdited = await User.findByPk(req.params.id);

      if (userEdited.status === 0 && !status) {
        return res
          .status(400)
          .json({ error: 'This user is inactive, active first' });
      }

      const { id, name, email } = await userEdited.update({
        admin,
        status,
      });

      return res.json({
        id,
        name,
        email,
        status,
        admin,
      });
    }

    const { email, oldPassword } = req.body;

    if (email && email !== user.email) {
      const userExist = await User.findOne({
        where: { email },
      });

      if (userExist) {
        return res.status(400).json({ error: 'User already exist.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.status === 0) {
      return res.status(400).json({ error: 'User is already inactive' });
    }

    const { name, email, status, admin } = await user.update({
      status: 0,
      admin: 0,
    });

    return res.json({ id, name, email, status, admin });
  }
}

export default new UserController();
