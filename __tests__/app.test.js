const letterCount = require('../src/client/js/helper');

describe('Testing functionality', () => {
  test('letterCount works with regular strings', () => {
    expect(letterCount('awesome', 'e')).toBe(2);
  });
});
