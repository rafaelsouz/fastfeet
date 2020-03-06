import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { deliveryman, product, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: `A entrega do(a) ${product} foi cancelado(a)! .`,
      template: 'cancellation',
      context: {
        deliveryman: deliveryman.name,
        product,
        recipient,
      },
    });
  }
}

export default new CancellationMail();
