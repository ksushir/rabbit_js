//асинхронный подход
//пример работы с обменом сообщениями и очередями, где создается Exchange,
//очередь и привязка очереди к Exchange с определенным ключом маршрутизации. 
//после этого потребитель начинает прослушивать очередь и выводить полученные сообщения в консоль.



const amqp = require('amqplib');

async function consumeMessages() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchange = 'dev-test';
  const queue = 'test-queue';
  const routingKey = 'test-queue';

  // Создаем Exchange (если его еще нет)
  await channel.assertExchange(exchange, 'direct', { durable: false });

  // Создаем очередь (если ее еще нет)
  await channel.assertQueue(queue, { durable: false });

  // Привязываем очередь к Exchange с ключом маршрутизации
  await channel.bindQueue(queue, exchange, routingKey);

  console.log(`[*] Consumer 1: Subscribed to the queue '${queue}'`);

  // Прослушиваем очередь и выводим полученные сообщения
  channel.consume(queue, (msg) => {
    if (msg.content) {
      const message = msg.content.toString();
      console.log(`Consumer 1: Received message: ${message}`);
    }
  }, { noAck: true });
}

consumeMessages().catch(console.error);
