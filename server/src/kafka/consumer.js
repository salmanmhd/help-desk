// require("dotenv").config();
import "dotenv/config";

const {
  createWallet,
  creditWalletAmount,
  debitWalletAmount,
  processMatchEntryPayment,
  gameStart,
  gameEnd,
  gameCancelled,
} = require("../controllers/wallet.controller");

const { consumer } = require("./index");

const WALLET_CREATE_TOPIC = process.env.WALLET_CREATE_TOPIC;
const WALLET_CREDIT_TOPIC = process.env.WALLET_CREDIT_TOPIC;
const WALLET_DEBIT_TOPIC = process.env.WALLET_DEBIT_TOPIC;
const WALLET_MATCH_ENTRY_TOPIC = process.env.WALLET_MATCH_ENTRY_TOPIC;
const GAME_SESSION_START_TOPIC = process.env.GAME_SESSION_START_TOPIC;
const GAME_SESSION_END_TOPIC = process.env.GAME_SESSION_END_TOPIC;
const GAME_SESSION_CANCEL_TOPIC = process.env.GAME_SESSION_CANCEL_TOPIC;

const walletTopics = async () => {
  const topics = [
    WALLET_CREATE_TOPIC,
    WALLET_CREDIT_TOPIC,
    WALLET_DEBIT_TOPIC,
    WALLET_MATCH_ENTRY_TOPIC,
    GAME_SESSION_START_TOPIC,
    GAME_SESSION_END_TOPIC,
    GAME_SESSION_CANCEL_TOPIC,
  ];

  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: true });
  }

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const data = JSON.parse(message.value.toString());
        console.log("Consumer received data:", topic, data);

        switch (topic) {
          case WALLET_CREATE_TOPIC:
            await createWallet({
              userId: data.userId,
              uniqueId: data.uniqueId,
            });
            break;

          case WALLET_CREDIT_TOPIC:
            await creditWalletAmount({
              id: data.userId, // explicitly name the key `id`
              idType: "userId", // optional if default works
              amount: data.amount,
              amountType: data.amountType,
              orderId: data.orderId,
              transactionId: data.transactionId,
              transactionType: data.transactionType,
              description: data.description,
            });

            break;

          case WALLET_DEBIT_TOPIC:
            await debitWalletAmount(
              data.userId,
              data.amount,
              data.orderId,
              data.transactionId,
              data.transactionType,
              data.amountType,
              data.description
            );
            break;

          case WALLET_MATCH_ENTRY_TOPIC:
            await processMatchEntryPayment({
              uniqueId: data.uniqueId,
              roomId: data.roomId,
              gameFee: data.gameFee,
              orderId: data.orderId,
              transactionType: data.transactionType,
              useBonus: data.useBonus,
              description: data.description,
            });
            break;

          case GAME_SESSION_START_TOPIC:
            await gameStart({
              users: data.users,
              gameId: data.gameId,
              roomId: data.roomId,
              gameFee: data.gameFee,
              // transactionId: data.transactionId,
              correlationId: data.correlationId,
            });
            break;

          case GAME_SESSION_END_TOPIC:
            await gameEnd({
              players: data.players,
              winnerId: data.winnerId,
              gameId: data.gameId,
              roomId: data.roomId,
              amount: data.amount,
            });
            break;

          case GAME_SESSION_CANCEL_TOPIC:
            await gameCancelled({
              players: data.players,
              gameId: data.gameId,
              roomId: data.roomId,
              reason: data.reason,
            });
            break;

          default:
            console.warn("⚠️ Unhandled topic:", topic);
        }

        console.log(`✅ Processed topic: ${topic} for user: ${data.userId}`);
      } catch (err) {
        console.error("❌ Kafka processing error:", err.message);
      }
    },
  });
};

export { walletTopics };
