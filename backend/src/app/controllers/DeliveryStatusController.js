import * as Yup from 'yup';
import { Op } from 'sequelize';
import { getHours, parseISO, startOfDay, endOfDay } from 'date-fns';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

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

  async store(req, res) {
    return res.json({});
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
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

    const delivery = await Delivery.findOne(deliveryId);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not found. ' });
    }

    const { start_date, end_date } = req.query;

    const parsedDate = parseISO(start_date);

    const startHour = getHours(parsedDate);

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
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
    });

    // O limite de entregas por dia é de 5.
    if (deliveriesDay.length >= 5) {
      return res.status(400).json({
        error: 'Only 5 delivery pickup can be made per day.',
      });
    }

    if (end_date) {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: 'Recipient signature photo required.' });
      }
    }

    return res.json(deliveriesDay);
  }

  async delete(req, res) {
    return res.json({});
  }
}

export default new DeliveryStatusController();
