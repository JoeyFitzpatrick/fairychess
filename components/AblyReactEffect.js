import Ably from "ably/promises";
import { useEffect } from "react";

const ably = new Ably.Realtime.Promise({ authUrl: "/api/createTokenRequest" });

export function useChannel(channelName, callbackOnMessage) {
  const channel = ably.channels.get(channelName);
  channel.attach(function (err) {
    if (err) {
      return console.error("Error attaching to the channel");
    }
    console.log("We are now attached to the channel");
    channel.presence.enter("hello", function (err) {
      if (err) {
        return console.error("Error entering presence");
      }
      console.log("We are now successfully present");
    });
  });
  channel.presence.get(function (err, members) {
    if (err) {
      return console.error("Error fetching presence data");
    }
    console.log(
      "There are " + members.length + " clients present on this channel"
    );
    var first = members[0];
    console.log("The first member is " + first.clientId);
    console.log("and their data is " + first.data);
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

  return [channel, ably];
}
