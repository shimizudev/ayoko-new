type SafeDestructure<T> = T & { error: string | null };

/**
 * Safely destructures the given object and assigns `null` values if the object is `undefined` or `null`.
 *
 * @param obj The object to destructure.
 * @returns A new object with the properties of `obj` or `null` values if `obj` is `undefined` or `null`, along with an `error` property.
 */
export function safeDestructure<T extends object>(
  obj: T | undefined | null
): SafeDestructure<T> {
  if (obj === undefined || obj === null) {
    const nullValues: any = Object.keys(obj || {}).reduce((acc, key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      acc[key] = null;
      return acc;
    }, {});

    return { ...nullValues, error: `Cannot destructure ${obj} value.` };
  }

  return { ...obj, error: null };
}
