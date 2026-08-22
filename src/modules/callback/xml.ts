export function extractTag(xml: string, tag: string): string | undefined {
  const cdata = xml.match(
    new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i')
  );
  if (cdata?.[1] !== undefined) {
    return cdata[1];
  }
  const plain = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i'));
  return plain?.[1];
}

export function parseXmlFields(xml: string): Record<string, string> {
  const fields: Record<string, string> = {};
  const inner = xml
    .trim()
    .replace(/^<xml>/i, '')
    .replace(/<\/xml>$/i, '');
  const re =
    /<([A-Za-z_][\w.]*)>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/\1>/g;
  for (const match of inner.matchAll(re)) {
    fields[match[1]] = match[2] ?? match[3] ?? '';
  }
  return fields;
}

export function buildEncryptedXml(payload: {
  encrypt: string;
  signature: string;
  timestamp: string;
  nonce: string;
}): string {
  return [
    '<xml>',
    `<Encrypt><![CDATA[${payload.encrypt}]]></Encrypt>`,
    `<MsgSignature><![CDATA[${payload.signature}]]></MsgSignature>`,
    `<TimeStamp>${payload.timestamp}</TimeStamp>`,
    `<Nonce><![CDATA[${payload.nonce}]]></Nonce>`,
    '</xml>',
  ].join('');
}
