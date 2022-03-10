const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true,
});

export default function handler(req, res) {
  const data = req.body;
  if (data.event === "send-move") {
    pusher.trigger(data.channel, "receive-move", data, () => {
      console.log("sent event");
    });
  }

  if (data.event === "init") {
    pusher.trigger(data.channel, "receive-init", { message: "init" }, () => {
      console.log("sent event");
    });
  }

  res.status(200).end("sent event successfully");
}
