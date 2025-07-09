const scriptUrl = "https://script.google.com/macros/s/AKfycbwoOKwTlrnQVxRdplScqo6qt4kx4HUG8SF3sqLF0BvMfE23lzaFCoMezFYg0G0xnyXX/exec"

$(document).ready(function() {
  let data3 = []
  $.getJSON(scriptUrl, function(data) {
    data3 = data.data2

    $("#result").autocomplete({
      source: function(request, response) {
        let term = request.term.toUpperCase()
        let filteredCodes = data3.filter(function(item) {
          return item[1].toUpperCase().startsWith(term) || (item[4] && typeof item[4] === 'string' && item[4].toUpperCase().startsWith(term))
        })

        let uniqueCodes = []
        let seen = {}

        filteredCodes.forEach(function(item) {
          if (!seen[item[1]]) {
            uniqueCodes.push(item)
            seen[item[1]] = true
          }
        })

        response($.map(uniqueCodes, function(item) {
          let label = item[1].toUpperCase().startsWith(term) ? item[1] : item[4]
          return { label: label, value: label, data: item }
        }))
      },
      minLength: 8,
      select: function(event, ui) {
        let selectedData = ui.item.data
        let mmCode = selectedData[1]
      },
    })

    $("#result, #IDresult").on("change", function() {
      let selectedCode = $("#result").val()
      updateTable(selectedCode, data3)
    })

    $("#search").on("click", function() {
      let selectedCode = $("#result").val()
      updateTable(selectedCode, data3)
      $('#textdata').css('display', 'none')
    })

    $('#resetButton').on('click', function() {
      $('#result').val("")
      $('#textdata').css('display', 'block')
      $('#tabledata').css('display', 'none')
    })


    $("#rejectButton").on("click", function() {
      $("#myModal").modal("hide")
    })

    function updateTable(selectedCode) {
      let matchingRows = data3.filter(function(item) {
        return (
          (selectedCode && item[1] === selectedCode) ||
          (selectedCode && item[4] === selectedCode)
        )
      })
      let count = 0;
      let sum = 0;

      let tableBody = $("#table-body")
      tableBody.empty()
      matchingRows.forEach(function(row) {
        const tabledata = $('#tabledata')
        tabledata.css('display', 'block')
        let rowHtml =
          "<tr>" +
          "<td>" + row[2] + "</td>" +
          "<td>" + row[3] + "</td>" +
          "<td>" + row[9] + "</td>" +
          "<td><button class='btn btn-primary check-button' data-toggle='modal' data-target='#myModal' data-code='" + row[0] + "'>ตรวจสอบ</button></td>" +
          "</tr>"
        tableBody.append(rowHtml)
        count++;
        if (row[12] === "รอชำระ") {
          sum += parseFloat(row[7]);
        }
      })

      $("#Numberofitems").val(count);
      $("#TotalSumOfRow6").val(sum);

      $(".check-button").on("click", function() {
        let code = $(this).data("code")

        let row = data3.find(function(item) {
          return item[0] === code
        })

        if (row) {
          let data11 = row[11]
          let data5 = row[5]
          let data6 = row[6]
          let data7 = row[7]
          let data8 = row[8]
          let data9 = row[9]
          let data10 = row[10]
          let data12 = row[12]

          $("#data0").val(data11)
          $("#data1").val(data5)
          $("#data1").val(data5)
          $("#data2").val(data6)
          $("#data3").val(data7)
          $("#data4").val(data8)
          $("#data5").val(data9)
          $("#data6").val(data10)
          $("#data7").val(data12)

          $("#myModal").modal("show")
        } else {
          console.log("Row not found.")
        }
      })
    }
  })
})
