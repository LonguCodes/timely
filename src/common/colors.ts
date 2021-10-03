import chroma from "chroma-js";

export function getGroupColor(index: number): string {
  let result = (function internalFunction() {
    let trimmedIndex = (index * 0.69) % 3;
    if (trimmedIndex <= 1) {
      return chroma
        .mix(
          chroma.rgb(255, 0, 0),
          chroma.rgb(0, 255, 0),
          trimmedIndex % 1
        )
        .hex();
    }

    trimmedIndex--;

    if (trimmedIndex <= 1) {
      return chroma
        .mix(
          chroma.rgb(0, 255, 0),
          chroma.rgb(0, 0, 255),
          trimmedIndex % 1
        )
        .hex();
    }

    trimmedIndex--;

    return chroma
      .mix(chroma.rgb(0, 0, 255), chroma.rgb(255, 0, 0), trimmedIndex % 1)
      .hex();
  })();
  if (chroma.hex(result).luminance() < 0.5)
    return chroma.hex(result).brighten(1.5).hex();
  return result;
}