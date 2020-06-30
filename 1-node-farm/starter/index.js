const fs = require('fs');
const http = require('http');


const replaceTemplate = (temp, product) => {
    let output = temp.replace(/%PRODUCTNAME%}/g, product.name);
    output=output.replace(/{%IMAGE%}/g,product.image);
    output=output.replace(/{%PRICE%}/g,product.price);
    output=output.replace(/{%ORIGIN%}/g,product.from);
    output=output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output=output.replace(/{%QUANTITY%}/g,product.quantity);
    output=output.replace(/{%DESCRIPTION%}/g,product.description);

    if(!product.organic){
        output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    }

    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');



const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); //inJSON format
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {

    //Overview page 
    const pathName = req.url;
    if (pathName === '/' || pathName === '/overview') {

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el));

        res.writeHead(200, { 'Content-type': 'text/html' });
        console.log(cardsHtml);
        res.end(tempOverview);

        //Product page
    } else if (pathName === '/product') {
        res.end(tempProduct);

        // API
    } else if (pathName === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);

        // Not Found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end("<h1>Page not found</h1>")
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening for request on Port 8000")
})
