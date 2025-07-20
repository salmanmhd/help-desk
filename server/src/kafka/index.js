import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "wallet-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "wallet-group" });

const connectKafka = async () => {
  try {
    await producer.connect();
    console.log("✅ Kafka producer connected");

    await consumer.connect();
    console.log("✅ Kafka consumer connected");
  } catch (error) {
    console.error("❌ Kafka connection error:", error);
    process.exit(1);
  }
};

export { kafka, producer, consumer, connectKafka };
