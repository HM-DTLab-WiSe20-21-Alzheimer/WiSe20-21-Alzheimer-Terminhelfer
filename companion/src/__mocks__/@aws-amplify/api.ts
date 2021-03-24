import * as dayjs from 'dayjs';

const location = {
  M: {
    name: { S: 'test' },
    coordinates: { S: '48.1559366,11.5243933' },
    strasse: { S: 'bar' },
    hausnr: { S: '42' },
    stadt: { S: 'foo' },
    plz: { S: '12345' },
    transport: { S: 'auto' },
  },
};

const appointment = {
  M: {
    dateTime: { S: dayjs().format() },
    location,
    title: { S: 'test' },
    id: { S: '123456789' },
    transport: { S: 'auto' },
  },
};


export const API = {
  get: jest.fn((apiName, path) => {
    // Location
    if (apiName === 'location' && path === '/location') {
      return Promise.resolve({
        body: JSON.stringify(
          [location],
        ),
      });
    }

    // Appointment

    if (apiName === 'TerminHelferAppointment') {

      if (path === '/appointment') {
        return Promise.resolve({
          body: JSON.stringify([appointment]),
        });
      }

      if (path === '/appointment/next') {
        return Promise.resolve({
          body: JSON.stringify(appointment),
        });
      }

      if (path === '/appointment/1234') {
        return Promise.resolve({
          body: JSON.stringify(appointment),
        });
      }

    }


    return Promise.reject({ body: JSON.stringify({ message: 'Not found' }) });
  }),
};
