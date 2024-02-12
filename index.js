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
