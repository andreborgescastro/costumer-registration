import { validateObject } from '../../src/utils/validator';

describe('validator', () => {
  it('should return no errors for a valid object', () => {
    const schema = { name: 'string', age: 'number' };
    const obj = { name: 'John', age: 30 };

    const result = validateObject(obj, schema);
    expect(result).toEqual([]);
  });

  it('should return an error for a missing field', () => {
    const schema = { name: 'string', age: 'number' };
    const obj = { name: 'John' };

    const result = validateObject(obj, schema);
    expect(result).toEqual([{ field: 'age', error: 'Field is missing' }]);
  });

  it('should return an error for an incorrect type', () => {
    const schema = { name: 'string', age: 'number' };
    const obj = { name: 'John', age: 'thirty' };

    const result = validateObject(obj, schema);
    expect(result).toEqual([{ field: 'age', error: "Expected type 'number', but got 'string'" }]);
  });

  it('should validate nested schemas for arrays', () => {
    const schema = { users: 'object' };
    const nestedSchemas = {
      users: { id: 'number', username: 'string' },
    };
    const obj = {
      users: [
        { id: 1, username: 'user1' },
        { id: 'two', username: 'user2' },
      ],
    };

    const result = validateObject(obj, schema, nestedSchemas);
    expect(result).toEqual([
      {
        field: 'users[1].id',
        error: "Expected type 'number', but got 'string'",
      },
    ]);
  });

  it('should ignore fields specified in ignoredFields', () => {
    const schema = { name: 'string', age: 'number', ignoredField: 'string' };
    const obj = { name: 'John', age: 30 };

    const result = validateObject(obj, schema, {}, ['ignoredField']);
    expect(result).toEqual([]);
  });

  it('should return an error for unexpected fields', () => {
    const schema = { name: 'string' };
    const obj = { name: 'John', age: 30 };

    const result = validateObject(obj, schema);
    expect(result).toEqual([{ field: 'age', error: 'Field is not expected' }]);
  });

  it('should validate multiple errors in the same object', () => {
    const schema = { name: 'string', age: 'number' };
    const obj = { name: 123, age: 'thirty', extraField: 'unexpected' };

    const result = validateObject(obj, schema);
    expect(result).toEqual([
      { field: 'name', error: "Expected type 'string', but got 'number'" },
      { field: 'age', error: "Expected type 'number', but got 'string'" },
      { field: 'extraField', error: 'Field is not expected' },
    ]);
  });
});
