class Promesse {
  private result: any;

  constructor(initTask: (resolve: any, reject?: any) => any) {
    initTask((result) => {
      if (result?.then) {
        result.then((value) => {
          this.result = value;
        });
      } else {
        this.result = result;
      }
    });
  }

  then = (onFulfilled: (value: any) => any): Promesse =>
    new Promesse((resolve) => resolve(onFulfilled(this.result)));
}

describe("Promise from scratch", () => {
  it("should give back result when task was successful", async () => {
    // given
    const someValue = Math.random();
    const happyPathPromise = new Promesse((resolve) => {
      resolve(someValue);
    });
    // when
    const result = await happyPathPromise;
    // then
    expect(result).toEqual(someValue);
  });

  it("should be chainable (like map)", async () => {
    // given
    const happyPathPromise = new Promesse((resolve) => {
      resolve(42);
    });
    // when
    const result = await happyPathPromise
      .then((value) => value * 2)
      .then((value) => value * 2);
    // then
    expect(result).toEqual(168);
  });

  it("should be chainable (like flatMap)", async () => {
    // given
    const happyPathPromise = new Promesse((resolve) => {
      resolve(42);
    });
    // when
    const result = await happyPathPromise
      .then((value) => new Promesse((resolve) => resolve(value * 2)))
      .then((value) => value * 2);
    // then
    expect(result).toEqual(168);
  });

  it("should be chainable even when pending", async () => {
    // given
    const happyPathPromise = new Promesse((resolve) => {
      resolve(42);
    });
    // when
    const result = await happyPathPromise
      .then(
        (value) =>
          new Promesse((resolve) => setTimeout(() => resolve(value * 2), 100))
      )
      .then((value) => value * 2);
    // then
    expect(result).toEqual(168);
  });
});
