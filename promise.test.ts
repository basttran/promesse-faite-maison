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

class Promesse {
  private result: any;
  status: string = "pending";
  todos: any[] = [];

  constructor(initTask: (resolve: any, reject?: any) => any) {
    initTask((result: any) => {
      if (result?.then) {
        result.then((value: any) => {
          this.status = "resolved";
          this.result = value;
          this.todos.forEach((handle) => handle(value));
        });
      } else {
        this.status = "resolved";
        this.result = result;
        this.todos.forEach((handle) => handle(result));
      }
    });
  }

  then = (onFulfilled: (value: any) => any): Promesse => {
    if (this.status === "resolved") {
      return new Promesse((resolve) => resolve(onFulfilled(this.result)));
    }

    return new Promesse((resolve) =>
      this.todos.push((result) => resolve(onFulfilled(result)))
    );
  };
}
