import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import User from '../models/User';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

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

    const checkIsRecipient = await Recipient.findOne({
      where: { recipient_id },
    });

    if (!checkIsRecipient) {
      return res.status(401).json({ error: 'Recipient not found' });
    }

    const checkIsDeliveryman = await Deliveryman.findOne({
      where: { deliveryman_id },
    });

    if (!checkIsDeliveryman) {
      return res.status(401).json({ error: 'Deliveryman not found' });
    }

    const delivery = await Delivery.create(req.body);

    return res.json(delivery);
  }

  async update(req, res) {
    return res.json({});
  }

  async delete(req, res) {
    return res.json({});
  }
}

export default new DeliveryController();
