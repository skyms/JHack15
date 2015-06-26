/// <reference path="../App.js" />

(function () {
    "use strict";

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();
            $('#get-data-from-selection').click(writeRange);
            $('#write-range').click(getproducts);
            $('#create-chart').click(createChart);
            $('#push-data').click(pushData);
            $('#delete-data').click(deleteData);
            $('#monitor-changes').click(monitorEvents);
            $('#highlight-inventory').click(highlightInventory);


        });
    };

    // Reads data from current document selection and displays a notification
    function callapi() {
        $.ajax({
            url: 'https://jhack.myshopify.com/admin/products.json',
            type: 'GET',
            dataType: 'json',
            success: function () { app.showNotification("Suc"); },
            error: function () { app.showNotification("Error"); },
            beforeSend: setHeader
        });
    }

      function setHeader(xhr) {
          xhr.setRequestHeader("X-Shopify-Access-Token","2c7904a2ae153e64e26221b5c084fa1c");
      }


      function getproductsFailsGetJSON() {

          var shopifyProductsAllAPI = "http://localhost:4567/products";
          $.ajaxSetup({ dataType: "json" });
          $.getJSON(shopifyProductsAllAPI)
           .done(function (json) {
               writeRange(json);
           })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
            });

      }
    
      function getproducts() {
          $.ajax({
              type: "GET",
              url: "http://localhost:4567/products",
              accept: "application/json",
              dataType: 'json',
              success: function (json) { writeRange(json); },
              failure: function (error) {
                  var err = "Error in getProducts: " + error;
                  app.showNotification(JSON.stringify(err));
              }
          });
      }


      function getproductsThatWorks() {
          var shopifyProductsAllAPI = "http://localhost:4567/products?callback=?";
          $.ajaxSetup({ dataType: "jsonp" });
          $.getJSON(shopifyProductsAllAPI)
           .done(function (json) {
               writeRange(json);
           })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                app.showNotification("Error", JSON.stringify(err));
            });
      }
   
      function getproductsFetchSyntaxError() {
          fetch('http://localhost:4567/products', {
              method: 'get',
              headers: {
                  'Accept': 'application/json'
              }
              }).then(function (response) {
                  return response.json();
              }).then(function (result) {
                  writeRange(result);
              }).catch(function (error) {
                  var err = "Error in getProducts: " + error;
                  app.showNotification(JSON.stringify(err));
              });
      }

    function writeRange(products) {

        var rangevalues = [["ID","Title","Inventory Quantity","Price"]];

        for (var i = 0; i < products.length; i++) {
            var id = products[i].id;
            var title = products[i].title;
            var variantcount = products[i].variants[0].inventory_quantity;
            var variantprice = products[i].variants[0].price;
            

           var array = [id, title, variantcount, variantprice];
           rangevalues.push(array);
          
        }

       var rangeAddress = "A1:D" + rangevalues.length;
        var ctx = new Excel.ExcelClientContext();
       // ctx.workbook.worksheets.getActiveWorksheet().getRange("A1:A100").numberFormat = "@";
        ctx.workbook.worksheets.getActiveWorksheet().getUsedRange().clear();
        var range = ctx.workbook.worksheets.getActiveWorksheet().getRange(rangeAddress);

        range.values = rangevalues;

        
        ctx.workbook.worksheets.getActiveWorksheet().getRange("A1:D1").format.fill.color = "66CCFF";
        ctx.workbook.worksheets.getActiveWorksheet().getRange("A1:D1").format.font.bold = true;
        ctx.workbook.worksheets.getActiveWorksheet().getRange("A1:D1").format.font.size = 14;
        ctx.executeAsync().then(function () {
            app.showNotification("Write to Range"+rangeAddress+"is Successful!");
        }, function (error) {
            app.showNotification("Error", JSON.stringify(error));
        });
    }

    function writeEventRange(products) {

        var rangeValues = []
        var id = products.id;
        var title = products.title;
        var variantcount = products.inventory_quantity;
        var variantprice = products.price;
        var array = [id, title, variantcount, variantprice];
       
        rangeValues.push(array);

        var ctx = new Excel.ExcelClientContext();
        var sheet = ctx.workbook.worksheets.getItem('Sheet2');
        var rangeAddress = "A2:D2"
        var eventRange = sheet.getRange(rangeAddress);
        eventRange.insert("Down");
        var eventRangeOriginalLocation = sheet.getRange(rangeAddress);
        eventRangeOriginalLocation.values = rangeValues;
        ctx.executeAsync().then(function () {
            app.showNotification("Event Update to Range" + rangeAddress + "is Successful!");
        }, function (error) {
            app.showNotification("Error", JSON.stringify(error));
        });
    }

    function createChart() {
        var sheetName = "Sheet1";

        var ctx = new Excel.ExcelClientContext();
        ctx.workbook.worksheets.getActiveWorksheet().getRange("F1:G1").values = [["Price Range", "Count"]];
        ctx.workbook.worksheets.getActiveWorksheet().getRange("F2:G2").values = [["0-199", ""]];
        ctx.workbook.worksheets.getActiveWorksheet().getRange("F3:G3").values = [["200-399", ""]];
        ctx.workbook.worksheets.getActiveWorksheet().getRange("F4:G4").values = [["400-599", ""]];
        ctx.workbook.worksheets.getActiveWorksheet().getRange("F5:G5").values = [["600-799", ""]];
        ctx.workbook.worksheets.getActiveWorksheet().getRange("F6:G6").values = [["800-999", ""]];
        ctx.workbook.worksheets.getActiveWorksheet().getRange("F7:G7").values = [["1000+", ""]];

        var usedRange = ctx.workbook.worksheets.getActiveWorksheet().getUsedRange();
        ctx.load(usedRange);
        ctx.executeAsync().then(function () {
            var countRange = "D1:D" + usedRange.rowCount;

            ctx.workbook.worksheets.getActiveWorksheet().getRange("G2:G2").formulas = "=COUNTIF(" + countRange + ",\"<200\")";
            ctx.workbook.worksheets.getActiveWorksheet().getRange("G3:G3").formulas = "=COUNTIF(" + countRange + ",\"<400\")-G2";
            ctx.workbook.worksheets.getActiveWorksheet().getRange("G4:G4").formulas = "=COUNTIF(" + countRange + ",\"<600\")-G3-G2";
            ctx.workbook.worksheets.getActiveWorksheet().getRange("G5:G5").formulas = "=COUNTIF(" + countRange + ",\"<800\")-G4-G3-G2";
            ctx.workbook.worksheets.getActiveWorksheet().getRange("G6:G6").formulas = "=COUNTIF(" + countRange + ",\"<1000\")-G5-G4-G3-G2";
            ctx.workbook.worksheets.getActiveWorksheet().getRange("G7:G7").formulas = "=COUNTIF(" + countRange + ",\">=1000\")";
            ctx.workbook.tables.add(sheetName + "!F1:G7", true);
            ctx.executeAsync().then(function () {

                var chart = ctx.workbook.worksheets.getActiveWorksheet().charts.add(Excel.ChartType.columnClustered, sheetName + "!F1:G7", "auto");
                chart.title.text = "Price Distribution";
                chart.title.format.font.color = "blue";
                chart.dataLabels.showValue = true;

                chart.axes.categoryAxis.title.text = "Price";
                chart.axes.valueAxis.title.text = "Count";

                chart.axes.categoryAxis.title.format.font.color = "blue";
                chart.axes.valueAxis.title.format.font.color= "blue";
                
                var colors = ["Lavender", "Cyan", "GreenYellow", "green", "orange", "purple", "Gray"];
                for (var i = 0; i <6; i++) {
                    chart.series.getItemAt(0).points.getItemAt(i).format.fill.setSolidColor(colors[i]);
                }
                ctx.executeAsync().then(function () {
                    app.showNotification("Write to Range" + usedRange.address + "is Successful!");
                }, function (error) {
                    app.showNotification("Error", JSON.stringify(error));
                });
            });
        });
    }

    function pushData() {
        var sheetName = "Sheet1";
        var ctx = new Excel.ExcelClientContext();
        var json = {};
        var products = [];

        var range = ctx.workbook.worksheets.getActiveWorksheet().getRange("A:D").getUsedRange();
        ctx.load(range);
        ctx.executeAsync().then(function () {

            for (var i = 1; i < range.rowCount; i++) {
                products.push({
                    "id" :range.values[i][0], 
                    "title" : range.values[i][1],
                    "quantity" : range.values[i][2], 
                    "price:" : String(range.values[i][3])
                });
            }
            json = { "products": products }
            

           




            ctx.executeAsync().then(function () {
                app.showNotification("Write to Range" + JSON.stringify(json) + "is Successful!");
            }, function (error) {
                app.showNotification("Error", JSON.stringify(error));
            });
        });
        
    }

    
    function pushData() {
        var sheetName = "Sheet1";
        var ctx = new Excel.ExcelClientContext();

        var obj = new Object();
        var obj2 = new Object();
        obj2.products = []


        //var range = ctx.workbook.worksheets.getActiveWorksheet().getSelectedRange();;
        var range = ctx.workbook.getSelectedRange();

        //var range = ctx.workbook.worksheets.getActiveWorksheet().getRange("A5:D5");

        ctx.load(range);
        ctx.executeAsync().then(function () {

            for (var i = 0; i < range.rowCount; i++) {

                obj.id = range.values[i][0];
                obj.title = range.values[i][1];
                obj.inventory_quantity = range.values[i][2];
                obj.price = range.values[i][3];
                obj2.products.push(obj);
            }

            var jsonString = JSON.stringify(obj2);


            $.ajax({
                type: "POST",
                url: "http://localhost:4567/update",
                accept: "application/json",
                contentType: "application/json",
                dataType: 'json',
                data: jsonString,
                success: function (json) { writeRange(json); },
                failure: function (error) {
                    app.showNotification("Error", JSON.stringify(error));
                }
            });
        });
    }

    function deleteData() {
        var sheetName = "Sheet1";
        var ctx = new Excel.ExcelClientContext();

        var obj = new Object();
        var obj2 = new Object();
        obj2.products = []


        //var range = ctx.workbook.worksheets.getActiveWorksheet().getSelectedRange();;
        var range = ctx.workbook.getSelectedRange();

        //var range = ctx.workbook.worksheets.getActiveWorksheet().getRange("A5:D5");

        ctx.load(range);
        ctx.executeAsync().then(function () {

            for (var i = 0; i < range.rowCount; i++) {

                obj.id = range.values[i][0];
                obj.title = range.values[i][1];
                obj.inventory_quantity = range.values[i][2];
                obj.price = range.values[i][3];
                obj2.products.push(obj);
            }

            var jsonString = JSON.stringify(obj2);


            $.ajax({
                type: "POST",
                url: "http://localhost:4567/delete",
                accept: "application/json",
                contentType: "application/json",
                dataType: 'json',
                data: jsonString,
                success: function (json) { writeRange(json); },
                failure: function (error) {
                    app.showNotification("Error", JSON.stringify(error));
                }
            });
        });
    }

    function monitorEvents() {
        setInterval(monitorLogs, 3000);
    }

    function monitorLogs() {
        $.ajax({
            type: "GET",
            async:   false,
            url: "http://localhost:4567/myevents",
            accept: "application/json",
            dataType: 'json',
            success: function (json) { writeEventRange(json); },
            failure: function (error) {
                app.showNotification("Error", JSON.stringify(error));
            }
        });


    }
    function highlightInventory() {
        var ctx = new Excel.ExcelClientContext();
        var usedRange = ctx.workbook.worksheets.getActiveWorksheet().getRange("C:C").getUsedRange();
        ctx.load(usedRange);
        ctx.executeAsync().then(function () {
            for (var i = 1; i < usedRange.rowCount; i++) {
                var rangeaddr = "";
                if (usedRange.values[i][0] <= 3) {
                    var j = i + 1;
                    rangeaddr = "C" + j + ":C" + j;
                    ctx.workbook.worksheets.getActiveWorksheet().getRange(rangeaddr).format.fill.color = "red";

                }

            }


            ctx.executeAsync().then(function () {
                app.showNotification("Write to Range" + usedRange.address + "is Successful!");
            }, function (error) {
                app.showNotification("Error", JSON.stringify(error));
            });

        });
    }

})();