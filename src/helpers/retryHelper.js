export async function retry(fn, retries = 2, delayMs = 800) {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, delayMs * (attempt + 1)));
      attempt++;
    }
  }
}
