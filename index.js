function showInfo() {
  let info = document.querySelector('.tables');
  if (info.style.display === "none") {
    info.style.display = "block";
  } 
}

function showDeletes() {
    var del = document.querySelector('.deletebtns');
    if (del.style.display === "none") {
      del.style.display = "block";
    } else {
      del.style.display = "none";
    }
} 

function sendTest() {
  $.ajax({
    url: "http://35.231.236.18:8080/test",
    contentType: "application/json",
    type: "GET",
    statusCode: {
      201: function (res) {
        console.log(res);
      },
      404: function (res) {
        console.log(res);
      }
    }
  });
}

function sendCreate() {
  $.ajax({
    url: "http://35.231.236.18:8080/make",
    contentType: "application/json",
    type: "POST",
    statusCode: {
      201: function (res) {
        console.log(res);
      },
      404: function (res) {
        console.log(res);
      }
    }
  });
  showInfo();
}

function sendCreateID() {
  let id = document.getElementById('idNum').innerText;
  $.ajax({
    url: `http://35.231.236.18:8080/make/${id}`,
    contentType: "application/json",
    type: "POST",
    statusCode: {
      201: function (res) {
        console.log(res);
      },
      404: function (res) {
        console.log(res);
      }
    }
  });
  showInfo();
}

function sendRead() {
  $.ajax({
    url: "http://35.231.236.18:8080/list",
    contentType: "application/json",
    type: "GET",
    statusCode: {
      200: function (res) {
        console.log(res);
      },
      404: function (res) {
        console.log(res);
      }
    },
  });
}

function sendUpdate() {
  let infoTable = document.getElementById('infoTable');
  $.ajax({
    url: "http://35.231.236.18:8080/list",
    contentType: "application/json",
    type: "GET",
    statusCode: {
      200: function (res) {
        for (let i = 0; i < infoTable.rows.length; i++) {
          let row = infoTable.rows[i];
          row.deleteCell(0);
          infoTable.deleteRow(i);
        }
        for (let i = 0; i < res.length; i++) {
            let row = document.createElement('tr');
            let cell = row.insertCell(0);
            cell.innerHTML = res[i];
        }
        console.log(res);
      },
      404: function (res) {
        console.log(res);
      }
    },
  });
  showInfo();
}

function sendDeleteID() {
  let id = document.getElementById('idNum').innerText;
  $.ajax({
    url: `http://35.231.236.18:8080/delete/${id}`,
    contentType: "application/json",
    type: "DELETE",
    statusCode: {
      200: function (res) {
        console.log(res);
      },
      404: function (res) {
        console.log(res);
      }
    }
  });
  showDeletes();
}

function sendDeleteAll() {
  $.ajax({
    url: "http://35.231.236.18:8080/delete",
    contentType: "application/json",
    type: "DELETE",
    statusCode: {
      200: function (res) {
        console.log(res);
      },
      404: function (res) {
        console.log(res);
      }
    }
  });
  showDeletes();
}


