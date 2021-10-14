# Attempting to do request validation with compute@edge based on an openapi spec.

## TODOs
* Lots of things.

## Getting started
* Clone the repo
* Run the following command in your terminal, `fastly compute serve`
* For a request that conforms to the default spec run, `curl "http://127.0.0.1:7676/anything?foo=234" -i | grep -i openapi`
* For a request that does NOT conforms to the default spec run, `curl "http://127.0.0.1:7676/anything?bar=234" -i | grep -i openapi`

# How does it work?
Information from Requests are compared to the OpenAPI document. This example compares a request against the document defined in openapi-site.json.

