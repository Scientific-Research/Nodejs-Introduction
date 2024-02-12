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
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%productName%}/g, product.productName);
  output = output.replace(/{%image%}/g, product.image);
  output = output.replace(/{%price%}/g, product.price);
  output = output.replace(/{%from%}/g, product.from);
  output = output.replace(/{%nutrients%}/g, product.nutrients);
  output = output.replace(/{%quantity%}/g, product.quantity);
  output = output.replace(/{%description%}/g, product.description);
  output = output.replace(/{%id%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%not_organic%}/g, "not-organic");
  }
  return output;
};

// this is the top level code and is started once when we ever start the program:
// and it doesn't matter if it blocks the execution, because it is the Synchronous
// and not Asynchronous. It just starts one time at the beginning of the program.
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data); // dataObj is not in JSON format anymore, it is now in string format!
// console.log(data);

const server = http.createServer((req, res) => {
  // console.log(req.url);
  // console.log(url.parse(req.url, true));
  // const pathname = req.url;

  // using ES6 destructuring gives us the query and pathname that we need them in product section
  // later!
  const { query, pathname } = url.parse(req.url, true);
  console.log(query);
  console.log(pathname);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    // res.end("This is the OVERVIEW page!");
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el));
    // console.log(cardsHtml);

    // Convert the JavaScript Objects to string to display it on the Browser!
    // const cardHtmlString = cardsHtml.toString();
    // OR => join('') convert the JS Object to String
    const cardHtmlString = cardsHtml.join("");
    // we have now the cardHtmlString and replace it with {%Product_Cards%} which is in
    // template-overview.html
    const outputOverview = tempOverview.replace("{%Product_Cards%}", cardHtmlString);
    // console.log(cardHtmlString);

    // res.end(tempOverview);
    res.end(outputOverview);

    // Product page
  } else if (pathname === "/product") {
    console.log(query.id); // query.id gives us a number that we need for every fruit.
    const product = dataObj[query.id]; // dataObj[0] or dataObj[1], dataObj[2], dataObj[3], dataObj[4]
    console.log(product);

    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const outputProduct = replaceTemplate(tempProduct, product);

    res.end(outputProduct);

    // res.end("This is the PRODUCT page!");

    // API
  } else if (pathname === "/api") {
    // const api = fs.readFile("./dev-data/data.json");
    // __dirname means where the current file is located! where the directory dev-data is located!
    // it is located in the main folder of the program => Nodejs-Introduction
    // . means where the script is running: this current folder: Nodejs-Introduction
    // C:\Data\assignement\Jonas-Schmedtmann\NODE\Nodejs-Introduction\dev-data\data.json
    // const api = fs.readFile(`./dev-data/data.json`, "utf-8", (err, data) => {
    //   res.end(`This is the content of an API: ${data}`);
    // });
    // OR
    // fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
    //   // we use JSON.parse() to convert the JSON string to a Javascript Object!
    //   // it will remove the quotation from Key in JS object=>
    //   // JSON:'productName': 'Baby Carrots' --> JS object: productName: 'Baby Carrots'
    //   const productData = JSON.parse(data);
    //   console.log(productData); // console.log() can display JSON string data
    //   console.log(data); // console.log() can display the Javascript object too!
    // but we don't need to convert the data to JS Object to show the content in Browser
    // we can directly display the data as it is because data is JSON string and when we
    // convert it to the JS Object, Browser can not display it.

    // we can also adding the header and status before we send the data:
    // but we will have the application/json as header for Content-type instead of text/html
    // because we send here actually the json file to the browser and not text/html.
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    // res.end(`This is the content of an API: ${data}`);
    // res.end(`${data}`);
    res.end(data);
    // console.log(data);
    // console.log(dataObj);

    // Not Found
  } else if (pathname === "/Shopping-Cart") {
    res.writeHead(200, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    // res.write(
    //   '<div style="width:100%;height:100%;background-color:lightgreen;display:inline-block;background-color: #79e17b;background: linear-gradient(to bottom, #9be15d, #00e3ae);font-family: "Megrim", sans-serif;"><h1 style="color: #ff0000;text-align: center;margin-top:30rem; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);">Shopping Cart page coming soon...</h1></div>'
    // );
    res.write(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
      * {
      box-sizing: border-box;
      font-family: sans-serif;
    }
    
    body {
      --size: min(40vw, 40vh);
      --width: calc(var(--size) / 40);
      --dist: calc(var(--width) * 9.8);
      --count: 64;
      --bg: url("https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5eeea355389655.59822ff824b72.gif");
      margin: 0;
      height: 100vh;
      width: 100%;
      background-image: linear-gradient(-45deg, #111, #222);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--width);
    }
    
    .tube {
      transform-style: preserve-3d;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: speen 6s infinite linear;
      width: calc(var(--dist) * 2);
      height: var(--size);
    }
    .tube:nth-child(1) {
      animation-delay: -7.5s;
    }
    .tube:nth-child(2) {
      animation-delay: -5s;
    }
    .tube:nth-child(3) {
      animation-delay: -2.5s;
    }
    
    .strip {
      transform-style: preserve-3d;
      background-color: white;
      height: var(--size);
      width: var(--width);
      position: absolute;
      background-image: var(--bg);
      background-size: calc(var(--width) * var(--count)) auto;
      background-repeat: no-repeat;
      backface-visibility: hidden;
    }
    .strip:nth-child(1) {
      transform: rotateY(calc(1turn * 1 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -0) center;
    }
    .strip:nth-child(2) {
      transform: rotateY(calc(1turn * 2 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -1) center;
    }
    .strip:nth-child(3) {
      transform: rotateY(calc(1turn * 3 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -2) center;
    }
    .strip:nth-child(4) {
      transform: rotateY(calc(1turn * 4 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -3) center;
    }
    .strip:nth-child(5) {
      transform: rotateY(calc(1turn * 5 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -4) center;
    }
    .strip:nth-child(6) {
      transform: rotateY(calc(1turn * 6 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -5) center;
    }
    .strip:nth-child(7) {
      transform: rotateY(calc(1turn * 7 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -6) center;
    }
    .strip:nth-child(8) {
      transform: rotateY(calc(1turn * 8 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -7) center;
    }
    .strip:nth-child(9) {
      transform: rotateY(calc(1turn * 9 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -8) center;
    }
    .strip:nth-child(10) {
      transform: rotateY(calc(1turn * 10 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -9) center;
    }
    .strip:nth-child(11) {
      transform: rotateY(calc(1turn * 11 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -10) center;
    }
    .strip:nth-child(12) {
      transform: rotateY(calc(1turn * 12 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -11) center;
    }
    .strip:nth-child(13) {
      transform: rotateY(calc(1turn * 13 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -12) center;
    }
    .strip:nth-child(14) {
      transform: rotateY(calc(1turn * 14 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -13) center;
    }
    .strip:nth-child(15) {
      transform: rotateY(calc(1turn * 15 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -14) center;
    }
    .strip:nth-child(16) {
      transform: rotateY(calc(1turn * 16 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -15) center;
    }
    .strip:nth-child(17) {
      transform: rotateY(calc(1turn * 17 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -16) center;
    }
    .strip:nth-child(18) {
      transform: rotateY(calc(1turn * 18 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -17) center;
    }
    .strip:nth-child(19) {
      transform: rotateY(calc(1turn * 19 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -18) center;
    }
    .strip:nth-child(20) {
      transform: rotateY(calc(1turn * 20 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -19) center;
    }
    .strip:nth-child(21) {
      transform: rotateY(calc(1turn * 21 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -20) center;
    }
    .strip:nth-child(22) {
      transform: rotateY(calc(1turn * 22 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -21) center;
    }
    .strip:nth-child(23) {
      transform: rotateY(calc(1turn * 23 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -22) center;
    }
    .strip:nth-child(24) {
      transform: rotateY(calc(1turn * 24 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -23) center;
    }
    .strip:nth-child(25) {
      transform: rotateY(calc(1turn * 25 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -24) center;
    }
    .strip:nth-child(26) {
      transform: rotateY(calc(1turn * 26 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -25) center;
    }
    .strip:nth-child(27) {
      transform: rotateY(calc(1turn * 27 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -26) center;
    }
    .strip:nth-child(28) {
      transform: rotateY(calc(1turn * 28 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -27) center;
    }
    .strip:nth-child(29) {
      transform: rotateY(calc(1turn * 29 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -28) center;
    }
    .strip:nth-child(30) {
      transform: rotateY(calc(1turn * 30 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -29) center;
    }
    .strip:nth-child(31) {
      transform: rotateY(calc(1turn * 31 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -30) center;
    }
    .strip:nth-child(32) {
      transform: rotateY(calc(1turn * 32 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -31) center;
    }
    .strip:nth-child(33) {
      transform: rotateY(calc(1turn * 33 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -32) center;
    }
    .strip:nth-child(34) {
      transform: rotateY(calc(1turn * 34 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -33) center;
    }
    .strip:nth-child(35) {
      transform: rotateY(calc(1turn * 35 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -34) center;
    }
    .strip:nth-child(36) {
      transform: rotateY(calc(1turn * 36 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -35) center;
    }
    .strip:nth-child(37) {
      transform: rotateY(calc(1turn * 37 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -36) center;
    }
    .strip:nth-child(38) {
      transform: rotateY(calc(1turn * 38 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -37) center;
    }
    .strip:nth-child(39) {
      transform: rotateY(calc(1turn * 39 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -38) center;
    }
    .strip:nth-child(40) {
      transform: rotateY(calc(1turn * 40 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -39) center;
    }
    .strip:nth-child(41) {
      transform: rotateY(calc(1turn * 41 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -40) center;
    }
    .strip:nth-child(42) {
      transform: rotateY(calc(1turn * 42 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -41) center;
    }
    .strip:nth-child(43) {
      transform: rotateY(calc(1turn * 43 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -42) center;
    }
    .strip:nth-child(44) {
      transform: rotateY(calc(1turn * 44 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -43) center;
    }
    .strip:nth-child(45) {
      transform: rotateY(calc(1turn * 45 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -44) center;
    }
    .strip:nth-child(46) {
      transform: rotateY(calc(1turn * 46 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -45) center;
    }
    .strip:nth-child(47) {
      transform: rotateY(calc(1turn * 47 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -46) center;
    }
    .strip:nth-child(48) {
      transform: rotateY(calc(1turn * 48 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -47) center;
    }
    .strip:nth-child(49) {
      transform: rotateY(calc(1turn * 49 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -48) center;
    }
    .strip:nth-child(50) {
      transform: rotateY(calc(1turn * 50 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -49) center;
    }
    .strip:nth-child(51) {
      transform: rotateY(calc(1turn * 51 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -50) center;
    }
    .strip:nth-child(52) {
      transform: rotateY(calc(1turn * 52 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -51) center;
    }
    .strip:nth-child(53) {
      transform: rotateY(calc(1turn * 53 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -52) center;
    }
    .strip:nth-child(54) {
      transform: rotateY(calc(1turn * 54 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -53) center;
    }
    .strip:nth-child(55) {
      transform: rotateY(calc(1turn * 55 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -54) center;
    }
    .strip:nth-child(56) {
      transform: rotateY(calc(1turn * 56 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -55) center;
    }
    .strip:nth-child(57) {
      transform: rotateY(calc(1turn * 57 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -56) center;
    }
    .strip:nth-child(58) {
      transform: rotateY(calc(1turn * 58 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -57) center;
    }
    .strip:nth-child(59) {
      transform: rotateY(calc(1turn * 59 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -58) center;
    }
    .strip:nth-child(60) {
      transform: rotateY(calc(1turn * 60 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -59) center;
    }
    .strip:nth-child(61) {
      transform: rotateY(calc(1turn * 61 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -60) center;
    }
    .strip:nth-child(62) {
      transform: rotateY(calc(1turn * 62 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -61) center;
    }
    .strip:nth-child(63) {
      transform: rotateY(calc(1turn * 63 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -62) center;
    }
    .strip:nth-child(64) {
      transform: rotateY(calc(1turn * 64 / var(--count))) translateZ(var(--dist));
      background-position: calc(var(--width) * -63) center;
    }
    
    @keyframes speen {
      0% {
        transform: perspective(400px) rotateY(0deg);
      }
      100% {
        transform: perspective(400px) rotateY(360deg);
      }
    }
      
      </style>
  </head>
  <body>
  <div class="tube">
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
</div>
<div class="tube">
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
</div>
<div class="tube">
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
</div>
<div class="tube">
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
  <div class="strip"> </div>
</div>
  </body>
  </html>
`);
    // res.end();
    // OR
    res.end('<h1 style="color: #ff0000;">Shopping Cart page coming soon...</h1>');
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
