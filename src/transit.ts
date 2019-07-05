import * as baseTransit from "transit-immutable-js";
import * as option from "fp-ts/lib/Option";

const transit = baseTransit.withExtraHandlers([
  {
    tag: "ts-fp-none",
    class: option.None,
    write: a => JSON.stringify(a),
    read: _ => option.none
  },
  {
    tag: "ts-fp-some",
    class: option.Some,
    write: (a: option.Some<any>) => JSON.stringify(a.value),
    read: a => option.some(JSON.parse(a))
  }
]);

export default transit;
