declare module "transit-immutable-js" {
  export const toJSON: (m: any) => string;
  export const fromJSON: (s: string) => any;
  interface Handler {
    tag: string;
    class: Function;
    write: (thing: any) => string;
    read: (thing: string) => any;
  }
  export const withExtraHandlers: (
    h: Handler[]
  ) => typeof import("transit-immutable-js");
}
