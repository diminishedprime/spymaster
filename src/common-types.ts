import * as fp from "fp-ts";

export const none = fp.option.none;
export const some = fp.option.some;
export const fromNullable = fp.option.fromNullable;
export type Option<T> = fp.option.Option<T>;

export type GameId = string;
