import * as Yup from 'yup';
import { unlink } from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';

import Deliveryman from '../models/Deliveryman';
import User from '../models/User';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliverymans = await Deliveryman.findAll({ where: { status: 1 } });

    return res.json(deliverymans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const userExist = await User.findOne({ where: { email: req.body.email } });
    const deliverymanExist = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (userExist || deliverymanExist) {
      return res.status(400).json({ error: 'This email is already in use' });
    }

    const { id, name, email } = await Deliveryman.create(req.body);

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
      status: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);
    const { email, status } = req.body;

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    if (!status && deliveryman.status === 0) {
      return res
        .status(401)
        .json({ error: 'This delivery is disabled, activate it first' });
    }

    if (email && email !== deliveryman.email) {
      const userExist = await User.findOne({ where: { email } });
      const deliverymanExist = await Deliveryman.findOne({
        where: { email },
      });

      if (userExist || deliverymanExist) {
        return res.status(400).json({ error: 'This email is already in use' });
      }
    }

    const { id, name } = await deliveryman.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    const { avatar_id } = deliveryman;

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    if (deliveryman.status === 0) {
      return res
        .status(401)
        .json({ error: 'This user is disabled, activate it first' });
    }

    // Como a foto do entregador não é um dado importante para o sistema, eu vou deletar ela no banco e no server.
    const avatar = await File.findOne({ where: { id: avatar_id } });

    if (avatar) {
      // Indo até a foto do usuario
      const avatarPath = resolve(
        __dirname,
        '..',
        '..',
        '..',
        'tmp',
        'uploads',
        avatar.path
      );

      // Deleta o arquivo no servidor
      const unlinkAsync = promisify(unlink);

      // Tirando o avatar relacionado a este entregador
      deliveryman.avatar_id = null;
      // Retorna quando tiver resolvido todas as promises
      await Promise.all([avatar.destroy(), unlinkAsync(avatarPath)]);
    }

    // Alterando o status deste entregador para 0-Excluido
    deliveryman.status = 0;

    await deliveryman.save();

    return res.status(200).json(deliveryman);
  }
}

export default new DeliverymanController();
