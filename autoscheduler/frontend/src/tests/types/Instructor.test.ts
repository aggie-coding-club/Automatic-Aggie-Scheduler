import Instructor from '../../types/Instructor';
import { Indexable, fetchMock } from '../util';

const createInstructor = jest.fn((args) => new Instructor(fetchMock(args)));
const correctArgs: Indexable = {
  name: 'Aakash Tyagi',
};

test('Instructor accepts correct arguments', () => {
  // arrange is done above

  // act
  createInstructor(correctArgs);

  // assert
  expect(createInstructor).toReturn();
});

// test null values for all properties
const nonNullableProps = ['name'];
test.each(nonNullableProps)('Instructor rejects null %s', (prop) => {
  // arrange
  const badArgs = { ...correctArgs };
  badArgs[prop] = null;

  // act and assert
  expect(() => createInstructor(badArgs)).toThrow();
});

// test undefined/missing values for all properties
test.each(Object.keys(correctArgs))('Instructor rejects undefined %s', (prop) => {
  // arrange
  const badArgs = { ...correctArgs };
  badArgs[prop] = undefined;

  // act and assert
  expect(() => createInstructor(badArgs)).toThrow();
});
