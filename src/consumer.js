    //Вариант 1
//код устанавливает соединение Rabbit, создает канал и начинает прослушивание очереди сообщений

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

//     channel.assertQueue(queue, {
//       durable: false
//     });

//     console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

//     channel.consume(queue, function(msg) {
//       console.log(" [x] Received %s", msg.content.toString());

//       // логика обработки сообщения

//       // Подтверждение успешной обработки сообщения
//       channel.ack(msg);
//     }, {
//       noAck: false  // Устанавливаем noAck: false, чтобы включить подтверждение
//     });

//     // Пример обработки события закрытия соединения
//     connection.on('close', function() {
//       console.log("Connection closed");
//     });

//     // Пример обработки события ошибки
//     connection.on('error', function(err) {
//       console.error("Error in connection:", err);
//     });

//     // Пример обработки события закрытия канала
//     channel.on('close', function() {
//       console.log("Channel closed");
//     });

//     // Пример обработки события ошибки на канале
//     channel.on('error', function(err) {
//       console.error("Error in channel:", err);
//     });

//     // Пример завершения работы после нажатия CTRL+C
//     process.on('SIGINT', function() {
//       console.log("Received SIGINT, closing connection");
//       connection.close();
//     });
//   });
// });


//Вариант 2
//используется асинхронная функция

const amqp = require('amqplib');

async function consumeMessages() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'test-queue';

  await channel.assertQueue(queue, { durable: false });

  console.log(`Subscribed to the queue '${queue}'`);

  channel.consume(queue, (msg) => {
    if (msg.content) {
      const message = msg.content.toString();
      console.log(`Received message: ${message}`);
    }
  }, { noAck: true });
}

consumeMessages().catch(console.error);
