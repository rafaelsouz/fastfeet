import * as Yup from 'yup';
import { Op } from 'sequelize';
import { getHours, parseISO, startOfDay, endOfDay } from 'date-fns';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import DeliveryProblem from '../models/DeliveryProblem';
import Recipient from '../models/Recipient';
import User from '../models/User';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class DeliveryStatusController {
  async index(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not found' });
    }

    if (deliveryman.status === 0) {
      return res.status(401).json({
        error: 'This deliveryman is disabled, contact administration',
      });
    }

    const { page = 1, delivered } = req.query;

    if (delivered) {
      const deliveries = await Delivery.findAll({
        where: {
          deliveryman_id: id,
          canceled_at: null,
          end_date: {
            [Op.not]: null,
          },
          status: 1,
        },
        attributes: ['id', 'recipient_id', 'product', 'start_date', 'end_date'],
        limit: 10,
        offset: (page - 1) * 10,
      });

      return res.json(deliveries);
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: null,
        status: 1,
      },
      attributes: ['id', 'recipient_id', 'product', 'start_date', 'end_date'],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      signature_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not found' });
    }

    if (deliveryman.status === 0) {
      return res.status(401).json({
        error: 'This deliveryman is disabled, contact administration',
      });
    }

    const { deliveryId } = req.query;

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not found. ' });
    }

    const { start_date, end_date } = req.query;
    const { signature_id } = req.body;

    const parsedEndDate = parseISO(end_date);

    if (end_date) {
      if (!signature_id) {
        return res
          .status(400)
          .json({ error: 'Recipient signature photo required.' });
      }

      // Validando se a entrega já tem um horário de retirada cadastrado.
      if (!delivery.start_date) {
        return res.status(400).json({
          error: 'First you need to register the delivery pickup time',
        });
      }

      const deliveryCompleted = await delivery.update({
        signature_id,
        end_date: parsedEndDate,
      });

      return res.json(deliveryCompleted);
    }

    const parsedStartDate = parseISO(start_date);

    const startHour = getHours(parsedStartDate);

    // Verificando se o horario da retirada do entregador é entre 8-18h
    if (startHour && (startHour < 8 || startHour >= 18)) {
      return res.status(400).json({
        error: 'Delivery pickup are available only between 8am and 6pm.',
      });
    }

    // Buscando todas as entregas retiradas do dia pelo o entregador
    const deliveriesDay = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        start_date: {
          [Op.between]: [
            startOfDay(parsedStartDate),
            endOfDay(parsedStartDate),
          ],
        },
      },
    });

    // O limite de entregas por dia é de 5.
    if (deliveriesDay.length >= 5) {
      return res.status(400).json({
        error: 'Only 5 delivery pickup can be made per day.',
      });
    }

    const { product, recipient_id } = await delivery.update({
      start_date: parsedStartDate,
    });

    return res.json({
      deliveryId,
      recipient_id,
      deliveryman_id: id,
      product,
      start_date,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(req.userId);

    if (user.admin === 0) {
      return res.status(401).json({ error: 'You are not allowed to do this' });
    }

    const deliveryProblem = await DeliveryProblem.findByPk(id);

    if (!deliveryProblem) {
      return res
        .status(400)
        .json({ error: 'Delivery problem does not found.' });
    }

    const delivery = await Delivery.findByPk(deliveryProblem.delivery_id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    const { recipient, deliveryman } = delivery;

    if (!delivery.start_date) {
      return res
        .status(400)
        .json({ error: 'This delivery has not been picked up' });
    }

    if (delivery.canceled_at) {
      return res
        .status(400)
        .json({ error: 'This delivery has already been canceled' });
    }

    try {
      const { product } = await delivery.update({ canceled_at: new Date() });

      await Queue.add(CancellationMail.key, {
        recipient,
        product,
        deliveryman,
      });

      return res.json(delivery);
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Error during delivery cancellation' });
    }
  }
}

export default new DeliveryStatusController();
