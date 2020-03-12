//Setup libraries we want to use (installed them first with *npm install*)
const webpush = require("web-push");
const fetch = require("node-fetch");
const prompts = require("prompts");

//Location of your subscribers file (normally they would be in a database)
const yourSubscriberJSONFileURL =
  "https://i401532.hera.fhict.nl/PWA/data/subscribers.json";

//Place your keys here
webpush.setVapidDetails(
  "mailto:stefvdburgt@hotmail.com", //Subject VAPID
  "BDomArd8DJSCcbgW6iNvsGCIqhiXZ0ef_0tiYrNPt6RTYZYQcihsr0_e6_KqZ7M3XqbIU6pTPAIV80pl1XtrkA4", // Public Key VAPID
  "jN9Mas7Hnyqyg_ZPwHbDpqD8L4yM5lihI54JDNSOfBo" //Private Key VAPID
);

console.log(
  " ==========================================\n",
  "==       SEND PUSH NOTIFICATION         ==\n",
  "==========================================\n"
);

//This allows you to fill in the titel and message of the notification in the CLI
const questions = [
  {
    type: "text",
    name: "title",
    message: "Push notification title"
  },
  {
    type: "text",
    name: "message",
    message: "Push notification message"
  }
];

(async () => {
  const answers = await prompts(questions);

  console.log(
    "\n ==========================================\n",
    "==    SENDING MESSAGE TO SUBSCRIBERS    ==\n",
    "==========================================\n"
  );

  //Putting the promted title and message in variables to use
  let pushTitle = answers.title;
  let pushMessage = answers.message;

  //Send a notification to every subscriber
  fetch(yourSubscriberJSONFileURL)
    .then(subscriberJSON => subscriberJSON.json())
    .then(subscriberJSON => {
      for (let subscriberEndpoint in subscriberJSON) {
        //Setting up format of subcription for sending
        const pushSubscription = {
          endpoint: subscriberEndpoint,
          keys: {
            auth: subscriberJSON[subscriberEndpoint]["keys"]["auth"],
            p256dh: subscriberJSON[subscriberEndpoint]["keys"]["p256dh"]
          }
        };
        //Actual sending
        webpush
          .sendNotification(
            pushSubscription,
            `{"title":"${pushTitle}","message":"${pushMessage}"}`
          )
          .then(result => {
            console.log(`-- Message send to ${pushSubscription.endpoint}`);
          })
          .catch(error => {
            console.log(`-- Message NOT send to ${pushSubscription.endpoint}`);
          });
      }
    });
})();
