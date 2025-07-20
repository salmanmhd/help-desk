import { producer } from "./index";

const produceMessage = async (topic, messages) => {
  try {
    const formattedMessages = Array.isArray(messages) ? messages : [messages];

    await producer.send({
      topic,
      messages: formattedMessages,
    });

    console.log(`✅ Message sent to topic "${topic}"`);
  } catch (err) {
    console.error("❌ Error sending Kafka message:", err.message);
  }
};

export { produceMessage };
