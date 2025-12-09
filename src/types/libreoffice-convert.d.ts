declare module 'libreoffice-convert' {
  export function convert(
    buffer: Buffer,
    format: string,
    filter: any,
    callback: (err: Error | null, result: Buffer) => void
  ): void;
}