const detail = require("./detail");

describe("should run detail route", () => {
  const mockRequest = (id) => ({
    params: {
      id,
    },
    alexaUId: "1234",
    url: `/appointment/${id}`,
  });

  const mockResult = () => ({
    json: jest.fn((content) => null),
  });

  it("should return appointment detail", async (done) => {
    // arrange
    const req = mockRequest("123");
    const res = mockResult();

    // act
    await detail(req, res);

    // assert
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 200,
      url: req.url,
    }));
    expect(JSON.parse(res.json.mock.calls[0][0].body))
      .toEqual(expect.objectContaining({
        M: {
          id: {
            S: "123",
          },
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
        },
      }));

    // Finish async test
    done();
  });

  it("should return 404 if not found", async (done) => {
    // arrange
    const req = mockRequest("234");
    const res = mockResult();

    // act
    await detail(req, res);

    // assert
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 404,
      url: req.url,
    }));

    // Finish async test
    done();
  });
});
