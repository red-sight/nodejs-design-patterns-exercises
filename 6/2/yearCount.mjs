import { Transform } from "stream";

export class yearCount extends Transform {
  constructor(options = {}) {
    options.objectMode = true;
    super(options);
    this.years = [];
    this.count = function ({ year, value }) {
      const index = this.years.findIndex((y) => y.year === year);
      if (index === -1) {
        this.years.push({ year, value });
        this.years.sort((a, b) => b.year - a.year);
      } else this.years[index].value += value;
    };
  }

  _transform(record, enc, cb) {
    this.count(record);
    cb();
  }

  _flush(cb) {
    this.years.sort((a, b) => b.value - a.value);
    this.push("1. Did the number of crimes go up or down over the years?");
    this.push(this.years);
    cb();
  }
}
