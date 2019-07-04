import * as baseTransit from "transit-immutable-js";
import * as option from "fp-ts/lib/Option";

const transit = baseTransit.withExtraHandlers([
  {
    tag: "ts-fp-none",
    class: option.None,
    write: a => JSON.stringify(a),
    read: a => JSON.parse(a)
  },
  {
    tag: "~ts-fp-some",
    class: option.Some,
    write: a => JSON.stringify(a),
    read: a => JSON.parse(a)
  }
]);

export default transit;
