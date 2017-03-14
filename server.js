var Express = require( "express" );
var app = Express();
app.use( Express.static("./"));
app.listen( 3000, () =>
{
    console.log( "Express web server is listening on port 3000 ..." );
} );