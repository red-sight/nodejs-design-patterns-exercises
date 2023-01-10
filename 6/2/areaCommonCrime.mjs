import { Transform } from "stream";

export class areaCommonCrime extends Transform {
  constructor(options = {}) {
    options.objectMode = true;
    super(options);
    this.areas = [];
    this.count = function ({ borough, category, value }) {
      const area = this.areas.find((a) => a.borough === borough);
      if (!area)
        return this.areas.push({ borough, categories: [{ category, value }] });
      const areaCategory = area.categories.find((c) => c.category === category);
      if (!areaCategory) return area.categories.push({ category, value });
      areaCategory.value += value;
    };
  }

  _transform(record, enc, cb) {
    this.count(record);
    cb();
  }

  _flush(cb) {
    this.areas = this.areas.map((a) => {
      a.categories.sort((a, b) => b.value - a.value);
      return {
        borough: a.borough,
        category: a.categories[0].category,
        value: a.categories[0].value
      };
    });
    this.push("3. What is the most common crime per area?");
    this.push(this.areas);
    cb();
  }
}
