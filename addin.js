
(function() {
  var shopifyProductsAllAPI = "http://localhost:4567/products?callback=?";
  		$.ajaxSetup({dataType: "jsonp" });
		$.getJSON(shopifyProductsAllAPI)
		 .done(function(json) {
		 	console.log( "JSON Data: " + json[0].title );
		 })
		  .fail(function( jqxhr, textStatus, error ) {
		   		var err = textStatus + ", " + error;
		  	console.log( "Request Failed: " + err );
});
})();


// $( document ).ready(function() {
 
    
// 	$("#useJSONP").click(function(){
// 		alert( "Starting ajax call" );
//         $.ajax({
//             url: 'http://localhost:4567/products',
//             dataType: 'jsonp',
//             jsonp: 'callback',
//             jsonpCallback: 'jsonpCallback',
//             success: function(){
//                 alert("success");
//             }
//         });
//     });
 
// });

// function jsonpCallback(data){
//     $('#jsonpResult').text(data.message);