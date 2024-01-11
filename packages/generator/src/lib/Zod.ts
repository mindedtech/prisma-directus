import * as z from "zod";

type ZodShape<T> = {
  [K in keyof T]-?: undefined extends T[K]
    ? null extends T[K]
      ? z.ZodNullableType<z.ZodOptionalType<z.ZodType<T[K]>>>
      : z.ZodOptionalType<z.ZodType<T[K]>>
    : null extends T[K]
      ? z.ZodNullableType<z.ZodType<T[K]>>
      : z.ZodType<T[K]>;
};

const zShape =
  <T>() =>
  <
    S extends ZodShape<T> & {
      [K in Exclude<keyof S, keyof T>]: never;
    },
  >(
    shape: S,
  ) =>
    z.object(shape).strict();

export { zShape };
