export function sleep(ms: number = 1000): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}