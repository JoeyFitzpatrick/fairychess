import Ably from "ably/promises";
import { useEffect } from "react";

// Info on getting number of users on Ably channel can be found here: https://ably.com/tutorials/presence#tutorial-step-4

const ably = new Ably.Realtime.Promise({ authUrl: "/api/createTokenRequest" });

export function useChannel(channelName, callbackOnMessage) {
  const channel = ably.channels.get(channelName);
  channel.attach(function (err) {
    if (err) {
      return console.error("Error attaching to the channel");
    }
    channel.presence.enter("hello", function (err) {
      if (err) {
        return console.error("Error entering presence");
      }
    });
  });
  let numUsers
  channel.presence.get(function(err, members) {
    if(err) { return console.error("Error fetching presence data"); }
    numUsers = members.length;
  });

  const onMount = () => {
    channel.subscribe((msg) => {
      callbackOnMessage(msg);
    });
  };

  const onUnmount = () => {
    channel.unsubscribe();
  };

  const useEffectHook = () => {
    onMount();
    return () => {
      onUnmount();
    };
  };

  useEffect(useEffectHook);

  return [channel, ably, numUsers];
}
