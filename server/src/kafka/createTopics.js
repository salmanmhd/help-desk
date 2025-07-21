import { Kafka } from "kafkajs";
import "dotenv/config";
console.log(process.env.KAFKA_BROKER);

const kafka = new Kafka({
  clientId: "wallet-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const admin = kafka.admin();

const topics = ["request.agent", "request.agent.response"];

async function createTopics() {
  try {
    await admin.connect();
    const response = await admin.createTopics({
      topics: topics.map((topic) => ({
        topic,
        numPartitions: 1,
        replicationFactor: 1,
      })),
      waitForLeaders: true,
    });

    if (response) {
      console.log("✅ Topics created successfully");
    } else {
      console.log("⚠️ Topics already exist or no new topics created");
    }
  } catch (error) {
    console.error("❌ Error creating topics:", error);
  } finally {
    await admin.disconnect();
  }
}

/**
 * Increases partitions for a given topic.
 * @param {string} topicName - Name of the topic to alter.
 * @param {number} newTotalPartitions - New total partition count (not how many to add).
 */
async function increasePartitions(topicName, newTotalPartitions) {
  try {
    await admin.connect();

    const metadata = await admin.fetchTopicMetadata({ topics: [topicName] });

    if (!metadata.topics.length || metadata.topics[0].partitions.length === 0) {
      console.error(`❌ Topic "${topicName}" does not exist.`);
      return;
    }

    const currentCount = metadata.topics[0].partitions.length;

    if (newTotalPartitions <= currentCount) {
      console.log(
        `⚠️ Topic "${topicName}" already has ${currentCount} partitions. New count must be higher.`
      );
      return;
    }

    await admin.createPartitions({
      topicPartitions: [
        {
          topic: topicName,
          count: newTotalPartitions,
        },
      ],
    });

    console.log(
      `✅ Increased partitions for "${topicName}" from ${currentCount} → ${newTotalPartitions}`
    );
  } catch (error) {
    console.error(
      `❌ Failed to increase partitions for "${topicName}":`,
      error.message
    );
  } finally {
    // await admin.disconnect();
  }
}

async function increasePartitionsForTopics(x) {
  await admin.disconnect();
}

createTopics();
// increasePartitionsForTopics(5);
