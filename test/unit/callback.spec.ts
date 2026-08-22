import { describe, expect, it } from 'vitest';
import { Callback, WecomCallbackError, WecomConfigError } from '../../src';

const official = {
  receiveId: 'wx5823bf96d3bd56c7',
  token: 'QDG6eK',
  encodingAESKey: 'jWmYm7qr5nMoAUwZRjGtBxmz3KA1tkAj3ykkR6q2B2C',
};

const officialQuery = {
  msg_signature: '477715d11cdb4164915debcba66cb864d751f3e6',
  timestamp: '1409659813',
  nonce: '1372623149',
};

const officialEncrypt =
  'RypEvHKD8QQKFhvQ6QleEB4J58tiPdvo+rtK1I9qca6aM/wvqnLSV5zEPeusUiX5L5X/0lWfrf0QADHHhGd3QczcdCUpj911L3vg3W/sYYvuJTs3TUUkSUXxaccAS0qhxchrRYt66wiSpGLYL42aM6A8dTT+6k4aSknmPj48kzJs8qLjvd4Xgpue06DOdnLxAUHzM6+kDZ+HMZfJYuR+LtwGc2hgf5gsijff0ekUNXZiqATP7PF5mZxZ3Izoun1s4zG4LUMnvw2r+KqCKIw+3IQH03v+BCA9nMELNqbSf6tiWSrXJB3LAVGUcallcrw8V2t9EL4EhzJWrQUax5wLVMNS0+rUPA3k22Ncx4XXZS9o0MBH27Bo6BpNelZpS+/uh9KsNlY6bHCmJU9p8g7m3fVKn28H3KDYA5Pl/T8Z1ptDAVe0lXdQ2YoyyH2uyPIGHBZZIs2pDBS8R07+qN+E7Q==';

const officialXml = `<xml>
<ToUserName><![CDATA[wx5823bf96d3bd56c7]]></ToUserName>
<Encrypt><![CDATA[${officialEncrypt}]]></Encrypt>
<AgentID><![CDATA[218]]></AgentID>
</xml>`;

describe('Callback', () => {
  it('throws when required config is missing', () => {
    expect(
      () =>
        new Callback({
          token: '',
          encodingAESKey: official.encodingAESKey,
          receiveId: official.receiveId,
        })
    ).toThrow(WecomConfigError);
  });

  it('decrypts the official sample callback', () => {
    const callback = new Callback(official);
    const message = callback.decrypt(officialXml, officialQuery);
    expect(message.fields.Content).toBe('hello');
    expect(message.fields.FromUserName).toBe('mycreate');
    expect(message.fields.MsgType).toBe('text');
    expect(message.msgType).toBe('text');
  });

  it('decrypts a JSON encrypted body', () => {
    const callback = new Callback(official);
    const message = callback.decrypt(
      { encrypt: officialEncrypt, agentid: '218' },
      officialQuery
    );
    expect(message.fields.Content).toBe('hello');
  });

  it('rejects a tampered signature', () => {
    const callback = new Callback(official);
    expect(() =>
      callback.decrypt(officialXml, {
        ...officialQuery,
        msg_signature: '0000000000000000000000000000000000000000',
      })
    ).toThrow(WecomCallbackError);
  });

  it('verifies the official echostr URL', () => {
    const callback = new Callback(official);
    const echostr = callback.verifyUrl({
      msg_signature: '5c45ff5e21c57e6ad56bac8758b79b1d9ac89fd3',
      timestamp: '1409659589',
      nonce: '263014780',
      echostr:
        'P9nAzCzyDtyTWESHep1vC5X9xho/qYX3Zpb4yKa9SKld1DsH3Iyt3tP3zNdtp+4RPcs8TgAE7OaBO+FZXvnaqQ==',
    });
    expect(echostr).toBe('1616140317555161061');
  });

  it('round-trips encrypt and decrypt', () => {
    const callback = new Callback(official);
    const plaintext =
      '<xml><Content><![CDATA[ping]]></Content><InfoType><![CDATA[suite_ticket]]></InfoType><SuiteTicket><![CDATA[ticket-1]]></SuiteTicket></xml>';
    const reply = callback.encrypt(plaintext, {
      timestamp: '1700000000',
      nonce: 'abc',
    });
    const message = callback.decrypt(reply.xml, {
      msg_signature: reply.signature,
      timestamp: reply.timestamp,
      nonce: reply.nonce,
    });
    expect(message.plaintext).toBe(plaintext);
    expect(message.suiteTicket).toBe('ticket-1');
    expect(message.infoType).toBe('suite_ticket');
  });
});
