export function cx(
  ...classes: Array<
    string | Record<string, boolean | null | undefined> | null | undefined
  >
): string {
  // class helper that turns a list of classes into a single string
  // if one of the classes is an object, it will add the key if the value is truthy

  // e.g. cx("foo", "bar") => "foo bar"
  // e.g. cx("foo", { bar: true }) => "foo bar"
  return classes
    .flatMap((classValue) => {
      if (!classValue) {
        return [];
      }

      if (typeof classValue === "string") {
        return [classValue];
      }

      return Object.entries(classValue)
        .filter(([, enabled]) => Boolean(enabled))
        .map(([className]) => className);
    })
    .join(" ");
}

export default cx;
