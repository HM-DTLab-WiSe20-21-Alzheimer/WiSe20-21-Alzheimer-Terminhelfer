const app = require("./app");

describe("should create app", () => {
  it("should create express app", () => {
    expect(app).toBeDefined();
  });

  describe("should create paths", () => {
    const extractRoutes = (expressApp) => {
      return expressApp._router.stack
        .filter(layer => layer.route)
        .map(layer => layer.route);
    };

    it("should create all paths", () => {
      // arrange
      // act
      const routes = extractRoutes(app);
      const amountRoutes = routes.length;

      // assert
      expect(amountRoutes).toBe(4);
    });

    it("should create all appointments route", () => {
      // arrange
      // act
      const routes = extractRoutes(app);
      const appointmentAllRoute = routes.filter(route => route.path === "/appointment")[0];

      // assert
      expect(appointmentAllRoute).toBeDefined();
      expect(appointmentAllRoute.methods.get).toBeTruthy();
    });

    it("should create next appointment route", () => {
      // arrange
      // act
      const routes = extractRoutes(app);
      const appointmentNextRoute = routes.filter(route => route.path === "/appointment/next")[0];

      // assert
      expect(appointmentNextRoute).toBeDefined();
      expect(appointmentNextRoute.methods.get).toBeTruthy();
    });

    it("should create appointment route", () => {
      // arrange
      // act
      const routes = extractRoutes(app);
      const appointmentRoute = routes.filter(route => route.path === "/appointment/:id")[0];

      // assert
      expect(appointmentRoute).toBeDefined();
      expect(appointmentRoute.methods.get).toBeTruthy();
    });

    it("should create location route", () => {
      // arrange
      // act
      const routes = extractRoutes(app);
      const appointmentRoute = routes.filter(route => route.path === "/location")[0];

      // assert
      expect(appointmentRoute).toBeDefined();
      expect(appointmentRoute.methods.get).toBeTruthy();
    });
  });

  describe("should use middleware", () => {
    const extractMiddleware = (expressApp) => {
      return expressApp._router.stack
        .filter(layer => !layer.route);
    };

    it("should use cors middleware", () => {
      // arrange
      // act
      const middleware = extractMiddleware(app);
      const corsMiddleware = middleware.filter(middleware => middleware.name === "enableCors")[0];

      // assert
      expect(corsMiddleware).toBeDefined();
    });

    it("should use aws middleware", () => {
      // arrange
      // act
      const middleware = extractMiddleware(app);
      const awsMiddleware = middleware.filter(middleware => middleware.name === "apiGatewayEventParser")[0];

      // assert
      expect(awsMiddleware).toBeDefined();
    });

    it("should use body parser middleware", () => {
      // arrange
      // act
      const middleware = extractMiddleware(app);
      const bodyParserMiddleware = middleware.filter(middleware => middleware.name === "jsonParser")[0];

      // assert
      expect(bodyParserMiddleware).toBeDefined();
    });

    it("should use body injectUser middleware", () => {
      // arrange
      // act
      const middleware = extractMiddleware(app);
      const injectUserMiddleware = middleware.filter(middleware => middleware.name === "injectUser")[0];

      // assert
      expect(injectUserMiddleware).toBeDefined();
    });

    it("should use body injectAlexaUId middleware", () => {
      // arrange
      // act
      const middleware = extractMiddleware(app);
      const injectAlexaUIdMiddleware = middleware.filter(middleware => middleware.name === "injectAlexaUId")[0];

      // assert
      expect(injectAlexaUIdMiddleware).toBeDefined();
    });
  });
});
