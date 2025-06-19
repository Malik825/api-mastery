import { noProfanity } from './profanity.validator'

describe('Profanity', () => {
  it('should create an instance', () => {
    expect(noProfanity).toBeTruthy();
  });
});
