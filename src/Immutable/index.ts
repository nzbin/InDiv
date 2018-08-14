export function toImmutable<T = any>(data: T): void {
  for (const key in data) {
    const val = data[key];
    if (val instanceof Object) {
      Object.defineProperty(data, key, {
        writable: false,
      });
      toImmutable<T[Extract<keyof T, string>]>(val);
    }
  }
}
