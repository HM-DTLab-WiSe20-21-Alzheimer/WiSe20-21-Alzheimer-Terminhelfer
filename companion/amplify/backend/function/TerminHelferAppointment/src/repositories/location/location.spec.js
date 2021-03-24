const location = require("./location");

it("should create location repository", () => {
  // assert
  expect(location).toBeDefined();
});

describe("should get locations", () => {
  it("should have get method", () => {
    // arrange
    const get = location.get;
    // assert
    expect(get).toBeDefined();
  });

  it("should query correct data", async (done) => {
    const dynamoDB = new (require("aws-sdk").DynamoDB)();

    // arrange
    const alexaUId = "1234";
    const want = {
      TableName: "TerminHelfer",
      ExpressionAttributeValues: {
        ":alexaid": {
          S: alexaUId,
        },
      },
      KeyConditionExpression: "id = :alexaid",
    };

    // act
    await location.get(alexaUId);

    // assert
    expect(dynamoDB.query).toHaveBeenCalledTimes(1);
    expect(dynamoDB.query).toHaveBeenCalledWith(want);

    // Finish async test
    done();
  });

  it("should get correct data", async (done) => {
    // arrange
    const alexaUId = "1234";
    const want = [
      {
        M: {
          hausnr: { S: "1" },
          plz: { S: "12345" },
          stadt: { S: "v8" },
          strasse: { S: "v8str" },
          transport: { S: "car" },
          name: { S: "nodejs" },
        },
      },
    ];

    // act
    const appointments = await location.get(alexaUId);

    // assert
    expect(appointments.length).toEqual(1);
    expect(appointments).toEqual(want);

    // Finish async test
    done();
  });

  it("should get nothing if no locations", async (done) => {
    // arrange
    const alexaUId = "2345";

    // act
    const appointments = await location.get(alexaUId);

    // assert
    expect(appointments.length).toEqual(0);

    // Finish async test
    done();
  });
});
