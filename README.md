# asp.net.ajax.ts

## TypeScript port ot the Microsoft ASP.NET AJAX framework (MicrosoftAjax.js)

This is a lightweight re-implmentation of the ASP.NET AJAX framework with TypeScript.
The goal of this project is to be as compatible as possible with the API of the original framework while the implementation behind the API is being refactored and optimized.
This work may facilitate the migragation of legacy ASP.NET AJAX web applications to TypeScript.

Some parts of the original library will not be migrated.
These parts almost always comprise missing languages features in JavaScript that are a natural part of TypeScript such as the class registration and derivation schemes (```Type.registerNamespace()```, ```Type.registerClass()```, etc.).

