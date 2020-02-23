import * as Yup from 'yup';

import Recipient from '../models/Recipient';
import User from '../models/User';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      zipcode: Yup.string()
        .length(8)
        .required(),
      number: Yup.string().required(),
      complement: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const user = await User.findByPk(req.userId);

    if (user.admin === 0) {
      return res.status(401).json({ error: 'You are not allowed to do this' });
    }

    const {
      id,
      name,
      street,
      number,
      neighborhood,
      complement,
      city,
      state,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      neighborhood,
      complement,
      city,
      state,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      number: Yup.string(),
      zipcode: Yup.string().length(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const user = await User.findByPk(req.userId);

    if (user.admin === 0) {
      return res.status(401).json({ error: 'You are not allowed to do this' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      city,
      state,
      zipcode,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      city,
      state,
      zipcode,
    });
  }
}

export default new RecipientController();
