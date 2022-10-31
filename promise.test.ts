class Promesse {
 
  constructor(initTask: (resolve: any, reject?: any) => any) {
   
  }

}

describe("Promise from scratch", () => {
  it("should give back result when task was successful", async () => {
    // given
    const happyPathPromise = new Promesse((resolve) => {
      resolve(42);
    });
    // when
    const result = await happyPathPromise;
    // then
    expect(result).toEqual(42);
  });
 
});
