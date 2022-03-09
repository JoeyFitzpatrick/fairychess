import Ably from "ably/promises";
import { useEffect } from "react";

// Info on getting number of users on Ably channel can be found here: https://ably.com/tutorials/presence#tutorial-step-4

const ably = new Ably.Realtime.Promise({ authUrl: "/api/createTokenRequest" });

export function useChannel(channelName, callbackOnMessage) {
  const channel = ably.channels.get(channelName);

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

  return [channel, ably];
}
