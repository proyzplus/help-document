var business_data = []//商户后台数据
var agent_data = []//收银机端数据
var pos_data = []//pos机端数据
var h5_data = []//h5端数据
var procedures_data = []//巢品荟端数据
const delay = (function () {
      let timer = 0;
      return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
      };
})();
getAllData()
//进来开始获取所有数据并进行保存，所有操作对该下面的数据进行操作
function getAllData() {
      //请求商户后台数据
      if (business_data.length == 0) {
            $.ajax({
                  type: "GET",
                  data: {
                        tabId: 101,
                        limit: 1000,
                        isAll: false
                  },
                  dataType: 'json',
                  url: url + "documents",
                  success: function (res) {
                        business_data = res;
                        operation()
                  }
            })
      } else {
            operation()
      }
}
//点击头部标签进行切换数据
var generalTitle = ""
$("#ul_list li a").click(function () {
      generalTitle = $(this).attr("href");
      if (generalTitle == "#business") {
            operation()
      }
      if (generalTitle == "#agent") {
            if (agent_data.length == 0) {
                  //请求收银机端数据
                  // console.log("请求收银机端数据")
                  $.ajax({
                        type: "GET",
                        data: {
                              tabId: 102,
                              limit: 1000,
                              isAll: false
                        },
                        dataType: 'json',
                        url: url + "documents",
                        success: function (res) {
                              agent_data = res;
                              operation()
                        }
                  })
            } else {
                  operation()
            }
      }
      if (generalTitle == "#admin") {
            if (pos_data.length == 0) {
                  //请求pos机端数据
                  // console.log("请求pos机端数据")
                  $.ajax({
                        type: "GET",
                        data: {
                              tabId: 103,
                              limit: 1000,
                              isAll: false
                        },
                        dataType: 'json',
                        url: url + "documents",
                        success: function (res) {
                              pos_data = res;
                              operation()
                        }
                  })
            } else {
                  operation()
            }
      }
      if (generalTitle == "#h5") {
            if (h5_data.length == 0) {
                  //请求h5端数据
                  // console.log("请求h5端数据")
                  $.ajax({
                        type: "GET",
                        data: {
                              tabId: 104,
                              limit: 1000,
                              isAll: false
                        },
                        dataType: 'json',
                        url: url + "documents",
                        success: function (res) {
                              h5_data = res;
                              operation()
                        }
                  })
            } else {
                  operation()
            }
      }
      if (generalTitle == "#procedures") {
            if (procedures_data.length == 0) {
                  //请求巢品荟端数据
                  // console.log("请求巢品荟端数据")
                  $.ajax({
                        type: "GET",
                        data: {
                              tabId: 105,
                              limit: 1000,
                              isAll: false
                        },
                        dataType: 'json',
                        url: url + "documents",
                        success: function (res) {
                              procedures_data = res;
                              operation()
                        }
                  })
            } else {
                  operation()
            }
      }
})
//具体执行方法
function operation() {
      var data = []
      if (generalTitle) {
            if (generalTitle == "#business") {
                  generalTitle = generalTitle.slice(1)
                  data = business_data
            } else if (generalTitle == "#agent") {
                  generalTitle = generalTitle.slice(1)
                  data = agent_data
            } else if (generalTitle == "#admin") {
                  generalTitle = generalTitle.slice(1)
                  data = pos_data
            } else if (generalTitle == "#h5") {
                  generalTitle = generalTitle.slice(1)
                  data = h5_data
            } else if (generalTitle == "#procedures") {
                  generalTitle = generalTitle.slice(1)
                  data = procedures_data
            }
      } else {
            generalTitle = "business"
            data = business_data
      }
      if (data.length == 0) {
            return false
      }
      if ($(window).width() < 768) {
            $("#deletes").empty()
            let leftData = data.data.rows
            for (var n = 1; n < leftData.length; n++) {
                  for (var k = 0; k < leftData.length - 1; k++) {
                        var max = leftData[k].index;
                        var nextCount = leftData[k + 1].index;
                        if (nextCount < max) {
                              var preData = leftData[k];
                              leftData[k] = leftData[k + 1];
                              leftData[k + 1] = preData;
                        }
                  }
            }
            for (let i = 0; i < leftData.length; i++) {
                  let id = leftData[i].id
                  let fa = ''
                  let son = ""
                  for (let j = 0; j < leftData.length; j++) {
                        if (leftData[j].fatherId == id) {
                              son += '<a class="as" href="' + '#' + generalTitle + '/' + leftData[j].id + '"><li class="asd" data-toggle="collapse" data-target=".navbar-collapse"><p>'
                                    + leftData[j].title + '</p></li></a>'
                        }
                  }
                  if (leftData[i].type == "document") {
                        fa += '<div class="displayfa"><div class="father_title"><p>' + leftData[i].title
                              + '</p><img id="lt" class="lrotate" src="img/select.png"></div><ul class="son_title">'
                              + son + '</ul></div>'
                  }
                  $("#deletes").append(fa)
            }
            // <-- 右侧显示内容 -->
            $("#de_content").empty();
            let rightData = data.data.rows
            let content = ''
            for (let i = 0; i < rightData.length; i++) {
                  if (rightData[i].type == "file") {
                        content += '<a id="' + generalTitle + '/' + leftData[i].id + '"><div class="content_main"><div class="content_top"><p>'
                              + rightData[i].title + '</p></div><hr><div class="content_bottom"><div class="content_main_box">'
                              + rightData[i].content + '</div></div></div></a>'
                  }
            }
            $("#de_content").append(content);
            clickImg()
            mobileAnimation()
      } else if ($(window).width() >= 768) {
            $("#delete").empty();//将左侧数据设置为空
            let a_data = data.data.rows
            //冒泡排序--将数据从小到大排序
            for (var n = 1; n < a_data.length; n++) {
                  for (var k = 0; k < a_data.length - 1; k++) {
                        var max = a_data[k].index;
                        var nextCount = a_data[k + 1].index;
                        if (nextCount < max) {
                              var preData = a_data[k];
                              a_data[k] = a_data[k + 1];
                              a_data[k + 1] = preData;
                        }
                  }
            }
            //左侧显示的数据
            for (let i = 0; i < a_data.length; i++) {
                  let id = a_data[i].id
                  let fa = ''
                  let son = ""
                  for (let j = 0; j < a_data.length; j++) {
                        if (a_data[j].fatherId == id) {
                              son += '<a  class="as" href="' + '#' + generalTitle + '/' + a_data[j].id + '"><li class="asd"><p>'
                                    + a_data[j].title + '</p></li></a>'
                        }
                  }
                  if (a_data[i].type == "document") {
                        fa += '<div class="displayfa"><div class="father_title"><p>' + a_data[i].title
                              + '</p><img id="lt" class="lrotate" src="img/select.png"></div><ul class="son_title">'
                              + son + '</ul></div>'
                  }
                  $("#delete").append(fa)
            }
            // <-- 右侧显示内容 -->
            $("#de_content").empty();
            let content = ''
            for (let i = 0; i < a_data.length; i++) {
                  if (a_data[i].type == "file") {
                        content += '<a name="' + generalTitle + '/' + a_data[i].id + '"><div class="content_main" id = "' + generalTitle + a_data[i].id + '"><div class="content_top"><p>'
                              + a_data[i].title + '</p></div><hr><div class="content_bottom"><div class="content_main_box">'
                              + a_data[i].content + '</div></div></div></a>'
                  }
            }
            $("#de_content").append(content);
            chose();
            anmiations()
      }
      // $(document).find('img').addClass("lazy")
}
//移动端搜索框
var isFrist = false;
$(".search_icon").click(function () {
      if (isFrist) {
            isFrist = false
      } else {
            $(".search_input").css("display", "")
            $(this).css("display", "none")
            isFrist = true;
      }
});
//搜索1.0
function pc_search() {
      $(".lenovo_search").css("display", "block")
      $("#lenovo_con").empty()
      let key = ''
      if ($(window).width() > 768) {
            key = document.getElementById("lenovos").value
      } else {
            key = document.getElementById("lenovo").value
      }
      if (key == "") {
            $(".lenovo_search").css("display", "none")
            $("#lenovo_con").empty()
      } else {
            delay(function () {
                  search(key)
            }, 500)
      }
}
//搜索2.0
function search(data) {
      $.ajax({
            type: "GET",
            data: {
                  key: data,
                  limit: 1000
            },
            dataType: 'json',
            url: url + "documents",
            success: function (res) {
                  console.log(res)
                  $("#lenovo_con").empty()
                  let tab = ""
                  for (let i = 0; i < res.data.rows.length; i++) {
                        let fa = ''
                        if (res.data.rows[i].tabId == "101") {
                              tab = "business"
                        } else if (res.data.rows[i].tabId == "102") {
                              tab = "agent"
                        } else if (res.data.rows[i].tabId == "103") {
                              tab = "admin"
                        } else if (res.data.rows[i].tabId == "104") {
                              tab = "h5"
                        } else if (res.data.rows[i].tabId == "105") {
                              tab = "procedures"
                        }
                        if (res.data.rows[i].type == "file") {
                              let ad = tab
                              let id = + res.data.rows[i].id
                              fa += '<li><div class="content_left"><ul><a><li><p>'
                                    + res.data.rows[i].father.title + '</p></li></a></ul></div>'
                                    + '<div class="content_right"><ul>' + '<li style="width:100%;" onclick="dis(' + ad + ',' + id + ')"><a style="width:100%;" href="' + '#' + tab + '/' + res.data.rows[i].id
                                    + '"><p>' + res.data.rows[i].title + '</p></a></li>' + '</ul></div></li>'
                        }
                        $("#lenovo_con").append(fa)
                  }
            }
      })
}
//搜索3.0
function dis(ad, ids) {
      let a_url = ad.id
      topHeader(a_url)
      let data = ''
      if (a_url == "business") {
            data = business_data
      } else if (a_url == "agent") {
            data = agent_data
      } else if (a_url == "admin") {
            data = pos_data
      } else if (a_url == "h5") {
            data = h5_data
      } else if (a_url == "procedures") {
            data = procedures_data
      }
      $("#delete").empty();//将左侧数据设置为空
      let a_data = data.data.rows
      //冒泡排序--将数据从小到大排序
      for (var n = 1; n < a_data.length; n++) {
            for (var k = 0; k < a_data.length - 1; k++) {
                  var max = a_data[k].index;
                  var nextCount = a_data[k + 1].index;
                  if (nextCount < max) {
                        var preData = a_data[k];
                        a_data[k] = a_data[k + 1];
                        a_data[k + 1] = preData;
                  }
            }
      }
      //左侧显示的数据
      for (let i = 0; i < a_data.length; i++) {
            let id = a_data[i].id
            let fa = ''
            let son = ""
            for (let j = 0; j < a_data.length; j++) {
                  if (a_data[j].fatherId == id) {
                        son += '<a  class="as" href="' + '#' + a_url + '/' + a_data[j].id + '"><li class="asd"><p>'
                              + a_data[j].title + '</p></li></a>'
                  }
            }
            if (a_data[i].type == "document") {
                  fa += '<div class="displayfa"><div class="father_title"><p>' + a_data[i].title
                        + '</p><img id="lt" class="lrotate" src="img/select.png"></div><ul class="son_title">'
                        + son + '</ul></div>'
            }
            $("#delete").append(fa)
      }
      // <-- 右侧显示内容 -->
      $("#de_content").empty();
      let content = ''
      for (let i = 0; i < a_data.length; i++) {
            if (a_data[i].type == "file") {
                  content += '<a name="' + a_url + '/' + a_data[i].id + '"><div class="content_main" id = "' + a_url + a_data[i].id + '"><div class="content_top"><p>'
                        + a_data[i].title + '</p></div><hr><div class="content_bottom"><div class="content_main_box">'
                        + a_data[i].content + '</div></div></div></a>'
            }
      }
      $("#de_content").append(content);
      anmiations()
}
// <-- 以下皆为动画 -->
function choseBoot() {
      $("#top_list").removeClass("in");
}
$(".lenovo_content").click(function () {
      $(".lenovo_search").css("display", "none")
      $("#lenovo_con").empty()
})
function search_dis() {
      $(".lenovo_search").css("display", "none")
      $(".search_input").css("display", "none")
      $(".search_icon").css("display", "block")
      $("#lenovo").val("")
}
function addClass() {
      $(".search_input").css("display", "none")
      $(".search_icon").css("display", "block")
      isFrist = false
}
//头部标签样式
function chose() {
      var oUl = document.getElementById('ul_list');
      var Lis = oUl.getElementsByTagName('li');
      for (var i = 0; i < Lis.length; i++) {
            Lis[i].index = i;
            Lis[i].onclick = function () {
                  if (this.index == 0) {
                        $("#business").css({ "color": "#ff6900", "borderBottom": "2px solid #ff6900", "fontWeight": "800" })
                        $("#agent,#admin,#h5,#procedures").css({ "color": "black", "borderBottom": "0px", "fontWeight": "100" })
                  } else if (this.index == 1) {
                        $("#agent").css({ "color": "#ff6900", "borderBottom": "2px solid #ff6900", "fontWeight": "800" })
                        $("#business,#admin,#h5,#procedures").css({ "color": "black", "borderBottom": "0px", "fontWeight": "100" })
                  } else if (this.index == 2) {
                        $("#admin").css({ "color": "#ff6900", "borderBottom": "2px solid #ff6900", "fontWeight": "800" })
                        $("#agent,#business,#h5,#procedures").css({ "color": "black", "borderBottom": "0px", "fontWeight": "100" })
                  } else if (this.index == 3) {
                        $("#h5").css({ "color": "#ff6900", "borderBottom": "2px solid #ff6900", "fontWeight": "800" })
                        $("#agent,#admin,#business,#procedures").css({ "color": "black", "borderBottom": "0px", "fontWeight": "100" })
                  } else if (this.index == 4) {
                        $("#procedures").css({ "color": "#ff6900", "borderBottom": "2px solid #ff6900", "fontWeight": "800" })
                        $("#agent,#admin,#h5,#business").css({ "color": "black", "borderBottom": "0px", "fontWeight": "100" })
                  }
            }
      }
}
function closeinput() {
      $("#lenovo").val("")
      $(".lenovo_search").css("display", "none")
      $("#top_list").removeClass("in");
      $(".search_input").css("display", "none")
      $(".search_icon").css("display", "block")
      isFrist = false
}
//放大图片
function imgShow(outerdiv, innerdiv, bigimg, _this) {
      var src = _this.attr("src");
      $(bigimg).attr("src", src);
      $("<img/>").attr("src", src).load(function () {
            var windowW = $(window).width();
            var windowH = $(window).height();
            var realWidth = this.width;
            var realHeight = this.height;
            var imgWidth, imgHeight;
            var scale = 0.8;
            if (realHeight > windowH * scale) {
                  imgHeight = windowH * scale;
                  imgWidth = imgHeight / realHeight * realWidth;
                  if (imgWidth > windowW * scale) {
                        imgWidth = windowW * scale;
                  }
            } else if (realWidth > windowW * scale) {
                  imgWidth = windowW * scale;
                  imgHeight = imgWidth / realWidth * realHeight;
            } else {
                  imgWidth = realWidth;
                  imgHeight = realHeight;
            }
            $(bigimg).css("width", imgWidth);

            var w = (windowW - imgWidth) / 2;
            var h = (windowH - imgHeight) / 2;
            $(innerdiv).css({
                  "top": h,
                  "left": w
            });
            $(outerdiv).fadeIn("fast");
      });
      $(outerdiv).click(function () {
            $(this).fadeOut("fast");
      });
}
//点击图片放大图片
function clickImg() {
      if ($(window).width() < 768) {
            $("#de_content").on('click', 'img', function () {
                  var _this = $(this);
                  imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
            })
      }
}
//移动端点击动画
function mobileAnimation() {
      $(".father_title").on("click", function () {
            $(this).parents(".displayfa").children(".son_title").slideToggle(500).parents(".displayfa").siblings(".displayfa").children(".son_title").slideUp(500);
            $(this).parents(".displayfa").children(".father_title").css("color", "#ff6900").parents(".displayfa").siblings(".displayfa").children(".father_title").css("color", "black");
            $(this).parents(".displayfa").children(".father_title").children("img").css({ "transform": "rotate(0deg)", "transition": "transform 0.5s" }).parents(".displayfa").siblings(".displayfa").children(".father_title").children("img").css({ "transform": "rotate(90deg)", "transition": "transform 0.5s" })
            $('.asd').children("p").css({
                  "backgroundColor": "#ffffff",
                  "borderRight": "0px solid #ffffff"
            })
      })
      //点击动画
      $(".as").on("click", function () {
            $(this).children(".asd").children("p").css({
                  "color": "#ff6900",
                  "borderRight": "2px solid #ff6900"
            })
            $(this).siblings(".as").children(".asd").children("p").css({
                  "color": "black",
                  "borderRight": "0px solid #ffffff"
            })
      })
}
//左侧鼠标动画
function anmiations() {
      $(".father_title").on("click", function () {
            $(this).parents(".displayfa").children(".son_title").slideToggle(500).parents(".displayfa").siblings(".displayfa").children(".son_title").slideUp(500);
            $(this).parents(".displayfa").children(".father_title").css("color", "#ff6900").parents(".displayfa").siblings(".displayfa").children(".father_title").css("color", "black");
            $(this).parents(".displayfa").children(".father_title").children("img").css({ "transform": "rotate(0deg)", "transition": "transform 0.5s" }).parents(".displayfa").siblings(".displayfa").children(".father_title").children("img").css({ "transform": "rotate(90deg)", "transition": "transform 0.5s" })
      })
      //鼠标移入动画
      $(".asd").mouseenter(function () {
            $(this).children('p').css({
                  "color": "#ff6900",
                  "backgroundColor": "rgb(255, 240, 229)"
            })
      }).mouseleave(function () {
            $(this).children('p').css({
                  "color": "black",
                  "backgroundColor": "#ffffff"
            })
      });
      //点击动画
      $(".as").on("click", function () {
            $(this).children(".asd").children("p").css({
                  "color": "#ff6900",
                  "borderRight": "2px solid #ff6900"
            })
            $(this).siblings(".as").children(".asd").children("p").css({
                  "backgroundColor": "#ffffff",
                  "borderRight": "0px solid #ffffff"
            })
      })
}
//搜索框点击让头部导航变样式
function topHeader(a_url) {
      let index = a_url
      if (index == "business") {
            $("#business").css({ "color": "#ff6900", "borderBottom": "2px solid #ff6900", "fontWeight": "800" })
            $("#agent,#admin,#h5,#procedures").css({ "color": "black", "borderBottom": "0px", "fontWeight": "100" })
      } else if (index == "agent") {
            $("#agent").css({ "color": "#ff6900", "borderBottom": "2px solid #ff6900", "fontWeight": "800" })
            $("#business,#admin,#h5,#procedures").css({ "color": "black", "borderBottom": "0px", "fontWeight": "100" })
      } else if (index == "admin") {
            $("#admin").css({ "color": "#ff6900", "borderBottom": "2px solid #ff6900", "fontWeight": "800" })
            $("#agent,#business,#h5,#procedures").css({ "color": "black", "borderBottom": "0px", "fontWeight": "100" })
      } else if (index == "h5") {
            $("#h5").css({ "color": "#ff6900", "borderBottom": "2px solid #ff6900", "fontWeight": "800" })
            $("#agent,#admin,#business,#procedures").css({ "color": "black", "borderBottom": "0px", "fontWeight": "100" })
      } else if (index == "procedures") {
            $("#procedures").css({ "color": "#ff6900", "borderBottom": "2px solid #ff6900", "fontWeight": "800" })
            $("#agent,#admin,#h5,#business").css({ "color": "black", "borderBottom": "0px", "fontWeight": "100" })
      }
}
$(function () {
      //一段正则，匹配所有_min.的图片src属性
      var test = /_min\./
      //遍历所有的图片节点
      $("img").each(function (index, obj) {
            if (test.test($(this).attr("src"))) {
                  var reSrc = $(this).attr("src").replace(test, ".");
                  $(this).attr("src", reSrc)
            }
      })
})