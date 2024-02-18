//Вариант 1
//отправка смс в очередь и вывод в консоль сообщения об успешной отправки

// const amqp = require('amqplib/callback_api');

// amqp.connect('amqp://localhost', function(error0, connection) {
//   if (error0) {
//     throw error0;
//   }
//   connection.createChannel(function(error1, channel) {
//     if (error1) {
//       throw error1;
//     }
//     let queue = 'sp-queue';
//     let msg = 'очередь идет';

//     channel.assertQueue(queue, {
//       durable: false
//     });

//     channel.sendToQueue(queue, Buffer.from(msg));
//     console.log(" [x] Sent %s", msg);

//     setTimeout(function() {
//       connection.close();
//       process.exit(0);
//     }, 500);
//   });
// });



//Вариант 2
// разовая отправка смс в очередь

// const amqp = require('amqplib');

// async function sendMessage() {
//   const connection = await amqp.connect('amqp://localhost');
//   const channel = await connection.createChannel();

//   const exchange = 'dev-test';
//   const routingKey = 'test-queue';
//   const message = 'Hello from JavaScript';

//   // Создаем Exchange (если его еще нет)

//   await channel.assertExchange(exchange, 'direct', { durable: false });

//   // Определение очереди и связывание с Exchange через Routing Key

//   await channel.assertQueue('test-queue', { durable: false });
//   await channel.bindQueue('test-queue', exchange, routingKey);

//   // Отправляем сообщение в Exchange с Routing Key

//   await channel.publish(exchange, routingKey, Buffer.from(message));

//   console.log(`[x] Sent ${message}`);

//   setTimeout(() => {
//     connection.close();
//     process.exit(0);
//   }, 500);
// }

// sendMessage().catch(console.error);


// Вариант 3
// отправка сообщений в очередь с счетчиком и определенным интервалом 

// const amqp = require('amqplib');

// async function sendMessage() {
//   const connection = await amqp.connect('amqp://localhost');
//   const channel = await connection.createChannel();

//   const exchange = 'dev-test';
//   const routingKey = 'test-queue';
//   let counter = 0;

//   // Создаем Exchange (если его еще нет)

//   await channel.assertExchange(exchange, 'direct', { durable: false });

//   // Определение очереди и связывание с Exchange через Routing Key

//   await channel.assertQueue('test-queue', { durable: false });
//   await channel.bindQueue('test-queue', exchange, routingKey);

//   do {
//     const timeToSleep = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
//     await new Promise(resolve => setTimeout(resolve, timeToSleep));

//     const message = `Hello from JavaScript [N:${counter++}]`;
//     await channel.publish(exchange, routingKey, Buffer.from(message));

//     console.log(`[x] Sent ${message}`);
//   } while (true);
// }

// sendMessage().catch(console.error);



// Вариант 4
//асинхронная отправка сообщений в очередь direct

const amqp = require('amqplib');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createTask(timeToSleepTo, routingKey) {
  let counter = 0;

  do {
    const timeToSleep = Math.floor(Math.random() * (timeToSleepTo - 1000 + 1)) + 1000;
    await sleep(timeToSleep);

    const connection = await amqp.connect('amqp://localhost/');
    const channel = await connection.createChannel();

    const exchange = 'amq.direct';
    await channel.assertExchange(exchange, 'direct', { durable: true });

    const message = `Message type [${routingKey}] from publisher N ${counter}`;
    const body = Buffer.from(message);

    await channel.publish(exchange, routingKey, body);

    console.log(`Message type [${routingKey}] is sent into Direct Exchange [N:${counter++}]`);

    await channel.close();
    await connection.close();
  } while (true);
}

(async () => {
  try {
    await Promise.all([
      createTask(12000, 'error'),
      createTask(10000, 'info'),
      createTask(8000, 'warning')
    ]);
  } catch (error) {
    console.error('Error in main:', error.message);
    console.error(error);
  }
})();



