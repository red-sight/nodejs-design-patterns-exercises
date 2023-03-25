import crypto from "crypto";

const TELEGRAM_BOT_TOKEN = "5903371868:AAF8aP_lmFm3n1_jAFP_KMPlSei4mB2Vals";

const telegramInitData =
  "query_id=AAEvKIxaAgAAAC8ojFphRffu&user=%7B%22id%22%3A5814102063%2C%22first_name%22%3A%22Dmitrii%22%2C%22last_name%22%3A%22Malakhov%22%2C%22language_code%22%3A%22ru%22%7D&auth_date=1675090097&hash=9872dec23471fc6bd2dff462d44b96fa8352bdea96f5fe6b0acf4c053fecd673";

const encoded = decodeURIComponent(telegramInitData);

const secret = crypto
  .createHmac("sha256", "WebAppData")
  .update(TELEGRAM_BOT_TOKEN);

// Data-check-string is a chain of all received fields'.
const arr = encoded.split("&");
const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
const hash = arr.splice(hashIndex)[0].split("=")[1];
// sorted alphabetically
arr.sort((a, b) => a.localeCompare(b));
// in the format key=<value> with a line feed character ('\n', 0x0A) used as separator
// e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
const dataCheckString = arr.join("\n");

// The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
const _hash = crypto
  .createHmac("sha256", secret.digest())
  .update(dataCheckString)
  .digest("hex");

return _hash === hash;
