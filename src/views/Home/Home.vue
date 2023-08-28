<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px;">
      <!-- 用户信息 -->
      <el-card class="box-card" shadow="hover">
        <div class="user">
          <img src="../../assets/user.png" alt="">
          <div class="user-info">
            <p class="name">Admin</p>
            <p class="role">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登陆时间：<span>2022-7-11</span></p>
          <p>上次登陆地点：<span>天津市静海区</span></p>
        </div>
      </el-card>

      <!-- table -->
      <el-card class="box-card" shadow="hover" style="margin-top: 20px; height: 350px;">
        <el-table :data="tableData">
          <!-- colum:横向排列  :prop 内容 :lable 标签 -->
          <el-table-column v-for="(item, index) in tableLable" :key="index" :prop="index" :label="item"></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px;">
      <div class="num">
        <el-card :body-style="{ display: 'flex', padding: 0 }" v-for="(item, index) in countData" :key="index">
          <component class="icons" :is="item.icon" :style="{ background: item.color }"></component>
          <div class="detail">
            <p class="num">￥{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <el-card style="height: 280px;">
        <div ref="echart" style="height: 280px;"></div>
      </el-card>
      <div class="graph">
        <el-card style="height: 260px;">
          <div ref="userechart" style="height: 240px;"></div>
        </el-card>
        <el-card style="height: 260px;">
          <div ref="videoechart" style="height: 240px;"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import home from '../../api/mockData/home'
import * as echarts from 'echarts'
export default {
  setup() {
    const { proxy } = getCurrentInstance()
    let tableData = ref([])
    let countData = ref([])

    const tableLable = {
      name: '课程',
      todayBuy: '今日购买',
      monthBuy: '本月购买',
      totalBuy: '总购买'
    }

    // 获取左侧表单数据
    const getTableList = async () => {
      // await axios.get('/home/getData').then((res) => {  本地mock数据
      /* await axios.get('https://www.fastmock.site/mock/a16b17233e253ffe50e9f27bb831c115/api/api/getTableData').then((res) => {  // 线上mock数据
        let data = res.data
        if (data.code == 200) {
          tableData.value = data.data
        }
      }) */
      let res = await proxy.$api.getTableData()
      tableData.value = res
    }

    // 获取count数据
    const getCountData = async () => {
      let res = await proxy.$api.getCountData()
      countData.value = res
    }

    onMounted(() => {
      getTableList(),
        getCountData(),
        getChartData()
    })

    // echarts 表格渲染
    let xOptions = reactive({
      textStyle: {
        color: '#333',
      },
      grid: {
        left: "20%",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: [],
        axisLine: {
          lineStyle: {
            color: '#17b3a3'
          }
        },
        axisLable: {
          interval: 0,
          color: '#333'
        }
      },
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: '#17b3a3'
            }
          }
        }
      ],
      color: ["#2ec7c9", '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
      series: []
    })

    let orderData = reactive({
      xData: [],
      series: []
    })

    let pieOptions = reactive({
      tooltip: {
        trigger: "item",
      },
      color: [
        "#0f78f4",
        "#dd536b",
        "#9462e5",
        "#a6a6a6",
        "#e1bb22",
        "#39c362",
        "#3ed1cf"
      ],
      series: []
    })

    let userData = reactive({
      xData: [],
      series: [],
    })

    let videoData = reactive({
      series: [],
    })

    // 获取数据
    const getChartData = async () => {
      let result = await proxy.$api.getChartData();
      let res = result.orderData
      let userRes = result.userData
      let videoRes = result.videoData
      orderData.xData = res.date
      // 将数据中的 key 通过遍历取出
      const keyArray = Object.keys(res.data[0])
      const series = []
      // 折线图
      keyArray.forEach((key) => {  // 通过 forEach 循环将数据 push 到 series 中
        series.push({
          name: key,
          // data是 key 对应的值，通过 map 返回
          data: res.data.map((item) => item[key]),
          type: 'line'
        })
      })
      orderData.series = series
      xOptions.xAxis.data = orderData.xData
      xOptions.series = orderData.series

      // useraData进行渲染
      let hEcharts = echarts.init(proxy.$refs['echart'])
      hEcharts.setOption(xOptions)

      // 柱状图进行渲染
      userData.xData = userRes.map((item) => item.date)
      userData.series = [
        {
          name: '新增用户',
          data: userRes.map((item) => item.new),
          type: 'bar'
        },
        {
          name: '活跃用户',
          data: userRes.map((item) => item.active),
          type: 'bar'
        },
      ]

      xOptions.xAxis.data = userData.xData
      xOptions.series = userData.series
      let uEcharts = echarts.init(proxy.$refs['userechart'])
      uEcharts.setOption(xOptions)

      // 饼状图
      videoData.series = [
        {
          data: videoRes,
          type: 'pie',
        }
      ]
      pieOptions.series = videoData.series
      let vEcharts = echarts.init(proxy.$refs['videoechart'])
      vEcharts.setOption(pieOptions)
    }

    return {
      tableData,
      tableLable,
      countData
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  .user {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;

    img {
      height: 130px;
      width: 130px;
      border-radius: 50%;
      margin-right: 40px;
    }
  }

  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;

      span {
        color: #666;
        margin-left: 10px;
      }
    }
  }

  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }

    .icons {
      width: 80px;
      height: 80px;
      font-size: 30px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }

    .detail {
      margin-left: 35px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .num {
        font-size: 25px;
      }

      .txt {
        font-size: 14px;
        text-align: center;
        color: #999;
      }
    }
  }

  .graph {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    .el-card {
      width: 48%;
    }
  }
}
</style>