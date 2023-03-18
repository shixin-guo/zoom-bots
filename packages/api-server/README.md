# AI Chatbot Assistant for Zoom

This is a sample chatbot app using Node.js and ChatGPT API

## Local/Development Setup

To run the completed chatbot locally, follow these steps:

1. Clone the repository and navigate to its directory in terminal: 

```
$ git@github.com:shixin-guo/my-bot.git
$ cd my-bot
$ pnpm install
$ cd ./package/api-server && touch .env
```

2. Add your respective [**development** Zoom Chatbot API credentials](https://marketplace.zoom.us/docs/guides/getting-started/app-types/create-chatbot-app#register) to the `.env` file:

```
zoom_bot_jid=*****@xmpp.zoom.us (Required)
zoom_client_id=***********(Required) 
zoom_client_secret=*********** (Required) 
zoom_verification_token=*********** (Required)
OPENAI_API_KEY=*************** (Required)
```

3. In terminal, run:
```
$ pnpm run dev
$ ngrok http 4000
```
(ngrok turns localhost into a live server so that slash commands and user actions can be sent to your app)

4. Open your ngrok https URL in a browser. You should see:
```
Welcome to Zoom! I'm ChatGPT, your virtual assistant. I'm here to help make your Zoom experience more enjoyable and efficient. How can I be of assistance?
```

5. On your App Marketplace Dashboard, add your ngrok https URL to your Whitelist URLs (App Credentials Page), **Development** Redirect URL for OAuth (App Credentials Page), and **Development** Bot Endpoint URL (Features Page). Make sure to match the path after your ngrok https URL with the express routes in `index.js`.

6. After that, your app is ready to be installed!
On your App Marketplace Dashboard, go to the **Local Test** page and click **Install**. After you click the **Authorize** button, you should be taken to your redirect URL and see this:

```
Thanks for installing the Chatbot for Zoom!
```

7. Now that your chatbot is installed on your Zoom account, go to a Zoom chat channel and type:

```
/ccbot
```


## Production Setup

To run the completed chatbot on a live server, follow these steps:

1. Fill in your [**production** Zoom Chatbot API credentials](https://marketplace.zoom.us/docs/guides/getting-started/app-types/create-chatbot-app#register) and your [Unsplash Access Key](https://unsplash.com/oauth/applications) in the **Config Vars** section.

2. Click **Deploy app**.

3. On your App Marketplace Dashboard, add your Heroku URL to your Whitelist URLs (App Credentials Page), **Production** Redirect URL for OAuth (App Credentials Page), and **Production** Bot Endpoint URL (Features Page). Make sure to match the path after your Heroku URL with the express routes in `index.js`.

4. On your App Marketplace Dashboard, go to the **Submit** page and click **Add to Zoom**. After you click the **Authorize** button, you should be taken to your redirect URL and see this:

```
Thanks for installing the Unsplash Chatbot for Zoom!
```

5. Now that your chatbot is installed on your Zoom account, go to a Zoom chat channel and type:

```
/shixin mountains
```

## Need Help?

If you have any questions, please reach out to me at [gzpoffline@gmail.com].
