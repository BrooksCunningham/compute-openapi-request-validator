const apiSpec = require("./openapi-site.json");

// The entry point for your application.
//
// Use this fetch event listener to define your main request handling logic. It could be
// used to route based on the request properties (such as method or path), send
// the request to a backend, make completely new requests, and/or generate
// synthetic responses.
addEventListener('fetch', event => event.respondWith(handleRequest(event)));

// The name of a backend server associated with this service.
//
// This should be changed to match the name of your own backend. See the
// `Hosts` section of the Fastly Wasm service UI for more information.
const BACKEND_NAME = "httpbin";

/// The name of a second backend associated with this service.
const OTHER_BACKEND_NAME = "other_backend_name";

async function handleRequest(event) {

  async function checkOpenAPIRequest(req) {

    var OpenAPIRequestValidator = require('openapi-request-validator').default;


    var requestValidator = new OpenAPIRequestValidator(apiSpec);

    console.log("Hello!");

    // import openapiSiteSpec from "./openapi-site.yaml";

    // console.log(openapiSiteSpec);


    console.log('original requests');
    console.log(req.url);
    console.log(req.headers);
    console.log(req.method);
    console.log('end original requests');

    const url = new URL(req.url);

      /* Parse QueryString using String Splitting */
    async function parseQueryStringToDictionary(queryString) {
      var dictionary = {};

      // console.log(dictionary);
      // queryString = "foo=123&bar=456";
      
      // remove the '?' from the beginning of the
      // if it exists
      // if (queryString.indexOf('?') === 0) {
      //   queryString = queryString.substr(1);
      // }
      
      console.log("qs: " + queryString);
      // console.log(queryString.split('&'));
      // Step 1: separate out each key/value pair
      var parts = queryString.split('&');
      // console.log("parts");
      // console.log(parts);
      
      
      for(var i = 0; i < parts.length; i++) {
        var p = parts[i];
        // Step 2: Split Key/Value pair
        var keyValuePair = p.split('=');
        
        // Step 3: Add Key/Value pair to Dictionary object
        var key = keyValuePair[0];
        var value = keyValuePair[1];
        
        // decode URI encoded string
        value = decodeURIComponent(value);
        value = value.replace(/\+/g, ' ');
        
        dictionary[key] = value;
      }
      
      // Step 4: Return Dictionary Object
      return dictionary;
    }

    // console.log(url.searchParams);

    // console.log("searchParams: " + url.searchParams);
    // console.log(url.searchParams);

    let queryDictionary = await parseQueryStringToDictionary(url.searchParams.toString());
    console.log(JSON.stringify(queryDictionary));


    // var request = {
    //   method: req.method,
    //   headers: {
    //     'content-type': 'application/json'
    //   },
    //   body: {},
    //   params: {},
    //   query: {foo: 'wow'}
    // };

    var request = {
      method: req.method,
      headers: {},
      body: {},
      params: {},
      query: queryDictionary
    };

    var errors = requestValidator.validateRequest(request);
    console.log(JSON.stringify(errors))
    if (errors !== undefined) {
      console.log(errors);
      console.log(errors.status);
      req.headers.set("fastly-openapi", "Not valid");
    } else {
      console.log('Valid request for OpenAPI');
      req.headers.set("fastly-openapi", "valid");
    }

    return req;
  }




  // end validation

  // Send logs to your custom logging endpoint
  // https://developer.fastly.com/learning/compute/javascript/#logging
  // const logger = fastly.getLogger("my-logging-endpoint-name");
  // logger.log("log message");

  // Get the client request from the event
  let req = event.request;

  // pass the request object to the OpenAPI request validation
  req = await checkOpenAPIRequest(req);

  console.log(req.method);

  // Make any desired changes to the client request.
  req.headers.set("Host", "example.com");

  // let method = req.method;
  // let url = new URL(event.request.url);

  return await fetch(req, {
    backend: BACKEND_NAME,
  });

};
