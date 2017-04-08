$(document).ready(function(){

var myDB;
//Open Database Connection
document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady(){
myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});

myDB.transaction(function(transaction) {
transaction.executeSql('CREATE TABLE IF NOT EXISTS todo_list (id integer primary key, title text, desc text)', []);
});

// select ketika device siap onDeviceReady
//ambil data jika ada
myDB.transaction(function(transaction) {
transaction.executeSql('SELECT * FROM todo_list', [], function (tx, results) {
     var len = results.rows.length, i;
     // $("#rowCount").html(len);
     var icon = '';
     for (i = 0; i < len; i++){
      if (results.rows.item(i).desc == "active") {icon = "check"} else {icon = "minus"}
        $("#dinamis").append('<p class="candel" data-id="'+results.rows.item(i).id+'" data-title="'+results.rows.item(i).title+'" data-status="'+results.rows.item(i).desc+'"><span class="fa fa-'+icon+' cek"></span>'+results.rows.item(i).title+'<span class="fa fa-times tutup" id="dell"></span></p>');     
     }
  }, null);
});


}


//Insert New Data
$("#insert").click(function(){
  var title=$("#title").val();
  var desc=$("#desc").val();
  console.log(title +""+ desc);
  myDB.transaction(function(transaction) {
        var executeQuery = "INSERT INTO todo_list (title, desc) VALUES (?,?)";             
        transaction.executeSql(executeQuery, [title,desc]
            , function(tx, result) {
                 alert('Inserted');
            },
            function(error){
                 alert('Error occurred'); 
            });
    });
});

//Display Table Data
$("#showTable").click(function() {
    $("#TableData").html("");
    myDB.transaction(function(transaction) {
        transaction.executeSql('SELECT * FROM todo_list', [], function(tx, results) {
            var len = results.rows.length,
                i;
            $("#rowCount").html(len);
            for (i = 0; i < len; i++) {
                $("#TableData").append("<tr><td>" + results.rows.item(i).id + "</td><td>" + results.rows.item(i).title + "</td><td>" + results.rows.item(i).desc + "</td><td><a href='edit.html?id=" + results.rows.item(i).id + "&title=" + results.rows.item(i).title + "&desc=" + results.rows.item(i).desc + "'>Edit</a> &nbsp;&nbsp; <a class='delete' href='#' id='" + results.rows.item(i).id + "'>Delete</a></td></tr>");
            }
        }, null);
    });
});




$("#tambah").click(function(e) {
    e.preventDefault();
    // jika fa fa-time beriakan value active => untuk status cek di to do list app
    var one = $('#addVal').val();
    if (one == '') {
        alert('input tidak boleh kosong');
        $("#tambah").die();
    }

    myDB.transaction(function(transaction) {
        var executeQuery = "INSERT INTO todo_list (title, desc) VALUES (?,?)";
        transaction.executeSql(executeQuery, [one, "non-active"], function(tx, result) {
                // alert('Inserted');
            },
            function(error) {
                alert('Error occurred');
            });
    });


    myDB.transaction(function(transaction) {
        transaction.executeSql('SELECT id FROM todo_list ORDER BY id DESC LIMIT 1', [], function(tx, results) {
            var len = results.rows.length,
                i;
            for (i = 0; i < len; i++) {
              var plusOne = results.rows.item(i).id;
                $("#dinamis").append('<p class="candel" data-id="' + plusOne + '" data-title="' + one + '" data-status="non-active"><span class="fa fa-minus cek"></span>' + one + '<span class="fa fa-times tutup" id="dell"></span></p>');
            }
        }, null);
    });
    //after insert clear inout
    $('input[type="text"]').val('');
});




$(document).on('click', '#dell', function() {
    $(this).parentsUntil('#dinamis').slideUp("slow", function() { $(this).remove(); });
    var pID = $(this).attr('data-id');
    myDB.transaction(function(transaction) {
    var executeQuery = "DELETE FROM todo_list where id=?";
    transaction.executeSql(executeQuery, [pID],
      //On Success
      function(tx, result) {
        if (result.rowsAffected < 0) {
          alert("delete berhasil");
        }
      },
      //On Error
      function(error){alert('Something went Wrong');});
  });

});

$(document).on('click', '.candel', function() {
    $(this).children().first().toggleClass("fa-minus fa-check ijo");
    var pID = $(this).attr('data-id');
    var pStatus = $(this).attr('data-status');
    
switch(pStatus) {
    case "active":
        $(this).attr('data-status','non-active');
          myDB.transaction(function(transaction) {
            var executeQuery = "UPDATE todo_list SET desc='non-active' WHERE id=?";
            transaction.executeSql(executeQuery, [pID],
              //On Success
              function(tx, result) {},
              //On Error
              function(error){alert('Something went Wrong');});
          });
        break;
    case "non-active":
        $(this).attr('data-status','active');
          myDB.transaction(function(transaction) {
            var executeQuery = "UPDATE todo_list SET desc='active' WHERE id=?";
            transaction.executeSql(executeQuery, [pID],
              //On Success
              function(tx, result) {},
              //On Error
              function(error){alert('Something went Wrong');});
          });
        break;
}



    

});

$(document).on('click', '#cek-data', function() {
    var aidi = $(".candel").attr('data-id');
    var niluai = $(".candel").attr('data-title');
    var stuatus = $(".candel").attr('data-status');
    alert(aidi+niluai+stuatus);
});


//toggle sidebar
$('#menu-toggle').click(function(e){
    e.stopPropagation();
    $('#wrapper').toggleClass('toggled');
});
    $('#wrapper').click(function(e){
    e.stopPropagation();
});
$('body,html').click(function(e){
   $('#wrapper').removeClass('toggled');
});



// 

// //Delete Tables
// $("#update").click(function(){
//   var id=$("#id").text();
//   var title=$("#title").val();
//   var desc=$("#desc").val()
//   myDB.transaction(function(transaction) {
//     var executeQuery = "UPDATE todo_list SET title=?, desc=? WHERE id=?";
//     transaction.executeSql(executeQuery, [title,desc,id],
//       //On Success
//       function(tx, result) {alert('Updated successfully');},
//       //On Error
//       function(error){alert('Something went Wrong');});
//   });
// });

// $("#DropTable").click(function(){
//     myDB.transaction(function(transaction) {
//         var executeQuery = "DROP TABLE  IF EXISTS todo_list";
//         transaction.executeSql(executeQuery, [],
//             function(tx, result) {alert('Table deleted successfully.');},
//             function(error){alert('Error occurred while droping the table.');}
//         );
//     });
// });

});


