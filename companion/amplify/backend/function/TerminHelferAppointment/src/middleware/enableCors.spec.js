const enableCors = require("./enableCors");

describe("should run enableCors", () => {
  const mockResponse = () => ({
    header: jest.fn((name, value) => null),
  });

  const mockNext = () => jest.fn();

  it("should execute", () => {
    // arrange
    const next = mockNext();
    // act
    enableCors(undefined, mockResponse(), next);
    // assert
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should set Access-Control-Allow-Origin header", () => {
    // arrange
    const response = mockResponse();
    // act
    enableCors(undefined, response, mockNext());
    // assert
    expect(response.header).toHaveBeenCalledTimes(2);
    expect(response.header).toHaveBeenCalledWith("Access-Control-Allow-Origin", "*");
  });

  it("should set Access-Control-Allow-Headers header", () => {
    // arrange
    const response = mockResponse();
    // act
    enableCors(undefined, response, mockNext());
    // assert
    expect(response.header).toHaveBeenCalledTimes(2);
    expect(response.header).toHaveBeenCalledWith("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  });
});
