import { Transform } from "stream";

export class leastCommonCrime extends Transform {
  constructor(options = {}) {
    options.objectMode = true;
    super(options);
    this.categories = [];
    this.count = function ({ category, value }) {
      const item = this.categories.find((c) => c.category === category);
      if (!item) return this.categories.push({ category, value });
      item.value += value;
    };
  }

  _transform(record, enc, cb) {
    this.count(record);
    cb();
  }

  _flush(cb) {
    this.categories.sort((a, b) => a.value - b.value);
    this.push("4. What is the least common crime?");
    this.push(
      `The least common crime is: ${this.categories[0].category} (${this.categories[0].value})`
    );
    cb();
  }
}
