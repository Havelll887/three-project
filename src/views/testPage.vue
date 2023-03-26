<template>
  <div>ee</div>
</template>
<script>
import * as d3 from 'd3';

export default {
  mounted() {
    let dataList = [30, 10, 43, 55, 13];
    // 将源数据转换为可以生成饼图的数据(有起始角度（startAngle）和终止角度（endAngle）)
    let piedata = d3.pie()(dataList);
    console.log('=dwedwdw',piedata)
    // 画布的参数
    let mapWidth = 300;
    let mapHeight = 300;
    let mapPadding = 20;
    // 定义画布—— 宽 300 高 300 外边距 10px
    let svgMap = d3
      .select("div")
      .append("svg")
      .attr("width", mapWidth)
      .attr("height", mapHeight)
      .style("backgroundColor", "black");
    //定义弧形生成器
    let innerRadius = 0; //内半径，为0则中间没有空白
    let outerRadius = mapWidth / 2 - mapPadding; //外半径
    let arc_generator = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);
    // 创建分组
    let groups = svgMap
      .selectAll("g")
      .data(piedata)
      .enter()
      // 添加分组
      .append("g")
      .attr(
        "transform",
        "translate(" + mapWidth / 2 + "," + mapHeight / 2 + ")"
      );
    // 绘制饼图——添加弧形路径
    groups
      .append("path")
      // 给路径填充不同的颜色
      .attr("fill", function (d, i) {
        //定义颜色比例尺，让不同的扇形呈现不同的颜色
        let colorScale = d3
          .scaleOrdinal()
          .domain(d3.range(piedata.length))
          .range(d3.schemeCategory10);
        return colorScale(i);
      })
      // 根据饼图数据，绘制弧形路径
      .attr("d", function (d) {
        return arc_generator(d); //调用弧生成器，得到路径值
      });
    // 添加文字
    groups
      .append("text")
      .attr("transform", function (d) {
        //位置设在中心处
        return "translate(" + arc_generator.centroid(d) + ")";
      })
      .attr("text-anchor", "middle")
      .text(function (d) {
        return d.data;
      });
  },
};
</script>
<style scoped></style>
