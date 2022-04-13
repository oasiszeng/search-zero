res_anchor = $("#res-anchor");
search_button = $("#search-button")

let formula, x_left, x_right, max_val, min_val;
// 函数大小约定
let image_width = 600, image_height = 400;
// formula异常提示函数：
function formula_tips() { }
// formula 数学表达式转换为js运算式
function formula_check() {
  /**
   * 指数运算： ^ ==> **
   * 三角函数运算：
   *  sin(x) ==> Math.sin(x)
   *  cos(x) ==> Math.cos(x)
   * 对数函数：
   *  log(x) ==> Math.log(x)
   *   */
  formula = formula.replace("^", "**");
  formula = formula.replace("log(x)", "Math.log(x)");
  let x = x_left;
  try {
    eval(formula);
  } catch (error) {
    console.log(error);
    $("#formula-error").append(`发生了错误: ${error.message}`);
  }
}

// 零点区间搜索
function search_zero_interval() {
  formula_check(formula, x_left);
  let x = x_left;
  let interval_left = eval(formula);
  max_val = interval_left;
  min_val = interval_left;
  let interval_right = 0;
  let res_list = [];
  for (x = x_left + 1; x <= x_right; x++) {
    interval_right = eval(formula);
    if (interval_left * interval_right <= 0) {
      interval = [x - 1, x]
      swing = [interval_left, interval_right]
      res_list.push([interval, swing])
    }
    interval_left = interval_right;
    if (max_val < interval_right) {
      max_val = interval_right;
    }
    if (min_val > interval_right) {
      min_val = interval_right;
    }
  }
  return res_list;
}

// 绘制区间函数图像
let user_formula;
function plot(root, interval, swing) {
  title = `零点区间[${interval}]`;
  functionPlot({
    title: title,
    target: root,
    width: image_width,
    height: image_height,
    xAxis: { domain: interval },
    yAxis: { domain: swing },
    grid: true,
    data: [{ fn: user_formula }],
  });
}

// 绘制整体函数图像
function plot_overall() {
  functionPlot({
    title: "整体函数图像",
    target: "#image-anchor",
    width: image_width * 1.2,
    height: image_height * 1.2,
    yAxis: { domain: [min_val, max_val] },
    xAxis: { domain: [x_left, x_right] },
    grid: true,
    data: [{ fn: user_formula }],
  });
}

// 零点搜索函数
function search_zero() {
  // 如果当前页面已经绘制过一次函数了，再次绘制另一个函数需要回撤上一次的元素
  $("#res-anchor").empty()
  $("#image-anchor").empty()
  $("#formula-error").empty()
  // 参数获取：
  user_formula = document.getElementById("user-formula").value;
  formula = user_formula;
  x_left = document.getElementById("x-left").value;
  x_right = document.getElementById("x-right").value;
  x_left = Number(x_left);
  x_right = Number(x_right);
  res_list = search_zero_interval();
  // 最大值、最小值返回到结果锚点
  content = `<p style="text-align: center;">最大值：${max_val}  最小值：${min_val}</p>`;
  res_anchor.append(content);
  // 绘制整体函数图像
  plot_overall();
  // 绘制结果区间
  res_list.forEach((element, id) => {
    root = `#image_anchor${id}`;
    image_anchor = `<div id="image_anchor${id}" style="text-align: center;">`;
    res_anchor.append(image_anchor);
    plot(root, element[0], element[1]);
  });
  return false;
}

search_button.click(() => {
  search_zero();
})
