const all = require("./all");

describe("should run all route", () => {
  const mockRequest = (date) => ({
    query: {
      date,
    },
    alexaUId: "1234",
    url: "/appointment/",
  });

  const mockResult = () => ({
    json: jest.fn((content) => null),
  });

  it("should fetch all appointments", async (done) => {
    // arrange
    const req = mockRequest("2020-12-24T15:00:00+01:00");
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
        dateTime: {
          S: "2020-12-24T15:00:00+01:00",
        },
        location: {
          M: {
            name: { S: "nodejs" },
            hausnr: { S: "1" },
            plz: { S: "12345" },
            stadt: { S: "v8" },
            strasse: { S: "v8str" },
            transport: { S: "car" },
          },
        },
        title: {
          S: "jest",
        },
        transport: {
          S: "car",
        },
        id: {
          S: "123",
        },
      },
    }));

    // Finish test
    done();
  });

  it("should fetch no appointments", async (done) => {
    // arrange
    const req = mockRequest("2020-12-23T15:00:00+01:00");
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
