$().ready(function () {
      $("#content").empty();
      let window_url = window.location.href;
      let w_url = window_url.split("=")
      let id = w_url[1]
      $.ajax({
            type: "GET",
            data: {
                  id: id
            },
            dataType: 'json',
            url: url + "richArticals",
            success: function (res) {
                  console.log(res)
                  let content = ''
                  content = res.data.rows[0].content
                  res.data.rows[0].title = $("#titles").text()
                  $("#content").append(content)
            }
      })
})