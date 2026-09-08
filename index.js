const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/orionhl-ping", async ({ ack, respond }) => {
  const start = Date.now();

  await ack();

  const latency = Date.now() - start;

  await respond({
    text: `Pong!\nLatency: ${latency}ms`
  });
});

app.command("/orionhl-help", async ({ ack, respond }) => {
  await ack();

  await respond({
    text: "Available Commands:\n/orionhl-ping - Check bot latency\n/orionhl-catfact - Get a cat fact"
  });
});

app.command("/orionhl-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact", {
      timeout: 5000
    });

    await respond({
      text: `Cat Fact:\n${response.data.fact}`
    });
  } catch (err) {
    console.error(err.message);

    await respond({
      text: "Failed to fetch a cat fact."
    });
  }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();
