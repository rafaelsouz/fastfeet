import Mail from '../../lib/Mail';

class DeliveryMail {
  get key() {
    return 'DeliveryMail';
  }

  async handle({ data }) {
    const { recipient, product, deliveryman } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: `O produto ${product} já está disponível para retirada.`,
      template: 'delivery',
      context: {
        deliveryman: deliveryman.name,
        product,
        recipient,
      },
    });
  }
}

export default new DeliveryMail();
