const next = require("./next");

describe("should run detail route", () => {
  const mockRequest = () => ({
    alexaUId: "1234",
    url: `/appointment/next`,
  });

  const mockResult = () => ({
    json: jest.fn((content) => null),
  });

  it("should return no next appointment", async (done) => {
    // arrange
    const req = mockRequest();
    const res = mockResult();

    // act
    await next(req, res);

    // assert
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 200,
      url: req.url,
      body: JSON.stringify(undefined),
    }));

    // Finish async test
    done();
  });
});
