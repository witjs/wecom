import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'node:crypto';
import { WecomCallbackError } from '../../core/errors';

export function decodeEncodingAESKey(encodingAESKey: string): Buffer {
  if (encodingAESKey.length !== 43) {
    throw new WecomCallbackError('encodingAESKey must be 43 characters');
  }
  const key = Buffer.from(`${encodingAESKey}=`, 'base64');
  if (key.length !== 32) {
    throw new WecomCallbackError('encodingAESKey is invalid');
  }
  return key;
}

export function signCallback(
  token: string,
  timestamp: string,
  nonce: string,
  encrypt: string
): string {
  return createHash('sha1')
    .update([token, timestamp, nonce, encrypt].sort().join(''))
    .digest('hex');
}

export function decryptCallback(
  encodingAESKey: string,
  encrypt: string,
  receiveId: string
): string {
  const key = decodeEncodingAESKey(encodingAESKey);
  const iv = key.subarray(0, 16);
  let plain: Buffer;
  try {
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    decipher.setAutoPadding(false);
    const raw = Buffer.concat([
      decipher.update(Buffer.from(encrypt, 'base64')),
      decipher.final(),
    ]);
    plain = pkcs7Unpad(raw);
  } catch (error) {
    throw new WecomCallbackError('Failed to decrypt callback payload', error);
  }
  if (plain.length < 20) {
    throw new WecomCallbackError('Decrypted callback payload is invalid');
  }
  const msgLen = plain.readUInt32BE(16);
  const msgEnd = 20 + msgLen;
  if (msgEnd > plain.length) {
    throw new WecomCallbackError('Decrypted callback payload is invalid');
  }
  const msg = plain.subarray(20, msgEnd).toString('utf8');
  const actualReceiveId = plain.subarray(msgEnd).toString('utf8');
  if (actualReceiveId !== receiveId) {
    throw new WecomCallbackError('ReceiveId mismatch');
  }
  return msg;
}

export function encryptCallback(
  encodingAESKey: string,
  message: string,
  receiveId: string
): string {
  const key = decodeEncodingAESKey(encodingAESKey);
  const iv = key.subarray(0, 16);
  const msg = Buffer.from(message, 'utf8');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(msg.length);
  const raw = Buffer.concat([
    randomBytes(16),
    len,
    msg,
    Buffer.from(receiveId, 'utf8'),
  ]);
  try {
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    cipher.setAutoPadding(false);
    const padded = pkcs7Pad(raw);
    return Buffer.concat([cipher.update(padded), cipher.final()]).toString(
      'base64'
    );
  } catch (error) {
    throw new WecomCallbackError('Failed to encrypt callback payload', error);
  }
}

const PKCS7_BLOCK_SIZE = 32;

function pkcs7Pad(data: Buffer): Buffer {
  const pad = PKCS7_BLOCK_SIZE - (data.length % PKCS7_BLOCK_SIZE);
  return Buffer.concat([data, Buffer.alloc(pad, pad)]);
}

function pkcs7Unpad(data: Buffer): Buffer {
  if (data.length === 0) {
    throw new WecomCallbackError('Decrypted callback payload is invalid');
  }
  const pad = data[data.length - 1];
  if (pad < 1 || pad > PKCS7_BLOCK_SIZE || pad > data.length) {
    throw new WecomCallbackError('Decrypted callback payload is invalid');
  }
  return data.subarray(0, data.length - pad);
}
