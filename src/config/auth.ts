export default {
  jwt: {
    secret: process.env.APP_SECRET || 'testing-environment-secret-key',
    expiresIn: '1d',
  },
};
