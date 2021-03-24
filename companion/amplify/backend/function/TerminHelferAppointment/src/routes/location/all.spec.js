const all = require("./all");

describe("should run all route", () => {
  const mockRequest = (alexaUId) => ({
    alexaUId,
    url: "/location/",
  });

  const mockResult = () => ({
    json: jest.fn((content) => null),
  });

  it("should fetch all locations", async (done) => {
    // arrange
    const req = mockRequest("1234");
    const res = mockResult();

    // act
    await all(req, res);

    // assert
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 200,
      url: req.url,
    }));

    expect(JSON.parse(res.json.mock.calls[0][0].body)[0]).toEqual(expect.objectContaining({
      M: {
        hausnr: { S: "1" },
        plz: { S: "12345" },
        stadt: { S: "v8" },
        strasse: { S: "v8str" },
        transport: { S: "car" },
        name: { S: "nodejs" },
      },
    }));

    // Finish test
    done();
  });

  it("should fetch no locations", async (done) => {
    // arrange
    const req = mockRequest("2345");
    const res = mockResult();

    // act
    await all(req, res);

    // assert
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 200,
      url: req.url,
      body: JSON.stringify([]),
    }));

    // Finish test
    done();
  });

  it("should not fail without query", async (done) => {
    // arrange
    const req = mockRequest(undefined);
    const res = mockResult();

    // act
    await all(req, res);

    // assert
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 200,
      url: req.url,
      body: JSON.stringify([]),
    }));

    // Finish test
    done();
  });
});
