type OmitStrict<T, K extends keyof T> = Omit<T, K>;
type PickStrict<T, K extends keyof T> = Pick<T, K>;

export type { OmitStrict, PickStrict };
