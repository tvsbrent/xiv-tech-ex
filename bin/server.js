var Hapi = require( 'hapi' );
var Path = require( 'path' );

var server = new Hapi.Server();
server.connection( { port: process.env.PORT || 3000 } );

server.register( [ {
    register: require('good'),
    options: {
      reporters: [ {
        reporter: require('good-console'),
        events: {
          response: '*',
          log: '*'
        }
      } ]
    }
  }, {
    register: require( 'inert' )
  } ],
  function( err ) {
    if( err ) {
      throw err;
    }
    // Static Data Route
    server.route( {
      method:   'GET',
      path:     '/{param*}',
      handler:  {
        directory:  {
          path:     'public',
          index:    true
        }
      }
    } );
    server.route( {
      method:   'GET',
      path:     '/reverse',
      handler:  function( request, reply ) {
        var originalText = request.query.originalText;
        if( originalText == undefined || originalText == null ) {
          return;
        }
        reply( originalText.split('').reverse().join('') );
      }
    } );
    server.start( function() {
      server.log( 'info', 'Server running at: ', server.info.uri );
    } );
  }
);

// Error handling
server.ext( 'onPreResponse', function( request, reply ) {
  var response = request.response;

  if( !response.isBoom ) {
    return reply.continue();
  }

  var error = response;

  return reply( 'ERROR: ' + error.output.payload.statusCode + " : " + error.output.payload.message );
} );