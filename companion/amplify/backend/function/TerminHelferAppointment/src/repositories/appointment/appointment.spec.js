const appointment = require("./appointment");

it("should create appointment repository", () => {
  // assert
  expect(appointment).toBeDefined();
});

describe("should get appointments", () => {
  it("should have get method", () => {
    // arrange
    const get = appointment.get;
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
    await appointment.get(alexaUId);

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
      },
    ];

    // act
    const appointments = await appointment.get(alexaUId);

    // assert
    expect(appointments.length).toEqual(1);
    expect(appointments).toEqual(want);

    // Finish async test
    done();
  });

  it("should get nothing if no appointments", async (done) => {
    // arrange
    const alexaUId = "2345";

    // act
    const appointments = await appointment.get(alexaUId);

    // assert
    expect(appointments.length).toEqual(0);

    // Finish async test
    done();
  });
});

describe("should filter for date", () => {
  it("should have filterDate", () => {
    // arrange
    const filterDate = appointment.filterDate;

    // assert
    expect(filterDate).toBeDefined();
  });

  it("should accept same datetime", () => {
    // arrange
    const dateTime ="2020-12-24T15:00:00+01:00";
    const appointmentIn = {
      M: {
        dateTime: {
          S: dateTime,
        },
      },
    };
    const filterDate = appointment.filterDate(dateTime);

    // act
    const isSameDate = filterDate(appointmentIn);

    // assert
    expect(isSameDate).toBeTruthy();
  });

  it("should accept same date", () => {
    // arrange
    const dateTime = "2020-12-24T15:00:00+01:00";
    const appointmentIn = {
      M: {
        dateTime: {
          S: "2020-12-24T18:00:00+01:00",
        },
      },
    };
    const filterDate = appointment.filterDate(dateTime);

    // act
    const isSameDate = filterDate(appointmentIn);

    // assert
    expect(isSameDate).toBeTruthy();
  });

  it("should not accept different date with same time", () => {
    // arrange
    const dateTime = "2020-12-24T15:00:00+01:00";
    const appointmentIn = {
      M: {
        dateTime: {
          S: "2020-12-23T15:00:00+01:00",
        },
      },
    };
    const filterDate = appointment.filterDate(dateTime);

    // act
    const isSameDate = filterDate(appointmentIn);

    // assert
    expect(isSameDate).toBeFalsy();
  });

  it("should not accept different date with different time", () => {
    // arrange
    const dateTime = "2020-12-24T15:00:00+01:00";
    const appointmentIn = {
      M: {
        dateTime: {
          S: "2020-12-23T18:00:00+01:00",
        },
      },
    };
    const filterDate = appointment.filterDate(dateTime);

    // act
    const isSameDate = filterDate(appointmentIn);

    // assert
    expect(isSameDate).toBeFalsy();
  });

  it("should not accept different month", () => {
    // arrange
    const dateTime = "2020-11-24T15:00:00+01:00";
    const appointmentIn = {
      M: {
        dateTime: {
          S: "2020-12-24T15:00:00+01:00",
        },
      },
    };
    const filterDate = appointment.filterDate(dateTime);

    // act
    const isSameDate = filterDate(appointmentIn);

    // assert
    expect(isSameDate).toBeFalsy();
  });

  it("should not accept different year", () => {
    // arrange
    const dateTime = "2019-12-24T15:00:00+01:00";
    const appointmentIn = {
      M: {
        dateTime: {
          S: "2020-12-24T15:00:00+01:00",
        },
      },
    };
    const filterDate = appointment.filterDate(dateTime);

    // act
    const isSameDate = filterDate(appointmentIn);

    // assert
    expect(isSameDate).toBeFalsy();
  });
});

describe("should filter for datetime", () => {
  it("should accept same datetime", () => {
    // arrange
    const dateTime = "2020-12-24T15:00:00+01:00";
    const appointmentIn = {
      M: {
        dateTime: {
          S: "2020-12-24T15:00:00+01:00",
        },
      },
    };
    const filterDateTime = appointment.filterDateTime(dateTime);

    // act
    const isSameDateTime = filterDateTime(appointmentIn);

    // assert
    expect(isSameDateTime).toBeTruthy();
  });

  it("should not accept different datetime", () => {
    // arrange
    const dateTime = "2019-12-24T15:00:00+01:00";
    const appointmentIn = {
      M: {
        dateTime: {
          S: "2019-12-23T15:00:00+01:00",
        },
      },
    };
    const filterDateTime = appointment.filterDateTime(dateTime);

    // act
    const isSameDateTime = filterDateTime(appointmentIn);

    // assert
    expect(isSameDateTime).toBeFalsy();
  });
});

describe("should sort by date", () => {
  it("should sort same", () => {
    // arrange
    const datesIn = [
      {
        M: {
          dateTime: {
            S: "2020-12-24T15:00:00+01:00",
          },
        },
      },
      {
        M: {
          dateTime: {
            S: "2020-12-24T15:00:00+01:00",
          },
        },
      },
    ];
    // act
    const have = datesIn.sort(appointment.sortByDate());
    // assert
    expect(+have[0].M.dateTime.S).toEqual(+have[1].M.dateTime.S);
  });

  it("should sort sorted", () => {
    // arrange
    const datesIn = [
      {
        M: {
          dateTime: {
            S: "2020-12-24T15:00:00+01:00",
          },
        },
      },
      {
        M: {
          dateTime: {
            S: "2020-12-25T15:00:00+01:00",
          },
        },
      },
    ];
    // act
    const have = datesIn.sort(appointment.sortByDate());
    // assert
    expect(+new Date(have[0].M.dateTime.S)).toBeLessThan(+new Date(have[1].M.dateTime.S));
  });

  it("should sort not sorted", () => {
    // arrange
    const datesIn = [
      {
        M: {
          dateTime: {
            S: "2020-12-25T15:00:00+01:00",
          },
        },
      },
      {
        M: {
          dateTime: {
            S: "2020-12-24T15:00:00+01:00",
          },
        },
      },
    ];
    // act
    const have = datesIn.sort(appointment.sortByDate());
    // assert
    expect(+new Date(have[0].M.dateTime.S)).toBeLessThan(+new Date(have[1].M.dateTime.S));
  });
});
