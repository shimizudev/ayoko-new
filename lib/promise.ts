type PromiseResult<T> = [T | null, Error | null];

export async function safeAwait<T, E extends Error>(
  promise: Promise<T>,
  fallbackValue?: T
): Promise<PromiseResult<T>> {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    return [fallbackValue || null, error as E];
  }
}

export async function safeAwaitAll<T>(
  promises: Promise<T>[],
  fallbackValue?: T
): Promise<PromiseResult<T>[]> {
  const results = await Promise.all(
    promises.map((p) => safeAwait(p, fallbackValue))
  );
  return results;
}
