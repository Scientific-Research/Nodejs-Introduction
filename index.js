const fs = require("fs");
const http = require("http");
const url = require("url");

//////////////////////////////////
//////FILE

/* Blocking, synchronous way */
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut = `This is what we know about the Avocado: ${textIn}.\nCreated on ${Date().toString()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File was written!");

/* Non-blocking, asynchronous way */
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR! :(");

//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     // we use callback here => err and data
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       // we use callback here => err and data
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written :)");
//       });
//     });
//   });
// });

// console.log("Will read file");
// As result, first of all, we see the "Will read file" sentence and then what
// is in start.txt as data => read-this

//////////////////////////////////
//////SERVER

const server = http.createServer((req, res) => {
  console.log(req.url);
  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    res.end("This is the OVERVIEW page!");
  } else if (pathName === "/product") {
    res.end("This is the PRODUCT page!");
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>404 - Page not found!</h1>");
  }
});

const PORT = 8000;
/* "127.0.0.1" is our default localhost IP address on our computer*/
server.listen(PORT, "127.0.0.1", () => {
  console.log(`Server is runnning on PORT ${PORT}`);
});
