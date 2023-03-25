/* 8.1 HTTP client cache: Write a proxy for your favorite HTTP client library
that caches the response of a given HTTP request, so that if you make
the same request again, the response is immediately returned from the
local cache, rather than being fetched from the remote URL. If you need
inspiration, you can check out the superagent-cache module (nodejsdp.
link/superagent-cache). */

import axios from "axios";

class Cache {
  constructor() {
    this.cache = [];
  }

  have(url) {
    return this.cache.find((i) => i.url === url);
  }

  add(url, res) {
    this.cache.push({ url, res, cached: true });
  }
}

export default class ProxiedAxios {
  constructor() {
    this.axios = axios;
    this.cache = new Cache();
  }

  async get(url) {
    const cached = this.cache.have(url);
    if (cached) return cached;
    const res = await axios.get(url);
    this.cache.add(url, res);
    return { url, res, cached: false };
  }
}
