import { Transform } from "stream";

export class dangerAreas extends Transform {
  constructor(options = {}) {
    options.objectMode = true;
    super(options);
    this.areas = [];
    this.count = function ({ borough, value }) {
      const index = this.areas.findIndex((a) => a.borough === borough);
      if (index === -1) this.areas.push({ borough, value });
      else this.areas[index].value += value;
    };
  }

  _transform(record, enc, cb) {
    this.count(record);
    cb();
  }

  _flush(cb) {
    this.areas.sort((a, b) => b.value - a.value);
    this.push("2. What are the most dangerous areas of London?");
    this.push(this.areas);
    cb();
  }
}
