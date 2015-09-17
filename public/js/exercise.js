$(document).ready( function() {
  $('#send-text').click( function (){
    var value = $('#original-text').val();

    if( value === undefined || value === null || value === '' ) {
      return;
    }

    $.get( '/reverse', { originalText: value }, function( data, status, jqXHR ) {
      $('#output').html( data );
    } );
  } );
} );