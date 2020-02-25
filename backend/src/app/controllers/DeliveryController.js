import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import User from '../models/User';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

import DeliveryMail from '../jobs/DeliveryMail';
import Queue from '../../lib/Queue';

class DeliveryController {
  async index(req, res) {
    return res.json({});
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const user = await User.findByPk(req.userId);

    if (user.admin === 0) {
      return res.status(401).json({ error: 'You are not allowed to do this' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const recipient = await Recipient.findOne({
      where: { id: recipient_id },
    });

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient not found' });
    }

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not found' });
    }

    if (deliveryman.status === 0) {
      return res
        .status(401)
        .json({ error: 'This deliveryman is disabled, activate it first' });
    }

    try {
      const { id, product } = await Delivery.create(req.body);

      await Queue.add(DeliveryMail.key, {
        recipient,
        product,
        deliveryman,
      });

      return res.json({ id, recipient_id, deliveryman_id, product });
    } catch (error) {
      return res.status(500).json({ error: 'Error during create delivery' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      canceled_at: Yup.date(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      status: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const user = await User.findByPk(req.userId);

    if (user.admin === 0) {
      return res.status(401).json({ error: 'You are not allowed to do this' });
    }

    const delivery = await Delivery.findByPk(req.params.id);

    const { recipient_id, deliveryman_id } = req.body;

    if (recipient_id && recipient_id !== delivery.recipient_id) {
      const recipient = await Recipient.findOne({
        where: { id: recipient_id },
      });

      if (!recipient) {
        return res.status(401).json({ error: 'Recipient not found' });
      }
    }

    if (deliveryman_id && deliveryman_id !== delivery.deliveryman_id) {
      const deliveryman = await Deliveryman.findOne({
        where: { id: deliveryman_id },
      });

      if (!deliveryman) {
        return res.status(401).json({ error: 'Deliveryman not found' });
      }

      if (deliveryman.status === 0) {
        return res
          .status(401)
          .json({ error: 'This deliveryman is disabled, activate it first' });
      }
    }

    await delivery.update(req.body);

    const { product, canceled_at } = delivery;

    return res.json({
      recipient_id,
      deliveryman_id,
      product,
      canceled_at,
    });
  }

  async delete(req, res) {
    return res.json({});
  }
}

export default new DeliveryController();
