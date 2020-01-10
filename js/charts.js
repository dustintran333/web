var dur1 = 200;
var dur2 = 0;
var ext_icon = '.jpg';
var ext_bottle = '.jpg';
function drawSeriesChart(dataSet = window[init[5]], c = init, hideLabel = false) {
    /*  myData: selected variable dataset ie. myData2017
     *  c: table headers
     *  hideLabel: hide label checkbox
     * */

    console.log("params: " + c);
    console.log('loc ' + locationList);

    //filter data based on location, if locationList is empty => select all
    var filteredData = dataSet;
    if (locationList.length) { //check empty
        filteredData = dataSet.filter(x => locationList.includes(x[dataSet[0].indexOf('location')])); //based on locationList. The thing is it filtered out the header
        filteredData.unshift(dataSet[0]); //therefore we have to add headers at the beginning
    }

    console.log('f ' + filteredData);

    //extract 5 columns from dataset based on c
    var extracted = filteredData.map(x => [
        x[dataSet[0].indexOf(c[0])], //get index of headers, use index to retrieve values from dataset
        x[dataSet[0].indexOf(c[1])],
        x[dataSet[0].indexOf(c[2])],
        x[dataSet[0].indexOf(c[3])],
        x[dataSet[0].indexOf(c[4])]
    ])
    //add dummy data if empty
    if (extracted.length == 1) extracted.push(['', 0, 0, 0, 0]); //only empty if filteredData is empty. if empty push dummy values

    console.log(extracted);

    //Convert data to google table for drawing
    var data = google.visualization.arrayToDataTable(extracted);

    //Set options for bubble chart
    var options = {
        title: "SCOTCH WHISKY EXPLORER",
        titleTextStyle: { fontSize: 18, fontName: "Roboto" },
        hAxis: {
            title: c[1],
            titleTextStyle: { color: '#607d8b' },
            //gridlines: { count:}, 
            textStyle: { color: '#000', fontName: 'Roboto', fontSize: '12', bold: true }
        },
        vAxis: {
            title: c[2],
            minValue: 0,
            gridlines: { color: '#37474f', count: 4 },
            //baselineColor: 'transparent',
            textStyle: { color: '#000', fontName: 'Roboto', fontSize: '12', bold: true }

        },
        legend: { position: 'top', alignment: 'center', textStyle: { color: '#607d8b', fontName: 'Roboto', fontSize: '12' } },
        //colors: ["#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39"],
        colorAxis: {
            legend: {
                textStyle: { color: '#000', fontName: 'Roboto', fontSize: '16', bold: true }

            },
            colors: ["#253133", "#00FFFF", "#FF033E"]//["#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39"]
        },
        bubble: { textStyle: { fontSize: 10, fontName: "Roboto" } },
        explorer: {},
        lineWidth: 1,
        chartArea: {
            right: '20', top: "60", bottom: "60", left: "60", //margin space for chart area
            backgroundColor: {
                stroke: '#4322c0',
                strokeWidth: 3
            }
        },
        animation: {
            duration: dur1,
            easing: 'inAndOut',
            startup: true,
        }
    }

    //check for hideLabel
    if (hideLabel) options.bubble.textStyle.color = "transparent";

    //draw bubble chart
    var chart = new google.visualization.BubbleChart(document.getElementById('series_chart_div'));
    chart.draw(data, options);

    //event binding
    google.visualization.events.addListener(chart, 'select', selectHandler); //on select'
    google.visualization.events.addListener(chart, 'onmouseover', mouseOverHandler); //mouseover

    //handler for click/select event on bubble chart
    function selectHandler(e) {
        console.log("clicked");
        var selected = chart.getSelection(); //get row number in datatable
        //var mouseOver = e.row; //get row number in datatable

        if (selected.length) {
            var bottle_name = data.getFormattedValue(selected[0].row, 0); //if empty, get all
            //var bottle_name = data.getFormattedValue(mouseOver,0);

            var lstBottle = whiskeyData.filter(item => (item.indexOf(bottle_name) > -1 ? true : false)); // >-1 == found bottle, return [lstBottle]
            var bottle_val = [
                bottle_name,
                lstBottle[0][whiskeyData[0].indexOf('peaty')],
                lstBottle[0][whiskeyData[0].indexOf('smoky')],
                lstBottle[0][whiskeyData[0].indexOf('sweet')],
                lstBottle[0][whiskeyData[0].indexOf('savoury')]
            ];
            console.log("clicked b " + bottle_val);
            if (!bottle_name) bottle_name = "empty";
            $("#select_image").attr("src", "img/whiskey/" + encodeURI(bottle_name) + ext_bottle);
            drawStackedBarchart([["name", "peaty", "smoky", "sweet", "savoury"], bottle_val], "select_div");
        }
    }

    //handler for mouseover event on bubble chart
    function mouseOverHandler(e) {
        //var selected = chart.getSelection(); //get row number in datatable
        var mouseOver = e.row; //get row number in datatable

        //var bottle_name = data.getFormattedValue(selected[0].row,0);
        var bottle_name = data.getFormattedValue(mouseOver, 0);

        var lstBottle = whiskeyData.filter(item => (item.indexOf(bottle_name) > -1 ? true : false)); // >-1 == found, return [lstBottle]
        var bottle_val = [
            bottle_name,
            lstBottle[0][whiskeyData[0].indexOf('peaty')],
            lstBottle[0][whiskeyData[0].indexOf('smoky')],
            lstBottle[0][whiskeyData[0].indexOf('sweet')],
            lstBottle[0][whiskeyData[0].indexOf('savoury')]
        ];
        //console.log("b " + bottle_val);
        //console.log("bottle " + bottle);

        //display bottle
        if (!bottle_name) bottle_name = "empty";
        $("#mouseover_image").attr("src", "img/whiskey/" + encodeURI(bottle_name) + ext_bottle);

        //handling icon box
        var iconList = ["peaty icon", "smoky icon", "sweet icon", "savoury icon"] //list of icons
            .map(x => dataSet[0].indexOf(x)) //return index array from above []
            .map(x => lstBottle[0][x].split(',').map(x => x.trim())); //split on ',' and trim spaces

        console.log(iconList);

        iconList.map((x, index) => {
            $("#icon_" + index).html(""); //prepare empty icon box
            x.map(x => {
                if (x.toString()) { //check empty for each category 

                    var img_icon = $("<img>").attr(
                        {
                            src: 'img/icon/' + encodeURI(x) + ext_icon, //ext
                            alt: x,
                            title: x,
                            class: "icon_img"
                        });
                    $("#icon_" + index).append(img_icon);
                }
            })
        });

        drawStackedBarchart([["name", "peaty", "smoky", "sweet", "savoury"], bottle_val], "mouse_over_div");
    }
}

//draw stacked bar with 'data' into 'area'
function drawStackedBarchart(data, area) {
    console.log("draw stacked " + data);

    var options = {
        chartArea: {
            right: '20', top: "40", bottom: "40", left: "60", //margin space for chart area
        },
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: true,
        animation: {
            duration: dur2,
            easing: 'linear',
            startup: true,
        },
        colors: ['#8c5f8d', '#f9cd48', '#f38986', '#88aeb8'],
    };
    var chart = new google.visualization.BarChart(document.getElementById(area));
    chart.draw(google.visualization.arrayToDataTable(data), options);
}