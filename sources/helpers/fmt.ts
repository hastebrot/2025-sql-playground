import { format as formatBytes } from "./bytes";
import { format as formatMillis } from "./duration";

export const Fmt = {
  bytes(bytes: number): string {
    return formatBytes(bytes);
  },

  millis(millis: number, roundTo: "millis" | "micros" | "nanos" = "micros"): string {
    if (roundTo === "millis") {
      millis = Math.round(millis);
    } else if (roundTo === "micros") {
      millis = Math.round(millis * 1e3) / 1e3;
    }
    return millis === 0 ? "0ms" : formatMillis(millis, { ignoreZero: true });
  },
};
