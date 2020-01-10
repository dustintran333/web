//values for inputs
var arr = [ // == window[init[5]][0]
    "name",
    "price",
    "location",
    "year",
    "abv",
    "peaty",
    "smoky",
    "sweet",
    "savoury",
];
//default selected values
var init = [
    "name",    
    "price",
    "year",
    "location",
    "savoury",
    "whiskeyData",
];
var locationList = []; //list of selected locations
var strList = ["name","location","abv"]; //columns with str values for exclusion

//load google chart engine
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawSeriesChart);

//jquery
$(function () {
    //Initalise data on load
    arr.map(
        x => {
            if (strList.includes(x)) { //if x is in string list
                $("#colour_axis").append($("<option>").val(x).html(x));
            }
            else {
                $("#x_axis").append($("<option>").val(x).html(x));
                $("#y_axis").append($("<option>").val(x).html(x));
                $("#colour_axis").append($("<option>").val(x).html(x));
                $("#size_axis").append($("<option>").val(x).html(x));
            }
        }
    );

    //Set selected <option> for <select> using init variable
    $("#x_axis").find("option[value=" + init[1] + "]").attr("selected", "selected");
    $("#y_axis").find("option[value=" + init[2] + "]").attr("selected", "selected");
    $("#colour_axis").find("option[value=" + init[3] + "]").attr("selected", "selected");
    $("#size_axis").find("option[value=" + init[4] + "]").attr("selected", "selected");

    //function for processing changes, refresh charts
    var myFunction = function (e) {//Get dataSet and params from <select>
        console.log("got: " + $("#data_set").val());
        var dataSet = window[$('input[name=data_set]:checked').val()]; //
        var params = ["name", $("#x_axis").val(), $("#y_axis").val(), $("#colour_axis").val(), $("#size_axis").val()];
        var hideLabel = $('#hidelabel').prop('checked');
        console.log(hideLabel);
        drawSeriesChart(dataSet, params, hideLabel);
    }
    
    //Handle click + change event
    $("#btnApply, #hidelabel_group").on("click", myFunction); //click
    $("#x_axis, #y_axis, #colour_axis, #size_axis").on("change", myFunction); //change

    //Handle svg map click
    $("#highlands, #islands, #campbeltown, #islay, #lowlands, #speyside").on("click", function(e){
        //$(this).closest('g').attr('id'); //clicked location
        //$("g").removeClass("map-clicked");
        $(this).closest('g').toggleClass("map-clicked");
        locationList = $("g.map-clicked").map(function(){return $(this).attr("id");}).get(); //get ids of .map-clicked class
        myFunction();        
    });
});