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
interface AttachmentMessage {
  type: "attachments",
  img_url: string,
  ext?: "jpg" | "png" | "gif" | "jpeg",
  resource_url: string,
  information: {
    title: {
      text: string,
      style?: Record<string, string>
    },
    description: {
      text: string,
      style?: Record<string, string>
    }
  }
}
interface TextMessage {
  type: "message",
  text: string
}
interface SectionMessage {
  type: "section",
  sections: [
    {
      type: "message",
      style: Record<string, any>,
      text?: string,
      link?: string // todo
    }
  ]

}

interface FieldsMessage {
  type: "fields",
  items: [
    {
      key: string,
      value: string,
      link?: string

    }
  ]
}

interface ZoomBotMessageRequestContentBody {
  type: "section" | "message",
  sidebar_color?: string,
  sections?: [
    AttachmentMessage
    | TextMessage | SectionMessage | FieldsMessage
  ],
  text?: string,
  footer?: string,
  footer_icon?: string // todo
}

interface ZoomChatbotParams {
  robot_jid: string,
  to_jid: string,
  account_id: string,
  user_jid: string,
  content: ZoomBotMessageRequestContent,
  is_markdown_support?: boolean
}

export {
  ZoomChatbotParams,
  ZoomBotMessageRequestContent,
  ZoomBotMessageRequestContentHeader,
  ZoomBotMessageRequestContentBody,
  SectionMessage, // todo
};
