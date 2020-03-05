import * as Yup from 'yup';

import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class DeliveryProblemController {
  async index(req, res) {
    const { id } = req.params;

    if (id) {
      const deliveryWithProblem = await DeliveryProblem.findAll({
        where: { delivery_id: id },
        attributes: ['id', 'description'],
      });

      if (deliveryWithProblem.length === 0) {
        return res.status(400).json({ error: 'This delivery has no problem.' });
      }

      return res.json(deliveryWithProblem);
    }

    const deliveriesWithProblem = await DeliveryProblem.findAll({
      attributes: ['id', 'description', 'delivery_id'],
    });

    if (deliveriesWithProblem.length === 0) {
      return res.status(400).json({ error: 'No delivery had any problem' });
    }

    return res.json(deliveriesWithProblem);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { id } = req.params;
    const { description } = req.body;

    const delivery = await Delivery.findOne({ where: { id } });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    // Verificando se a entrega foi retirada.
    if (!Delivery.start_date) {
      return res
        .status(404)
        .json({ error: 'This delivery has not been picked up' });
    }

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id: id,
      description,
    });

    return res.json({ id: deliveryProblem.id, delivery_id: id, description });
  }
}

export default new DeliveryProblemController();
