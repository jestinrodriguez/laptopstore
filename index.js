/*****************
 * NODE MODULES
 */
// file system
const fs = require('fs'); // core node modules
const http = require('http');
const url =  require ('url');


/***************************/
// Synchronous
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');

// json.parse (passing a json string and it will return an object)
const laptopData = JSON.parse(json);

// creating server (call back function is runned each time someone access the rerver) (will always be a different url)
const server = http.createServer((req,res)=>{

    // url module used for more functionality
    const pathName = url.parse(req.url, true).pathname;

    console.log(pathName);
    // reading ID from URL
    const id = url.parse(req.url, true).query.id; // ?id=1, .... ?id=5

    
    
    // simple routing (later it will be all the data we get from json file)

    //PRODUCT OVERVIEW
    if (pathName === '/products' || pathName === '/'){
        // http headers - small message that we send with a request to let browsers know what kind of data is coming
        // http status code (404 - error , 200 - working) 
        res.writeHead(200, {'Content-type': 'text/html'}); 
        // response from server

        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8' ,  (err,data) => {
            
            let overviewOutput = data;

             fs.readFile(`${__dirname}/templates/templates-card.html`, 'utf-8' ,  (err,data) => {
        
                // looping through our data in the laptopData array


                // join method - returns new string by concatenating elements of an array or array like object
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                res.end(overviewOutput);
             });
           });
        }

   

    // LAPTOP DETAILS
      else if (pathName === '/laptop' && id < laptopData.length)  /* laptop data is an array of the objects */
    {
        res.writeHead(200, {'Content-type': 'text/html'}); 
        // response from server
        //res.end(`${__dirname} this is the laptop page for laptop ${id}!`);
        
        // Asynchronous file read so that it 
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8' ,  (err,data) => {
            const laptop = laptopData[id];
            const output = replaceTemplate(data,laptop);
             res.end(output);
        });
    }

    
        //IMAGES (ROUTE)
        //regular expression to find/test if it has image extension
        // and then send it as a response
        else if ((/\.(jpg|jpeg|png|gift)$/i).test(pathName)) {
            fs.readFile(`${__dirname}/data/img${pathName}` , (err,data) => {

                res.writeHead(200, {'Content-type': 'image/jpg'}); 
                res.end(data);
            });
        }
    

        //URL NOT FOUND
     else {
        res.writeHead(404, {'Content-type': 'text/html'}); 
        // response from server
        res.end( 'URL was not found on the server');

    }



});

//listening to a port
// (port and ip address)
server.listen(1337,'127.0.0.1', () => {
console.log('listening for a request now');
});

// routing - responding different ways in different urls

// using a node frame work express to handle routing


function replaceTemplate(originalHtml,laptop){
    // replace returns a new string
            // we need to put output otherwise it will be placed in the data where product name hasnt changed
            // using regular expression /../g
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);

    return output;

}

