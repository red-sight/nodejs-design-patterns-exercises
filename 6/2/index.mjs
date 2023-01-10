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
import { formatCrimes } from "./formatCrimes.mjs";
import { printResult } from "./printResult.mjs";
import { yearCount } from "./yearCount.mjs";
import { pipeline } from "stream";
import { dangerAreas } from "./dangerAreas.mjs";
import { areaCommonCrime } from "./areaCommonCrime.mjs";
import { leastCommonCrime } from "./leastCommonCrime.mjs";

const filePath = process.argv[2]; // absolute path, e.g. /f/downloads/london_crime_by_lsoa.csv
console.log(`Processing ${filePath}...`);
const source = createReadStream(filePath);

new pipeline(
  source,
  parse(),
  new formatCrimes(),
  new yearCount(),
  new printResult(),
  (err) => {
    if (err) console.error(err);
    process.exit(1);
  }
);

pipeline(
  source,
  parse(),
  new formatCrimes(),
  new dangerAreas(),
  new printResult(),
  (err) => {
    if (err) console.error(err);
    process.exit(1);
  }
);

pipeline(
  source,
  parse(),
  new formatCrimes(),
  new areaCommonCrime(),
  new printResult(),
  (err) => {
    if (err) console.error(err);
    process.exit(1);
  }
);

pipeline(
  source,
  parse(),
  new formatCrimes(),
  new leastCommonCrime(),
  new printResult(),
  (err) => {
    if (err) console.error(err);
    process.exit(1);
  }
);
