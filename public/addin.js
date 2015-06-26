
(function() {

var obj = new Object();
var obj2 = new Object();
//obj2.products = []

//in a loop push this to obj2
obj.id=1217984131;
obj.price="200";
obj.title= "my new3 title2";
obj.inventory_quantity= 20;

obj2.products = [obj]

//obj2.products.push obj
//
//end

var jsonString= JSON.stringify(obj2);

console.log(jsonString);

fetch('http://localhost:4567/update', {
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: jsonString
}).then(function (response) {
    return response.json();
})
.then(function (result) {
	// process output 
    console.log(result[0].title);
})
.catch (function (error) {
    console.log('Request failed', error);
});
})();

//This is a event handling function. 

(function() {
$(document).ready(function() {
    function refresh(){
        jQuery.get('event1.txt', function(data) {
        $('#webhooks').html(data);
        $.ajax({
   			url: '/event',
    		type: 'DELETE',
    		success: function(result) {
            	$('#result').html("deleted");
    		}
});
        });
    }
    setInterval(refresh, 5000);
});})();

// $.ajax({
//     type:    "GET",
//     url:     "event.txt",
//     success: function(text) {
//         $("#webhooks").html(text);
//     },
//     error:   function() {
//         // An error occurred
//     }
// });


// // Get all products
// (function() {
//   var shopifyProductsAllAPI = "http://localhost:4567/products?callback=?";
//   		$.ajaxSetup({dataType: "jsonp" });
// 		$.getJSON(shopifyProductsAllAPI)
// 		 .done(function(json) {
// 		 	console.log( "JSON Data: " + json[0].title );
// 		 })
// 		  .fail(function( jqxhr, textStatus, error ) {
// 		   		var err = textStatus + ", " + error;
// 		  	console.log( "Request Failed: " + err );
// });
// })();

