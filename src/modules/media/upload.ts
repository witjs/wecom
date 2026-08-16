import { openAsBlob } from 'node:fs';
import { basename } from 'node:path';
import type { Readable } from 'node:stream';
import { WecomConfigError } from '../../core/errors';

export type MediaUploadSource = Buffer | Blob | Readable | string;

const MAX_BUFFERED_STREAM_BYTES = 20 * 1024 * 1024;

export async function toFormData(
  file: MediaUploadSource,
  filename?: string,
  fieldName = 'media'
): Promise<FormData> {
  const { blob, name } = await toUploadPart(file, filename);
  const form = new FormData();
  form.append(fieldName, blob, name);
  return form;
}

export async function toUploadPart(
  file: MediaUploadSource,
  filename?: string
): Promise<{ blob: Blob; name: string }> {
  if (typeof file === 'string') {
    return {
      blob: await openAsBlob(file),
      name: filename ?? basename(file),
    };
  }
  if (Buffer.isBuffer(file)) {
    return {
      blob: new Blob([file]),
      name: filename ?? 'file',
    };
  }
  if (file instanceof Blob) {
    return {
      blob: file,
      name: filename ?? 'file',
    };
  }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of file) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.byteLength;
    if (size > MAX_BUFFERED_STREAM_BYTES) {
      throw new WecomConfigError(
        `Readable upload source exceeds ${MAX_BUFFERED_STREAM_BYTES} bytes; pass a file path or Blob for large uploads`
      );
    }
    chunks.push(buffer);
  }
  return {
    blob: new Blob([Buffer.concat(chunks)]),
    name: filename ?? 'file',
  };
}
