const link = require("./link");

// arrange
// act
// assert

it("should create link repository", () => {
  // assert
  expect(link).toBeDefined();
});

describe("should get links", () => {

  it("should have get method", () => {
    // arrange
    const get = link.get;
    // assert
    expect(get).toBeDefined();
  });

  it("should query correct data", async (done) => {
    const dynamoDB = new (require("aws-sdk").DynamoDB)();

    // arrange
    const linkId = "1234";
    const want = {
      TableName: "TerminHelferCompanionLinkIntent",
      ExpressionAttributeValues: {
        ":link": {
          S: linkId,
        },
      },
      KeyConditionExpression: "linkid = :link",
    };

    // act
    await link.get(linkId);

    // assert
    expect(dynamoDB.query).toHaveBeenCalledTimes(1);
    expect(dynamoDB.query).toHaveBeenCalledWith(want);

    // Finish async test
    done();
  });

  it("should get correct data", async (done) => {
    // arrange
    const linkId = "1234";
    const want = linkId;

    // act
    const alexaUId = await link.get(linkId);

    // assert
    expect(alexaUId).toEqual(want);

    // Finish async test
    done();
  });

  it("should throw exception if link is not in table", async (done) => {
    // arrange
    const linkId = "2345";

    // act
    let exceptionThrown;
    try {
      await link.get(linkId);
    } catch (e) {
      exceptionThrown = e;
    }

    // assert
    expect(exceptionThrown).toBeDefined();

    // Finish async test
    done();
  });

});
