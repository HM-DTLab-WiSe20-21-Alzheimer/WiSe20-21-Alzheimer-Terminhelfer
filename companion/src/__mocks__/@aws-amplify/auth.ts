export const AuthOptions = {
  loggedIn: true,
  error: false,
  restore: () => {
    AuthOptions.loggedIn = true;
    AuthOptions.error = false;
  },
};

export const Auth = {
  currentUserInfo: jest.fn(() => {

    if (AuthOptions.error) {
      return Promise.reject({
        message: 'Fail',
      });
    }

    return Promise.resolve(
      AuthOptions.loggedIn
        ? {
          username: 'maxmuster',
          attributes: {
            name: 'Max Mustermann',
            'custom:linkid': '12345',
          },
        }
        : null,
    );

  }),

  signIn: jest.fn((username) => {
    if (AuthOptions.error) {
      return Promise.reject({
        message: 'Fail',
        name: 'FAIL',
      });
    }

    return Promise.resolve({
      username,
      attributes: {
        name: 'Max Mustermann',
        'custom:linkid': '12345',
      },
    });
  }),

  signUp: jest.fn((username, password, attributes) => {
    if (AuthOptions.error) {
      return Promise.reject({
        message: 'Fail',
      });
    }

    return Promise.resolve(() => ({
      username,
      attributes: {
        name: attributes.name,
      },
    }));
  }),

  signOut: jest.fn(() => {
    if (AuthOptions.error) {
      return Promise.reject({
        message: 'Fail',
      });
    }

    return Promise.resolve();
  }),

  confirmSignUp: jest.fn(() => {
    if (AuthOptions.error) {
      return Promise.reject({
        message: 'Fail',
      });
    }

    return Promise.resolve();
  }),

  updateUserAttributes: jest.fn(() => {
    if (AuthOptions.error) {
      return Promise.reject({
        name: 'FAIL',
      });
    }

    return Promise.resolve({});
  }),

  currentAuthenticatedUser: () => {
    return Promise.resolve({});
  },
};
