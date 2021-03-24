const injectUser = require("./injectUser");

describe("should run injectUser", () => {
  const mockResponse = () => ({});

  const mockRequest = (userId) => ({
    apiGateway: {
      event: {
        requestContext: {
          identity: {
            cognitoAuthenticationProvider: `cognito-idp.eu-central-1.amazonaws.com/eu-central-1_123456789,cognito-idp.eu-central-1.amazonaws.com/eu-central-1_123456789:CognitoSignIn:${userId}`,
          },
        },
      },
    },
  });

  const mockNext = () => jest.fn(() => null);

  it("should not inject user if no valid user is given", async () => {
    // arrange
    const req = mockRequest("2345");
    const res = mockResponse();
    const next = mockNext();

    // act
    await injectUser(req, res, next);

    const user = req.user;

    // assert
    expect(user).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it("should inject user", async () => {
    // arrange
    const userId = "1234";
    const req = mockRequest(userId);
    const res = mockResponse();
    const next = mockNext();

    // act
    await injectUser(req, res, next);

    const user = req.user;

    // assert
    expect(user).toBeDefined();
    expect(user.Attributes.length).toEqual(1);
    expect(user.Attributes[0].Value).toEqual(userId);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it("should fail on list fail", async () => {
    // arrange
    const userId = "fail";
    const req = mockRequest(userId);
    const res = mockResponse();
    const next = mockNext();

    // act
    let exception;

    await injectUser(req, res, next);

    const user = req.user;

    // assert
    expect(user).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.anything());
  });
});
