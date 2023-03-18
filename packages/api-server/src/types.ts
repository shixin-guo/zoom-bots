interface ZoomBotMessageRequestContent {
  head?: ZoomBotMessageRequestContentHeader,
  body: ZoomBotMessageRequestContentBody[]
}
interface ZoomBotMessageRequestContentHeader {
  text: string,
  sub_head?: {
    text: string
  }
}
interface ZoomBotMessageRequestContentBody {
  type: "section" | "message",
  sidebar_color?: string,
  sections?: [
    | {
      type: "attachments",
      img_url: string,
      resource_url: string,
      information: {
        title: {
          text: string
        },
        description: {
          text: string
        }
      }
    }
    | {
      type: "message",
      text: string
    }
  ],
  text?: string
}

const body = {
  content: {
    head: {
      type: "message",
      text: "Catered Lunch Choices Today"
    },
    body: [
      {
        type: "message",
        text: "Hello all, here are the lunch choices for today's company event:"
      },
      {
        type: "fields",
        items: [
          {
            key: "Pizza",
            value: "Best Pizza Restaurant",
            link: "https://yelp.com"
          },
          {
            key: "Pasta",
            value: "Best Pasta Restaurant",
            link: "https://yelp.com"
          },
          {
            key: "Burger",
            value: "Best Burger Restaurant",
            link: "https://yelp.com"
          }
        ]
      }
    ]
  },
  to_jid: "{{to_jid}}",
  robot_jid: "{{account_id}}",
  account_id: "{{account_id}}"
};


const attachments = {
  content: {
    head: {
      type: "message",
      text: "Lunch Preferences"
    },
    body: [
      {
        type: "attachments",
        ext: "jpg",
        resource_url: "https://d24cgw3uvb9a9h.cloudfront.net/static/93664/image/new/ZoomLogo.png",
        information: {
          title: {
            style: {
              color: "#323639",
              itatic: "true",
              bold: "false"
            },
            text: "hello"
          },
          description: {
            style: {
              color: "#2D8CFF",
              bold: "false"
            },
            text: "Click to download the resource"
          }
        },
        img_url: "https://d24cgw3uvb9a9h.cloudfront.net/static/93664/image/new/ZoomLogo.png"
      }
    ]
  },
  to_jid: "{{to_jid}}",
  robot_jid: "{{account_id}}",
  account_id: "{{account_id}}"
};

interface ZoomChatbotParams {
  robot_jid: string,
  to_jid: string,
  account_id: string,
  user_jid: string,
  content: ZoomBotMessageRequestContent
}

export {
  ZoomChatbotParams,
  ZoomBotMessageRequestContent,
  ZoomBotMessageRequestContentHeader,
  ZoomBotMessageRequestContentBody,
};
