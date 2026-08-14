import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import type { Readable } from 'node:stream';

export type MediaUploadSource = Buffer | Blob | Readable | string;

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
    const buffer = await readFile(file);
    return {
      blob: new Blob([buffer]),
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
  for await (const chunk of file) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return {
    blob: new Blob([Buffer.concat(chunks)]),
    name: filename ?? 'file',
  };
}
