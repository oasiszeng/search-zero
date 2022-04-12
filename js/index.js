user_input_form = $("#user-input");
res_anchor = $("#res-anchor");

let formula, x_left, x_right, max_val, min_val;
// 拦截表单提交并进行数据处理

// formula异常提示函数：
function formula_tips() {}
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
    $("#formula_error").append(`发生了错误: ${error.message}`);
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
      res_list.push([x - 1, x]);
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
function plot(root, interval) {
  title = `零点区间[${interval}]`;
  functionPlot({
    title: title,
    target: root,
    width: $(root).width(),
    height: $(root).height(),
    xAxis: { domain: interval },
    grid: true,
    data: [{ fn: user_formula }],
  });
}

// 绘制整体函数图像
function plot_overall(root, interval) {
  functionPlot({
    title: "整体函数图像",
    target: "#image_anchor",
    width: $("#image_anchor").width(),
    height: $("#image_anchor").height(),
    yAxis: { domain: [min_val, max_val] },
    xAxis: { domain: [x_left, x_right] },
    grid: true,
    data: [{ fn: user_formula }],
  });
}

// 拦截执行函数
function intercept_submit(e) {
  // 参数获取：
  user_formula = document.getElementById("user-formula").value;
  formula = user_formula;
  x_left = document.getElementById("x-left").value;
  x_right = document.getElementById("x-right").value;
  x_left = Number(x_left);
  x_right = Number(x_right);
  res_list = search_zero_interval();
  // 最大值、最小值返回到结果锚点
  content = `<p>最大值：${max_val}  最小值：${min_val}</p>`;
  res_anchor.append(content);
  // 绘制整体函数图像
  plot_overall();
  // 绘制结果区间
  res_list.forEach((element, id) => {
    root = `#image_anchor${id}`;
    image_anchor = `<div id="image_anchor${id}" style="width: 600px; height: 200px;">`;
    res_anchor.append(image_anchor);
    plot(root, element);
  });
  return false;
}

user_input_form.on("submit", intercept_submit);
