var ext_icon = '.jpg';
var ext_bottle = '.jpg';
var fileCheck = whiskeyData;
fileCheck[0].indexOf("name")
var list = //get icon list 
  fileCheck.slice(1).map((x, index) => {
    //get bottle name bugs
    var img = $("<img>").attr('src', "img/whiskey/" + encodeURI(x[fileCheck[0].indexOf("name")]) + ext_bottle);
    //console.log(sequence);
    img.on('error', function (e) {
      console.log(e);
      $("#b_bottle").append( //line bottle cat_name icon_name
        '<tr>' +
        '<td>' + (index + 2) + '</td>' +
        '<td>' + x[fileCheck[0].indexOf("name")] + '</td>' +
        '<tr>'
        //' bottle_name: ' +  + x + '.png' + ' line: ' + (+1) +  +'<br>'
      )
    })

    return ["peaty icon", "smoky icon", "sweet icon", "savoury icon"].map(i => {
      if (x[fileCheck[0].indexOf(i)].toString()) {
        return x[fileCheck[0].indexOf(i)].split(',').map(x => x.trim());
      }
      else return []
    })
  }
  );

console.log(list);
//find icon bugs
list.map((item, index) => {
  item.map((iconList, iIndex) =>
    iconList.map(x => {
      if (x.toString()) { //check empty for icon
        var img = $("<img>").attr('src', "img/icon/" + x + ext_icon);
        img.on('error', function (e) {
          $("#b_icon").append( //line bottle cat_name icon_name
            '<tr>' +
            '<td>' + (index + 1) + '</td>' +
            '<td>' + fileCheck[index][fileCheck[0].indexOf("name")] + '</td>' +
            '<td>' + ["peaty icon", "smoky icon", "sweet icon", "savoury icon"][iIndex] + '</td>' +
            '<td>' + x + '</td>' +
            '<tr>'
            //' bottle_name: ' +  + x + '.png' + ' line: ' + (+1) +  +'<br>'
          )
        })
      }
    })
  )
});