import { connectKafka, producer } from "./index.js";

const produceMessage = async (topic, key, messages) => {
  try {
    await connectKafka();
    await producer.send({
      topic,
      messages: [
        {
          key: key,
          value: JSON.stringify(messages),
        },
      ],
    });

    console.log(`✅ Message sent to topic "${topic}"`);
  } catch (err) {
    console.error("❌ Error sending Kafka message:", err.message);
  }
};

export { produceMessage };
