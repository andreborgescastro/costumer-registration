type ValidationError = {
    field: string;
    error: string;
  };

  /**
   * Validates an object against a schema.
   * @param obj - Object to be validated.
   * @param schema - Expected schema.
   * @param nestedSchemas - Nested schemas for arrays of objects.(optional)
   * @param ignoredFields - Fields to be ignored during validation.(optional)
   * @returns Array of validation errors.
   */
  export function validateObject(
    obj: any,
    schema: Record<string, any>,
    nestedSchemas: Record<string, Record<string, any>> = {},
    ignoredFields: string[] = []
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    //Iterates over the schema
    for (const key of Object.keys(schema)) {
      if (ignoredFields.includes(key)) continue;

      // Missing field
      if (!(key in obj)) {
        errors.push({ field: key, error: "Field is missing" });
        continue;
      }

      const expectedType = schema[key];
      const actualType = Array.isArray(obj[key]) ? "object" : typeof obj[key];

      // Incorrect type
      if (expectedType !== actualType) {
        errors.push({
          field: key,
          error: `Expected type '${expectedType}', but got '${actualType}'`,
        });
        continue;
      }

      // Nested schema validation
      if (key in nestedSchemas && Array.isArray(obj[key])) {
        const nestedSchema = nestedSchemas[key];
        obj[key].forEach((nestedObj: any, index: number) => {
          const nestedErrors = validateObject(nestedObj, nestedSchema, {}, []);
          errors.push(
            ...nestedErrors.map((err) => ({
              field: `${key}[${index}].${err.field}`,
              error: err.error,
            }))
          );
        });
      }
    }

    // Iterate over the object to check for unexpected fields
    for (const key of Object.keys(obj)) {
      if (!ignoredFields.includes(key) && !(key in schema)) {
        errors.push({ field: key, error: "Field is not expected" });
      }
    }

    return errors;
  }
