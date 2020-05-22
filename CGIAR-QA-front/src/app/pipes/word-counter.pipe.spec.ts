import { WordCounterPipe } from './word-counter.pipe';

describe('WordCounterPipe', () => {
  it('create an instance', () => {
    const pipe = new WordCounterPipe();
    expect(pipe).toBeTruthy();
  });
});
