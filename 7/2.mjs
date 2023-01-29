import { request } from "http";
import { Http2ServerRequest } from "http2";

class UrlBuilder {
  setMethod(method) {
    if (!this.options) this.options = {};
    this.options.method = method;
    return this;
  }

  setURL(url, path = "") {
    this.options.host = url;
    this.options.path = path;
    return this;
  }

  setQuery(searchParams) {
    let query = "?";
    Object.keys(searchParams).forEach((key) => {
      query += key + "=" + searchParams[key] + "&";
    });
    this.options.path += query;
    return this;
  }

  setHeaders(headers) {
    this.options.headers = headers;
    return this;
  }

  setBody(body) {
    this.body = JSON.stringify(body);
    return this;
  }

  invoke() {
    console.log(this.options);
    return new Promise((resolve, reject) => {
      let chunks = "";
      const req = request(this.options, (res) => {
        res.on("data", (chunk) => {
          chunks += chunk;
        });
        res.on("end", () => {
          resolve(chunks);
        });
        res.on("error", (err) => {
          reject(err);
        });
      });
      req.write(this.body);
      req.end();
    });
  }
}

(async function main() {
  const data = await new UrlBuilder()
    .setMethod("post")
    .setURL("google.com")
    .setQuery({ search: "me" })
    .setHeaders({ "content-type": "application/json" })
    .setBody({ some: "data" })
    .invoke();
  console.log("Received:", data);
})();
