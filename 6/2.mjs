/* 
6.2 Stream data processing: On Kaggle, you can find a lot of interesting data
sets, such as the London Crime Data (nodejsdp.link/london-crime). You can
download the data in CSV format and build a stream processing script that
analyzes the data and tries to answer the following questions:
• Did the number of crimes go up or down over the years?
• What are the most dangerous areas of London?
• What is the most common crime per area?
• What is the least common crime?

Hint: You can use a combination of Transform streams and PassThrough
streams to parse and observe the data as it is flowing. Then, you can build inmemory
aggregations for the data, which can help you answer the preceding
questions. Also, you don't need to do everything in one pipeline; you could
build very specialized pipelines (for example, one per question) and use the
fork pattern to distribute the parsed data across them.
*/

import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { transform } from "stream-transform";

const filePath = process.argv[2]; // absolute path, e.g. /f/downloads/london_crime_by_lsoa.csv
console.log(`Processing ${filePath}...`);
const source = createReadStream(filePath);
const csvParser = parse();

const countYears = new Promise((resolve, reject) => {
  const years = [];
  const transformer = transform();
  transformer.on("error", (err) => reject(err));
  transformer.on("readable", () => {
    let row;
    while ((row = transformer.read()) !== null) {
      output.push(row.toString());
    }
  });
  transformer.on("finish", () => {
    resolve();
  });
});

source
  .pipe(csvParser)
  .pipe(countYears)
  // .pipe(process.stdout)
  .on("error", (e) => console.log(e));
