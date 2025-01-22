import { validateObject } from '../../src/utils/validator';

describe('validateObject', () => {
  const schema = {
    id: 'string',
    name: 'string',
    age: 'number',
    isActive: 'boolean',
    addressList: 'object',
  };

  const nestedSchema = {
    addressList: {
      street: 'string',
      city: 'string',
      country: 'string',
    },
  };

  it('should pass validation for a valid object', () => {
    const validObj = {
      id: '1',
      name: 'John Doe',
      age: 30,
      isActive: true,
      addressList: [
        {
          street: '123 Main St',
          city: 'New York',
          country: 'USA',
        },
      ],
    };

    const errors = validateObject(validObj, schema, nestedSchema);
    expect(errors).toEqual([]);
  });

  it('should return an error for missing fields', () => {
    const invalidObj = {
      id: '1',
      name: 'John Doe',
      isActive: true,
    };

    const errors = validateObject(invalidObj, schema, nestedSchema);
    expect(errors).toEqual([
      { field: 'age', error: 'Field is missing' },
      { field: 'addressList', error: 'Field is missing' },
    ]);
  });

  it('should return an error for incorrect field types', () => {
    const invalidObj = {
      id: 123, // Incorrect type
      name: 'John Doe',
      age: '30', // Incorrect type
      isActive: 'true', // Incorrect type
      addressList: [
        {
          street: 123, // Incorrect type
          city: 'New York',
          country: 'USA',
        },
      ],
    };

    const errors = validateObject(invalidObj, schema, nestedSchema);
    expect(errors).toEqual([
      { field: 'id', error: "Expected type 'string', but got 'number'" },
      { field: 'age', error: "Expected type 'number', but got 'string'" },
      { field: 'isActive', error: "Expected type 'boolean', but got 'string'" },
      {
        field: 'addressList[0].street',
        error: "Expected type 'string', but got 'number'",
      },
    ]);
  });

  it('should return an error for unexpected fields', () => {
    const invalidObj = {
      id: '1',
      name: 'John Doe',
      age: 30,
      isActive: true,
      addressList: [
        {
          street: '123 Main St',
          city: 'New York',
          country: 'USA',
        },
      ],
      extraField: 'unexpected', // Unexpected field
    };

    const errors = validateObject(invalidObj, schema, nestedSchema);
    expect(errors).toEqual([{ field: 'extraField', error: 'Field is not expected' }]);
  });

  it('should ignore specified fields', () => {
    const validObj = {
      id: '1',
      name: 'John Doe',
      age: 30,
      isActive: true,
      addressList: [
        {
          street: '123 Main St',
          city: 'New York',
          country: 'USA',
        },
      ],
    };

    const errors = validateObject(validObj, schema, nestedSchema, ['age']);
    expect(errors).toEqual([]);
  });

  it('should validate nested objects and return multiple errors', () => {
    const invalidObj = {
      id: '1',
      name: 'John Doe',
      age: 30,
      isActive: true,
      addressList: [
        {
          street: '123 Main St',
          city: 123, // Incorrect type
          country: 'USA',
        },
        {
          street: '456 Another St',
          city: 'Los Angeles',
          // Missing country
        },
      ],
    };

    const errors = validateObject(invalidObj, schema, nestedSchema);
    expect(errors).toEqual([
      { field: 'addressList[0].city', error: "Expected type 'string', but got 'number'" },
      { field: 'addressList[1].country', error: 'Field is missing' },
    ]);
  });

  it('should return no errors for empty object when schema allows it', () => {
    const emptySchema = {};
    const obj = {};
    const errors = validateObject(obj, emptySchema);
    expect(errors).toEqual([]);
  });
});
