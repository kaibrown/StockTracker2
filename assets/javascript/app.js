var config = {
apiKey: "AIzaSyBv5UzhUipQ3IWhQH8A0tAzHeMa7KCkp7E",
authDomain: "stocktracker-f62c8.firebaseapp.com",
databaseURL: "https://stocktracker-f62c8.firebaseio.com",
projectId: "stocktracker-f62c8",
storageBucket: "",
messagingSenderId: "352972262657"
};
firebase.initializeApp(config);

var database = firebase.database();
var OpenPrice = 0;
var HighPrice = 0;
var LowPrice = 0;
var ClosePrice = 0;
var GBP = 0;
var EUR = 0;
var CHF = 0;
var CAD = 0;
var RUB = 0;
var OpenOutPut = 0;
var HighOutPut = 0;
var LowOutPut = 0;;
var CloseOutPut = 0;

$(document).ready(function() {
	CurrencyConverter();
	// Onclick function which makes the AJAX call to the Stock API
	$("#add-stock-btn").on("click", function(event) {
			event.preventDefault();
			//var quote = $(this).attr("data-name");
			// Alpha Vantage working
			if ($("input").val() === "") {

		    	console.log("Invalid input!");
		    	return false

		    } else {
			var symbol = $("input").val().trim();
			var queryURL = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&apikey=PMUK6NM28GYW799L&datatype=json";
				// Performing an AJAX request with the queryURL
				$.ajax({
		          url: queryURL,
		          method: "GET"
		        })
		        // After data comes back from the request
		        .done(function(response) {
				  console.log(response);
				  var quotes = response;
				  var dates = [];
				  for(x in quotes["Time Series (Daily)"]){
				  		dates.push(x);
				  }
			      	var iterate = quotes["Time Series (Daily)"][dates[0]];
			      	console.log(iterate);
			      	var open = iterate["1. open"];
			      	console.log(open);
			      	var high = iterate["2. high"];
			      	console.log(high);
			      	var low = iterate["3. low"];
			      	console.log(low);
			      	var close = iterate["4. close"];
			      	console.log(close);

				    database.ref("/quotes").push({
				    	name: symbol,
				    	open: open,
				    	high: high,
				    	low: low,
				    	close: close
				    });
				    // Clears the input value
				    $("input").val("");
				});
	    	}
		});

		// Firebase updates the html
		database.ref("/quotes").on("child_added", function(childSnapshot) {

			// Log everything that's coming out of snapshot
		    console.log(childSnapshot.val().name);
		    console.log(childSnapshot.val().open);
		    console.log(childSnapshot.val().high);
		    console.log(childSnapshot.val().low);
		    console.log(childSnapshot.val().close);

		    // Variables for object data
		    var newStockName = childSnapshot.val().name;
		    var newOpenPrice = childSnapshot.val().open;
		    var newHighPrice = childSnapshot.val().high;
		    var newLowPrice = childSnapshot.val().low;
		    var newClosePrice = childSnapshot.val().close;

		    var $chartBtn;

		    OpenPrice = newOpenPrice;
			HighPrice = newHighPrice;
			LowPrice = newLowPrice;
			ClosePrice = newClosePrice;

			if (newClosePrice < newOpenPrice){
				$chartBtn = "<button class='chart-btn btn btn-lg btn-danger'>  "+newStockName+ "</button>";
			} else {
				$chartBtn = "<button class='chart-btn btn btn-lg btn-success'>  "+newStockName+ "</button>";
			}

		    var removeBtn = "<button class='remove'>X</button>";
		    
		    // Html updated
		    // Appends variable data to document's html
		    var line = $("<tr> <td>"+$chartBtn+ "</td> <td class='open'>"+newOpenPrice+ "</td> <td class='high'>"+newHighPrice+ "</td>" +
						"<td class='low'>"+newLowPrice+ "</td> <td class='close-value'>"+newClosePrice+"</td> <td>"+removeBtn+"</td>" +
		    			"</tr>");

		    
		    $("#quote-table > tbody").append(line);

            
			}, function(errorObject) {
				console.log("Errors handled: " + errorObject.code);
		});

		$(document).on('click','.remove',function(event){

			event.preventDefault();
			console.log('removed');
			$(this).closest('tr').hide();
		});

		$(".removeBtn").on("click", function(){
			select.removeChild(select.options[select.selectedIndex]);
		})

		$(document).on("click",".chart-btn",function(event){

			event.preventDefault();

			$("#myChart").empty();

			var $row = $(this).parent();  
			var $row = $(this).closest("tr");   
			var openingValue = $row.find("td:nth-child(2)").text();
			console.log(openingValue);
			var highValue = $row.find("td:nth-child(3)").text();
			console.log(highValue);
			var lowValue = $row.find("td:nth-child(4)").text();
			console.log(lowValue);
			var closeValue = $row.find("td:nth-child(5)").text();
			console.log(closeValue);

			// Chart section
			var ctx = $("#myChart");
			var myChart = new Chart(ctx, {
			    type: 'line',
			    data: {
			        labels: ["Open", "Low", "High", "Close"],
			        datasets: [{
			            label: 'Stock Activity',
			            data: [openingValue, lowValue, highValue, closeValue],
			            backgroundColor: [
			                'rgb(51, 204, 51)'
			            ],
			            borderColor: [
			                'rgb(36, 143, 36)'
			            ],
			            borderWidth: 3
			        }]
			    }
			});

		});
});
		
	function CurrencyConverter() {

		var endpoint = 'live';
		var access_key = '34f7aa0bec1b3e840bfec1a470ef081f';
		var base = 'USD';
		var currencySelect = $(".currency").val().trim();
		var quoterate = base + currencySelect;
	//	This is a placeholder for the amount that we are converting;

		console.log(quoterate);


		$.ajax({
		    url: 'https://apilayer.net/api/' + endpoint + '?access_key=' + access_key,
		    dataType: 'jsonp',
		    success: function(json) {
			GBP = json.quotes.USDGBP;
			EUR = json.quotes.USDEUR;
			CHF = json.quotes.USDCHF;
			CAD = json.quotes.USDCAD;
			RUB = json.quotes.USDRUB;
		    console.log(json);
		    console.log(GBP);  
		    console.log(EUR);  
		    console.log(CHF);  
		    console.log(RUB);  
		    console.log(CAD);                         
		    }
		});
	};

	function calculation() {


	var dropDown = $("#selectedC option:selected").val();

		if (dropDown == "RUB") {
			OpenOutPut = RUB * OpenPrice;
			HighOutPut = RUB * HighPrice;
			LowOutPut = RUB * LowPrice;
			CloseOutPut = RUB * ClosePrice;
		} else if (dropDown == "CAD") {
			OpenOutPut = CAD * OpenPrice;
			HighOutPut = CAD * HighPrice;
			LowOutPut = CAD * LowPrice;
			CloseOutPut = CAD * ClosePrice;
		} else if (dropDown == "CHF") {
			OpenOutPut = CHF * OpenPrice;
			HighOutPut = CHF * HighPrice;
			LowOutPut = CHF * LowPrice;
			CloseOutPut = CHF * ClosePrice;
		} else if (dropDown == "EUR") {
			OpenOutPut = EUR * OpenPrice;
			HighOutPut = EUR * HighPrice;
			LowOutPut = EUR * LowPrice;
			CloseOutPut = EUR * ClosePrice;;
		} else if (dropDown == "GBP") {
			OpenOutPut = GBP * OpenPrice;
			HighOutPut = GBP * HighPrice;
			LowOutPut = GBP * LowPrice;
			CloseOutPut = GBP * ClosePrice;
		}

	};

$("#openBtn").on("click", function(){
	calculation();
	$("#convertedOpening").html(OpenOutPut.toFixed(3));
	$("#convertedHigh").html(HighOutPut.toFixed(3));
	$("#convertedLow").html(LowOutPut.toFixed(3));
	$("#convertedClose").html(CloseOutPut.toFixed(3));
});


