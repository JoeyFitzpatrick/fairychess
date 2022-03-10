const Pusher = require('pusher');

const pusher = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.KEY,
    secret: process.env.SECRET,
    cluster: process.env.CLUSTER,
    useTLS: true,
  });

export default function handler(req, res) {
  const data = req.body;
  pusher.trigger(data.channel, 'receive-move', data, () => {
    console.log("sent event")
  });
  res.status(200).end('sent event successfully');
};