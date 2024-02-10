const fs = require("fs");

/* Blocking, synchronous way */
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut = `This is what we know about the Avocado: ${textIn}.\nCreated on ${Date().toString()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File was written!");

/* Non-blocking, asynchronous way */
fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
  // we use callback here => err and data
  console.log(data);
});

console.log("Will read file");
// As result, first of all, we see the "Will read file" sentence and then what
// is in start.txt as data => read-this
