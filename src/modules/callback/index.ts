import { randomBytes } from 'node:crypto';
import { WecomCallbackError, WecomConfigError } from '../../core/errors';
import {
  decryptCallback,
  encryptCallback,
  signCallback,
} from './crypt';
import type {
  CallbackConfig,
  CallbackEncryptedBody,
  CallbackMessage,
  CallbackQuery,
  CallbackReply,
} from './interface';
import { buildEncryptedXml, extractTag, parseXmlFields } from './xml';

export type {
  CallbackConfig,
  CallbackEncryptedBody,
  CallbackMessage,
  CallbackQuery,
  CallbackReply,
} from './interface';

/**
 * @description 回调 URL 验证、签名和消息加解密
 */
export class Callback {
  readonly config: CallbackConfig;

  constructor(config: CallbackConfig) {
    if (!config.token) {
      throw new WecomConfigError('token should not be empty');
    }
    if (!config.encodingAESKey) {
      throw new WecomConfigError('encodingAESKey should not be empty');
    }
    if (!config.receiveId) {
      throw new WecomConfigError('receiveId should not be empty');
    }
    this.config = config;
  }

  sign(timestamp: string, nonce: string, encrypt: string): string {
    return signCallback(this.config.token, timestamp, nonce, encrypt);
  }

  verifyUrl(query: CallbackQuery): string {
    if (!query.echostr) {
      throw new WecomCallbackError('echostr should not be empty');
    }
    this.assertSignature(query, query.echostr);
    return decryptCallback(
      this.config.encodingAESKey,
      query.echostr,
      this.config.receiveId
    );
  }

  decrypt(
    body: string | CallbackEncryptedBody,
    query: CallbackQuery
  ): CallbackMessage {
    const encrypt = extractEncrypt(body);
    if (!encrypt) {
      throw new WecomCallbackError('callback body is missing Encrypt');
    }
    this.assertSignature(query, encrypt);
    const plaintext = decryptCallback(
      this.config.encodingAESKey,
      encrypt,
      this.config.receiveId
    );
    const fields = parseMessageFields(plaintext);
    return {
      plaintext,
      fields,
      encrypt,
      infoType: fields.InfoType ?? fields.infotype,
      msgType: fields.MsgType ?? fields.msgtype,
      event: fields.Event ?? fields.event,
      suiteTicket: fields.SuiteTicket ?? fields.suiteticket,
    };
  }

  encrypt(
    plaintext: string,
    options: { timestamp?: string; nonce?: string } = {}
  ): CallbackReply {
    const timestamp = options.timestamp ?? String(Math.floor(Date.now() / 1000));
    const nonce = options.nonce ?? randomBytes(8).toString('hex');
    const encrypt = encryptCallback(
      this.config.encodingAESKey,
      plaintext,
      this.config.receiveId
    );
    const signature = this.sign(timestamp, nonce, encrypt);
    return {
      encrypt,
      signature,
      timestamp,
      nonce,
      xml: buildEncryptedXml({ encrypt, signature, timestamp, nonce }),
      json: {
        encrypt,
        msgsignature: signature,
        timestamp,
        nonce,
      },
    };
  }

  private assertSignature(query: CallbackQuery, encrypt: string): void {
    const expected = this.sign(query.timestamp, query.nonce, encrypt);
    if (expected !== query.msg_signature) {
      throw new WecomCallbackError('callback signature mismatch');
    }
  }
}

function extractEncrypt(body: string | CallbackEncryptedBody): string {
  if (typeof body === 'string') {
    const trimmed = body.trim();
    if (trimmed.startsWith('{')) {
      return extractEncrypt(JSON.parse(trimmed) as CallbackEncryptedBody);
    }
    return extractTag(trimmed, 'Encrypt') ?? '';
  }
  return body.Encrypt ?? body.encrypt ?? '';
}

function parseMessageFields(plaintext: string): Record<string, string> {
  const trimmed = plaintext.trim();
  if (trimmed.startsWith('{')) {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    const fields: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (value !== undefined && value !== null && typeof value !== 'object') {
        fields[key] = String(value);
      }
    }
    return fields;
  }
  return parseXmlFields(trimmed);
}
