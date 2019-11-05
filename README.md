## Build instructions:

```
npm install
npm run dev
```

For running the tests in a new terminal window:
```
./test.sh
```
Output will be logged in ./out.txt

## Specifications

Create a web service that annotates HTML snippets by hyperlinking names. Names satisfy the following regex: `[A-Za-z0-9]+`. ("Bob09" is an example name. The string "Alex.com" contains 2 names: "Alex" and "com".)

The service should expose an HTTP API that supports the following operations:

1. Create/update the link for a particular name using an HTTP `PUT` on a URL of the form `/names/[name]`. The body of the request contains JSON of the form `{ "url": "[url goes here]" }`.
2. Fetch the information for a given name using an HTTP `GET` on a URL of the form `/names/[name]`. This should return JSON in the following format: `{ "name": "[name goes here]", "url": "[url goes here]" }`
3. Delete all the data on an HTTP `DELETE` on the URL `/names`. (Note: data is NOT required to persist between server restarts.)
4. The `/annotate` endpoint expects a `POST` request with an HTML snippet (valid HTML on one line) in the request body. It returns the snippet with all occurrences of linkable names hyperlinked with the link stored on the server. If a name occurs in an existing hyperlink, then it is unchanged. No element attributes or tag names should be modified. The returned HTML should not have any new newlines or spaces. You should only annotate complete names that are not part of a larger name. For example, if your server contains the names "Alex" (`http://alex.com`) and "Bo" (`http://bo.com`) and the input snippet is `Alex Alexander <a href="http://foo.com" data-Bo="Bo">Some sentence about Bo</a>`, then the expected output is `<a href="http://alex.com">Alex</a> Alexander <a href="http://foo.com" data-Bo="Bo">Some sentence about Bo</a>`. This endpoint should be robust and work on all valid HTML snippets, so you should use an actual HTML parser (not just a simple regexp find-and-replace).
5. Your implementation should scale to storing tens of thousands of names and annotating snippets that are as long as a typical webpage (e.g., `nytimes.com`). All API endpoints at this scale should run in at most a few seconds.
6. For any endpoint that mutates state, the following contract should hold: after a client receives a response, the change should be reflected in all subsequent API calls. E.g., if I have completed a `PUT` of a new name, I should immediately be able to `GET` it.
