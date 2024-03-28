type OmitStrict<T, K extends keyof T> = Omit<T, K>;
type PickStrict<T, K extends keyof T> = Pick<T, K>;

export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  omittedKeys: K[],
): OmitStrict<T, K> =>
  Object.keys(obj).reduce(
    (acc, key) =>
      omittedKeys.some((omittedKey) => omittedKey === key)
        ? acc
        : { ...acc, [key]: obj[key] },
    Object.create(null) as OmitStrict<T, K>,
  );

export type { OmitStrict, PickStrict };
