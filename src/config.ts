export default {
  db: {
    user: null,
    pass: null,
    host: "localhost",
    port: "27017",
    database: "testdb",
    authSource: null,
  },
  host: {
    url: "localhost",
    port: "3000",
  },
  jwt: {
    secretOrKey: "secret",
    expiresIn: 36000000,
  },
  mail: {
    host: "smtp.mailgun.org",
    port: "587",
    secure: false,
    user: "postmaster@sandboxa1696d63603146bca752bd634e4392b0.mailgun.org",
    pass: "cced296ef54947e7b40028014a04ae2a-0f472795-9d8efe34",
  },
};
