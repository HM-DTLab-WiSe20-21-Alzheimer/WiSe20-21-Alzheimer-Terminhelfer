const injectAlexaUId = require("./injectAlexaUId");

describe("should run injectAlexaUId", () => {

  const mockResponse = () => ({
    json: jest.fn((body) => {
    }),
  });

  const mockRequest = (linkId) => {
    let attributes = [];

    if (linkId) {
      attributes.push({
        Name: "custom:linkid",
        Value: linkId,
      });
    }

    return {
      user: {
        Attributes: attributes,
      },
    };
  };

  const mockNext = () => jest.fn(() => null);

  it("should do nothing if no link attribute is given", async () => {
    // arrange
    const req = mockRequest(undefined);
    const res = mockResponse();
    const next = mockNext();

    // act
    await injectAlexaUId(req, res, next);

    const alexaUId = req.alexaUId;

    // assert
    expect(alexaUId).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(0);
  });

  it("should inject alexaUId", async () => {
    // arrange
    const linkId = "1234";
    const req = mockRequest(linkId);
    const res = mockResponse();
    const next = mockNext();

    // act
    await injectAlexaUId(req, res, next);

    const alexaUId = req.alexaUId;

    // assert
    expect(alexaUId).toEqual(linkId);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(0);
  });

  it("should return error 500 if linkId is not in table", async () => {
    // arrange
    const linkId = "2345";
    const req = mockRequest(linkId);
    const res = mockResponse();
    const next = mockNext();

    // act
    await injectAlexaUId(req, res, next);

    const alexaUId = req.alexaUId;

    // assert
    expect(alexaUId).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(0);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 500,
    }));
  });

});
