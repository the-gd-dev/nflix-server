const isAuthenticated = require("../middlewares/auth");
const expect = require("chai").expect;
it("should throw an error if not authorization header is present", function () {
  const req = {
    headers: {
      "x-access-token": null,
    },
    body: {
      token: null,
    },
    query: {
      token: null,
    },
  };
  expect(isAuthenticated.bind(this, req, {}, () => {})).to.throw(
    "Not authenticated."
  );
});
