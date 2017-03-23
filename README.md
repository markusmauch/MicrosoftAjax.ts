# MicrosoftAjax.ts

## TypeScript port ot the Microsoft ASP.NET AJAX framework (MicrosoftAjax.js)

This is a lightweight re-implmentation of the ASP.NET AJAX framework with TypeScript.
This work may facilitate the migration of legacy ASP.NET AJAX web applications to TypeScript.
The goal of this project is to be as compatible as possible with the API of the original framework while the implementation behind the API is being refactored and optimized.
New ES5 features such as array manipulation methodes or HTML5 features such as the browser history API are mapped to native calls.

Some parts of the original library, however, will not be migrated.
These parts comprise missing languages features in JavaScript that are a natural part of TypeScript such as the class registration and derivation schemes (```Type.registerNamespace()```, ```Type.registerClass()```, etc.).
Please note that while some parts of the library that are obsolete will not be included, this is still work in progress.

Usage:

Clone the repository and intiate the NPM package:

```npm install```

There are two NPM scripts:

- ```npm start``` Starts a development server at http://localhost:3000/

- ```npm run build``` Starts the webpack based compilation and packaging process
