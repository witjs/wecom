export interface CallbackConfig {
  token: string;
  encodingAESKey: string;
  receiveId: string;
}

export interface CallbackQuery {
  msg_signature: string;
  timestamp: string;
  nonce: string;
  echostr?: string;
}

export interface CallbackEncryptedBody {
  Encrypt?: string;
  encrypt?: string;
  ToUserName?: string;
  tousername?: string;
  AgentID?: string;
  agentid?: string;
}

export interface CallbackReply {
  encrypt: string;
  signature: string;
  timestamp: string;
  nonce: string;
  xml: string;
  json: {
    encrypt: string;
    msgsignature: string;
    timestamp: string;
    nonce: string;
  };
}

export interface CallbackMessage {
  plaintext: string;
  fields: Record<string, string>;
  encrypt: string;
  infoType?: string;
  msgType?: string;
  event?: string;
  suiteTicket?: string;
}
