const fs = require("fs");

const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

const textOut = `This is what we know about the Avocado: ${textIn}.\nCreated on ${Date().toString()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File was written!");
