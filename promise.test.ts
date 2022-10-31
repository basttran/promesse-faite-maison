class Promesse {

  private result: any;
 
  constructor(initTask: (resolve: any, reject?: any) => any) {
    initTask((result) => {
      this.result = result;
    });
  }

  then = (onFulfilled: (value: any) => any) => onFulfilled(this.result);

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
 
});
