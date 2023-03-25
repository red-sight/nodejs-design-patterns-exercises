import chai from "chai";
import ProxiedAxios from "../8/1";

chai.should();

describe("8.1 - proxy for axios with cache", function () {
  let proxiedAxiosInstance;
  let googleRes;
  const url = "https://google.com";

  before(() => {
    proxiedAxiosInstance = new ProxiedAxios();
  });

  it("first response should not be cached", async function () {
    const res = await proxiedAxiosInstance.get(url);
    res.should.be.a("object").and.have.keys("res", "cached", "url");
    res.cached.should.equal(false);
    res.url.should.equal(url);

    googleRes = res.res;
  });

  it("second response should return cached data", async function () {
    const res = await proxiedAxiosInstance.get(url);
    res.should.be.a("object").and.have.keys("res", "cached", "url");
    res.cached.should.equal(true);
    res.url.should.equal(url);
    res.res.should.equal(googleRes);
  });
});
