function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (m) => m.toLowerCase());
}

export default function setServerErrors(
  response: any
): Record<string, string> {
  const errorsObject: Record<string, string> = {};
  const errorData = response.data;

  if (!errorData) {
    return errorsObject;
  }

  if (errorData.errors) {
    for (const errorItem of errorData.errors) {
      const key = camelCase(errorItem.property);
      errorsObject[key] = errorItem.description;
    }
  } else {
    for (const keyVar of Object.keys(errorData)) {
      const errors = errorData[keyVar];

      if (!errors?.length) {
        continue;
      }

      const key = camelCase(keyVar);

      const error = errors
        .map((item: string, index: number) =>
          errors.length > 1
            ? `${index + 1} - ${item}`
            : item
        )
        .join(' ');

      errorsObject[key] = error;
    }
  }

  return errorsObject;
}
