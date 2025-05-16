import { describe, it, expect } from 'vitest';
import { get, set, del, isEquals } from '../../src/utils/Object';

describe('Object Utils', () => {
  describe('get function', () => {
    it('should get a value from a simple object path', () => {
      const obj = { name: 'John', age: 30 };
      expect(get(obj, 'name')).toBe('John');
      expect(get(obj, 'age')).toBe(30);
    });

    it('should get a value from a nested object path', () => {
      const obj = {
        user: {
          name: 'John',
          address: {
            city: 'New York',
            zip: '10001'
          }
        }
      };
      expect(get(obj, 'user.name')).toBe('John');
      expect(get(obj, 'user.address.city')).toBe('New York');
      expect(get(obj, 'user.address.zip')).toBe('10001');
    });

    it('should return undefined for non-existent paths', () => {
      const obj = { name: 'John' };
      expect(get(obj, 'age')).toBeUndefined();
      expect(get(obj, 'address.city')).toBeUndefined();
    });

    it('should handle arrays in the path', () => {
      const obj = {
        users: [
          { name: 'John' },
          { name: 'Jane' }
        ]
      };
      expect(get(obj, 'users.0.name')).toBe('John');
      expect(get(obj, 'users.1.name')).toBe('Jane');
    });
  });

  describe('set function', () => {
    it('should set a value in a simple object path', () => {
      const obj: Record<string, any> = { name: 'John' };
      const result = set(obj, 'age', 30);
      console.log(result);
      expect(result.age).toBe(30);
    });

    it('should set a value in a nested object path', () => {
      const obj = {
        user: {
          name: 'John',
          address: {} as Record<string, any>
        }
      };
      set(obj, 'user.address.city', 'New York');
      expect(obj.user.address.city).toBe('New York');
    });

    it('should set object if parent path does not exist', () => {
      let obj = { name: 'John' } as Record<string, any>;
      obj = set(obj, 'address.city', 'New York');
      expect(obj).toEqual({ name: 'John', address: { city: 'New York' } });
    });

    it('should return the modified object', () => {
      const obj: Record<string, any> = { name: 'John' };
      const result = set(obj, 'age', 30);
      expect(result).toBe(obj);
    });
  });

  describe('del function', () => {
    it('should delete a property from an object', () => {
      const obj = { name: 'John', age: 30 };
      del(obj, 'age');
      expect(obj).toEqual({ name: 'John' });
    });

    it('should delete a nested property from an object', () => {
      const obj = {
        user: {
          name: 'John',
          address: {
            city: 'New York',
            zip: '10001'
          }
        }
      };
      del(obj, 'user.address.zip');
      expect(obj.user.address).toEqual({ city: 'New York' });
    });

    it('should not modify object if parent path does not exist', () => {
      const obj = { name: 'John' };
      del(obj, 'address.city');
      expect(obj).toEqual({ name: 'John' });
    });

    it('should return the modified object', () => {
      const obj = { name: 'John', age: 30 };
      const result = del(obj, 'age');
      expect(result).toBe(obj);
    });
  });

  describe('isEquals function', () => {
    it('should return true for identical primitive values', () => {
      expect(isEquals(5, 5)).toBe(true);
      expect(isEquals('hello', 'hello')).toBe(true);
      expect(isEquals(true, true)).toBe(true);
      expect(isEquals(null, null)).toBe(true);
    });

    it('should return false for different primitive values', () => {
      expect(isEquals(5, 10)).toBe(false);
      expect(isEquals('hello', 'world')).toBe(false);
      expect(isEquals(true, false)).toBe(false);
      expect(isEquals(null, undefined)).toBe(false);
    });

    it('should return true for identical objects', () => {
      const obj1 = { name: 'John', age: 30 };
      const obj2 = { name: 'John', age: 30 };
      expect(isEquals(obj1, obj2)).toBe(true);
    });

    it('should return false for different objects', () => {
      const obj1 = { name: 'John', age: 30 };
      const obj2 = { name: 'Jane', age: 30 };
      expect(isEquals(obj1, obj2)).toBe(false);
    });

    it('should return true for identical nested objects', () => {
      const obj1 = {
        user: {
          name: 'John',
          address: {
            city: 'New York'
          }
        }
      };
      const obj2 = {
        user: {
          name: 'John',
          address: {
            city: 'New York'
          }
        }
      };
      expect(isEquals(obj1, obj2)).toBe(true);
    });

    it('should return false for different nested objects', () => {
      const obj1 = {
        user: {
          name: 'John',
          address: {
            city: 'New York'
          }
        }
      };
      const obj2 = {
        user: {
          name: 'John',
          address: {
            city: 'Boston'
          }
        }
      };
      expect(isEquals(obj1, obj2)).toBe(false);
    });

    it('should handle arrays correctly', () => {
      expect(isEquals([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEquals([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isEquals([1, 2, 3], [1, 2])).toBe(false);
    });
  });
}); 