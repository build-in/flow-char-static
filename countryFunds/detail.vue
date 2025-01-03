<template>
  <div class="page-container desisionFlowGraph" v-loading.fullscreen.lock="loading">
    <div class="page-header">
      <TopSelection
        :topSelectionData="topSelectionData"
        :graphVersionList="graphVersionList"
      />
      <!-- <el-button type="primary" style="margin-left: 20px;" @click="changelcyData">切换数据</el-button> -->
    </div>
    <div class="page-footer">
      <SclaleGraph />
    </div>
    <div class="pay-table-all-set" v-if="allVib">
      <!-- left -->
      <el-col v-if="leftVib" class="payin-vo">
        <div class="show-quanping" @click="() => { showtable('in') }"><el-button icon="el-icon-full-screen"
            circle></el-button></div>
        <div class="payin-vo-conx">
          <div>
            <div class="pay-title">渠道结算收款资金流量表</div>
            <el-table :data="CHANNEL_CLEARING_RECEIVABLES_NEW.summeryTableData" border  stripe max-height="750" row-key="id" size="mini"
              :row-class-name="payInTableRowClassName" style="width: 280px; margin-bottom: 10px; overflow: scroll;">
              <el-table-column
                :fixed="index == 0"
                :prop="item.key"
                :label="item.label"
                :width="index== 0 ? '140px' :'140px'"
                v-for="(item, index) in CHANNEL_CLEARING_RECEIVABLES_NEW.summeryHeaders" :key="index">
              </el-table-column>
            </el-table>
          </div>
          <div>
            <div class="pay-title">渠道充值资金流量表</div>
            <el-table :data="CHANNEL_TOP_UP_NEW.summeryTableData" border  stripe max-height="750" row-key="id" size="mini"
              :row-class-name="payInTableRowClassName" style="width: 280px; margin-bottom: 10px; overflow: scroll;">
              <el-table-column
               :fixed="index == 0"
               :prop="item.key"
               :label="item.label"
               :width="index== 0 ? '140px' :'140px'"
                v-for="(item, index) in CHANNEL_TOP_UP_NEW.summeryHeaders" :key="index">
              </el-table-column>
            </el-table>
          </div>
          <div>
            <div class="pay-title">VA收款资金流量表</div>
            <el-table :data="VA_RECEIVABLES_NEW.summeryTableData" border stripe max-height="750" row-key="id" size="mini"
              :row-class-name="payInTableRowClassName" style="width: 280px; margin-bottom: 10px; overflow: scroll;">
              <el-table-column
              :fixed="index == 0"
              :prop="item.key"
              :label="item.label"
              :width="index== 0 ? '140px' :'140px'"
                v-for="(item, index) in VA_RECEIVABLES_NEW.summeryHeaders" :key="index">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
      <div v-else class="payin-vo-none"></div>
      <!-- bottom -->
      <div v-if="bottomVib" class="pay-footer">
        <div class="show-quanping-bottom" @click="() => { showtable('bottom') }"><el-button icon="el-icon-full-screen"
            circle></el-button></div>
        <div class="pay-footer-conx-lit">
          <el-row class="flex-row">
            <el-col :span="8">
              <el-table :data="ACCOUNT_BALANCE_CHANGES_NEW.summeryTableData" border stripe max-height="750" row-key="id" size="mini"
                :row-class-name="payInTableRowClassName">
                <el-table-column :prop="item.key" :label="item.label"
                  v-for="(item, index) in ACCOUNT_BALANCE_CHANGES_NEW.summeryHeaders" :key="index">
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="16">
              <div style="display: flex;">
                <div class="new-blanck"></div>
                <el-table
                  :data="BUSINESS_TYPE_FLOW_NETTING_NEW.summeryTableData"
                  border
                  stripe
                  max-height="750"
                  row-key="id"
                  size="mini"
                  class="gacha-form-table"
                  :cell-style="tableCellStyle">
                  <el-table-column :prop="item.key" :label="item.label"
                    v-for="(item, index) in BUSINESS_TYPE_FLOW_NETTING_NEW.summeryHeaders" :key="index">
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-else class="pay-footer"></div>
      <!-- right -->
      <el-col v-if="rightVib" class="payout-vo mgtop">
        <div class="show-quanping" @click="() => { showtable('out') }"><el-button icon="el-icon-full-screen"
            circle></el-button></div>
        <div class="payout-vo-conx">
          <div class="pay-title">资金代发资金流量表</div>
          <el-table :data="FUNDS_REPLACE_SEND_NEW.summeryTableData" border stripe max-height="750" row-key="id" size="mini"
            :row-class-name="payInTableRowClassName" style="width: 280px; margin-bottom: 10px; overflow: scroll;">
            <el-table-column
              :fixed="index == 0"
              :prop="item.key"
              :label="item.label"
              :width="index== 0 ? '140px' :'140px'"
              v-for="(item, index) in FUNDS_REPLACE_SEND_NEW.summeryHeaders" :key="index">
            </el-table-column>
          </el-table>
          <div class="pay-title">结算资金流量表</div>
          <el-table :data="SETTLEMENT_FUNDS_NEW.summeryTableData" border stripe max-height="750" row-key="id" size="mini"
            :row-class-name="payInTableRowClassName" style="width: 280px; margin-bottom: 10px; overflow: scroll;">
            <el-table-column
              :fixed="index == 0"
              :prop="item.key"
              :label="item.label"
              :width="index== 0 ? '140px' :'140px'"
              v-for="(item, index) in SETTLEMENT_FUNDS_NEW.summeryHeaders" :key="index">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <div v-else class="payout-vo-none"></div>
    </div>
    <div class="pay-table-all-set" v-else></div>
    <div class="wrap">
      <div class="content">
        <div ref="containerDetailRef" class="container" id="containerDetailRef" />
      </div>
    </div>
    <div class="table-dialog">
      <!-- <left> -->
      <el-dialog :visible.sync="dialogIn" width="75%">
        <div class="payin-vo-conx">
          <div>
            <div class="pay-title">渠道结算收款资金流量表</div>
             <div  v-if="CHANNEL_CLEARING_RECEIVABLES_NEW.tableData.length">
              <FundsChart :options="getOptions('CHANNEL_CLEARING_RECEIVABLES_NEW',CHANNEL_CLEARING_RECEIVABLES_NEW.tableData)"  chartId="CHANNEL_CLEARING_RECEIVABLES_NEW" />
             </div>
            <el-table :data="CHANNEL_CLEARING_RECEIVABLES_NEW.tableData" border stripe max-height="750" row-key="id"
              size="mini" :row-class-name="payInTableRowClassName" style="margin-bottom: 10px;">
              <el-table-column :fixed="index == 0" :prop="item.key" :label="item.label"
                v-for="(item, index) in CHANNEL_CLEARING_RECEIVABLES_NEW.headers" :key="index">
              </el-table-column>
            </el-table>
          </div>
          <div>
            <div class="pay-title">渠道充值资金流量表</div>
             <div v-if="CHANNEL_TOP_UP_NEW.tableData.length">
              <FundsChart  :options="getOptions('CHANNEL_TOP_UP_NEW',CHANNEL_TOP_UP_NEW.tableData)"  chartId="CHANNEL_TOP_UP_NEW" />
             </div>
            <el-table :data="CHANNEL_TOP_UP_NEW.tableData" border stripe max-height="750" row-key="id" size="mini"
              :row-class-name="payInTableRowClassName" style="margin-bottom: 10px;">
              <el-table-column :fixed="index == 0" :prop="item.key" :label="item.label"
                v-for="(item, index) in CHANNEL_TOP_UP_NEW.headers" :key="index">
              </el-table-column>
            </el-table>
          </div>
          <div>
            <div class="pay-title">VA收款资金流量表</div>
            <div v-if="VA_RECEIVABLES_NEW.tableData.length">
              <FundsChart :options="getOptions('VA_RECEIVABLES_NEW',VA_RECEIVABLES_NEW.tableData)" chartId="VA_RECEIVABLES_NEW" />
            </div>
            <el-table :data="VA_RECEIVABLES_NEW.tableData" border stripe max-height="750" row-key="id" size="mini"
              :row-class-name="payInTableRowClassName" style="margin-bottom: 10px;">
              <el-table-column :fixed="index == 0" :prop="item.key" :label="item.label"
                v-for="(item, index) in VA_RECEIVABLES_NEW.headers" :key="index">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-dialog>
        <!-- <right> -->
      <el-dialog :visible.sync="dialogOut" width="75%">
        <div class="payout-vo-conx">
          <div class="pay-title">资金代发资金流量表</div>
          <div v-if="FUNDS_REPLACE_SEND_NEW.tableData.length">
            <FundsChart :options="getOptions('FUNDS_REPLACE_SEND_NEW',FUNDS_REPLACE_SEND_NEW.tableData)" chartId="FUNDS_REPLACE_SEND_NEW" />
          </div>
          <el-table :data="FUNDS_REPLACE_SEND_NEW.tableData" border stripe max-height="750" row-key="id" size="mini"
            :row-class-name="payInTableRowClassName" style="margin-bottom: 10px;">
            <el-table-column :fixed="index == 0" :prop="item.key" :label="item.label"
              v-for="(item, index) in FUNDS_REPLACE_SEND_NEW.headers" :key="index">
            </el-table-column>
          </el-table>
          <div class="pay-title">结算资金流量表</div>
          <div v-if="SETTLEMENT_FUNDS_NEW.tableData.length">
            <FundsChart :options="getOptions('SETTLEMENT_FUNDS_NEW',SETTLEMENT_FUNDS_NEW.tableData)" chartId="SETTLEMENT_FUNDS_NEW" />
          </div>
          <el-table :data="SETTLEMENT_FUNDS_NEW.tableData" border stripe max-height="750" row-key="id" size="mini"
            :row-class-name="payInTableRowClassName" style="margin-bottom: 10px;">
            <el-table-column :fixed="index == 0" :prop="item.key" :label="item.label"
              v-for="(item, index) in SETTLEMENT_FUNDS_NEW.headers" :key="index">
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
        <!-- <bottom> -->
      <el-dialog :visible.sync="dialogBottom" width="75%">
        <div class="pay-footer-conx">
          <div class="pay-title">账户的余额变动数据表</div>
          <el-table :data="ACCOUNT_BALANCE_CHANGES_NEW.tableData" border stripe  max-height="750" row-key="id" size="mini"
            :row-class-name="payInTableRowClassName">
            <el-table-column :fixed="index == 0" :prop="item.key" :label="item.label"
              v-for="(item, index) in ACCOUNT_BALANCE_CHANGES_NEW.headers" :key="index">
            </el-table-column>
          </el-table>
          <div class="pay-title">业务流量轧差表</div>
          <el-table
            :data="BUSINESS_TYPE_FLOW_NETTING_NEW.tableData"
            border
            stripe
            max-height="750"
            row-key="id"
            size="mini"
            class="gacha-detail-form-table"
            :row-class-name="payInTableRowClassName"
            :header-cell-style="tableDetailCellStyle"
            >
            <el-table-column :fixed="index == 0" :prop="item.key" :label="item.label"
              v-for="(item, index) in BUSINESS_TYPE_FLOW_NETTING_NEW.headers" :key="index">
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
    <el-drawer title="说明" :visible.sync="infoVib" :modal="false" :show-close="true" size="20%" :with-header="false">
      <div class="tip-container">
        <Tips />
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { Graph } from '@antv/x6';
import { initShape } from './shape';

import CountrySelect from "@/components/funds/select/CountrySelect";
import { getFlowContent, getFlowDynamicTableData } from "@/api/liquidity/topology.js";
import TopSelection from './components/index.vue';
import SclaleGraph from './components/scale/index.vue';
import Tips from './components/Tip.vue';
// import { flowchartDetails } from "@/api/common";
// import { mockData } from './mock/index';
import { deleteNode, line_tooltip, line_scale_rules, rectangle_color, line_color, table_behavier_rules, get_url_params, get_default_table }  from './const/index';
import FundsChart from './components/chart/index.vue';
// import { getDictInfo } from "@/api/common";
import {export_json_to_excel_many_sheets} from '@/vendor/Export2Excel';

export default {
  name: 'countryFundsDetail',
  components: {
    CountrySelect,
    TopSelection,
    Tips,
    FundsChart,
    SclaleGraph
  },
  provide() {
    return {
      app: this
    }
  },
  data() {
    return {
        dialogIn: false,
        dialogOut: false,
        dialogBottom: false,
        id: this.$route.query.id,
        flowNo: this.$route.query.flowNo,
        graphCountry: '',
        ruleSetId: '',
        flowId: '',
        loading: false,
        domainCode: '',
        formData: {
          labelText: '',//节点名称
          ruleSetId: '',   //规则集id
          ruleId: '',   //规则id
          condExp: '',  //条件表达式
          type: '' //节点类型
        },
        //中间画布
        graph: {},
        //左边拖拽
        curCel: {},
        isNode: false,
        isEdge: false,
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight - 76,
        leftVib: false,
        rightVib: false,
        bottomVib: false,
        allVib: false,
        infoVib: false,
        // 表集合
        CHANNEL_TOP_UP_NEW: {
          tableData: [],
          headers: [],
          summeryTableData: [],
          summeryHeaders: [],
        },
        CHANNEL_CLEARING_RECEIVABLES_NEW: {
          tableData: [],
          headers: [],
          summeryTableData: [],
          summeryHeaders: [],
        },
        BUSINESS_TYPE_FLOW_NETTING_NEW: {
          tableData: [],
          headers: [],
          summeryTableData: [],
          summeryHeaders: [],
        },
        VA_RECEIVABLES_NEW: {
          tableData: [],
          headers: [],
          summeryTableData: [],
          summeryHeaders: [],
        },
        ACCOUNT_BALANCE_CHANGES_NEW: {
          tableData: [],
          headers: [],
          summeryTableData: [],
          summeryHeaders: [],
        },
        SETTLEMENT_FUNDS_NEW: {
          tableData: [],
          headers: [],
          summeryTableData: [],
          summeryHeaders: [],
        },
        FUNDS_REPLACE_SEND_NEW: {
          tableData: [],
          headers: [],
          summeryTableData: [],
          summeryHeaders: [],
        },
        // 动态表格数据
        detailTableData:[],
        // 顶部筛选的参数
        topSelectionData: {
          flowName: this.$route.query.flowName,
          country: this.$route.query.country,
        },
        lycDataFlag:true,
        zhouFlag:true,
        topStartTime: this.getPreMonthTime(),
        topEndTime:  this.getCurrentMonthTime(),
        tableVersion: {},
        graphVersionList:[],
      }
  },
  created() {
    this.initDetail();
    initShape();
    this.initClick();
    // this.initCountry();
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      this.removeElementsByClassName('x6-graph-svg-decorator');
      this.queryVerifyClass();
    });
  },
  watch: {
        $route(to, from) {
          this.init();
        }
  },
  beforeDestroy(){
    let that = this;
    window.removeEventListener('resize', ()=> {
      that.setTableAllSet();
    })
  },
  activated() {
  },
  methods: {
    init(){
      this.initFlow();
      this.setTableAllSet();
      const that = this;
      window.addEventListener('resize',  ()=> {
        that.setTableAllSet();
      });
    },
    removeElementsByClassName(className) {
      const elements = document.getElementsByClassName(className);
      while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
      }
    },
    queryVerifyClass(){
      this.$nextTick(() => {
        const parentElement = document.getElementById('containerDetailRef');
        if (!parentElement) return;
        const elementsWithClassName = parentElement.getElementsByClassName('verify-card');
        for (let i = 0; i < elementsWithClassName.length; i++) {
          let classNames = elementsWithClassName[i].className.split(' ');
          let newClassNames = classNames.filter(function(className) {
                  return className !== 'verify-card';
          });
          elementsWithClassName[i].className = newClassNames.join(' ');
        }
      });
    },
    getCurrentMonthTime(){
      return new Date().getTime();
    },
    getPreMonthTime(){
      return new Date().setMonth(new Date().getMonth() - 1);
    },
    setTopVersion(val){
      // 需要变更唯一主键 新增id 不需要通过flowNo + version 组合确定数据唯一性
      // if(val.flowNo == this.flowNo) return;
      // 更新国家视图 + 画布 + 总结表格 + 详细表格 + 柱状图
      console.log(val, '123456789000');
      this.tableVersion = val;
      const params = {
        fundFlowViewList: get_default_table,
        id: val.id,
        params: {
          timeFrame: this.zhouFlag? 'week':'month',
          startDate: this.topStartTime,
          endDate: this.topEndTime,
        }
      };
      this.varyDiffenentDynamiticTableData(params);
      this.changeGraphVersion(val.id);
      console.log(this.tableVersion, 'this.tableVersionthis.tableVersion');
    },
    setTopTime(start, end){
      [this.topStartTime, this.topEndTime] = [start, end];
      this.initDetail();
    },
    // 选择币种时候不更新接口，而是根据币种类型切换不同的数据
    setLCYorUSD(flag){
      this.lycDataFlag = flag;
      //更新列表视图数据
      this.initDetail();
      // 重新渲染表格根据币种类型
      // this.dealAllType(this.detailTableData, this.lycDataFlag)
    },
    setZhouorYue(flag){
      this.zhouFlag = flag;
      this.initDetail();
    },
    set_Y_Axis(rules, channelName, data, type){
      let series = [];
      let temp = [];
      // Y轴右侧 折线图环比
      for (let i = 0; i < channelName.length; i++) {
        series.push({
          name: channelName[i],
          type: 'line',
          data: this.getZheGraphData(this.getEndResult(this.getChannelData(data, type), channelName[i])),
        })
      }
      series.forEach(item => {
        if(item.data.length){
          temp.push(...item.data);
        }
      });

      let [maxValue, minValue] = [temp.reduce((max, value) => {
        const numValue = Number(value);
        return Math.max(max, numValue);
      }, -Infinity),temp.reduce((min, value) => {
        const numValue = Number(value);
        return Math.min(min, numValue);
      }, Infinity) ];

      let yAxis = [{
          type: 'value',
          name: '汇总金额',
          min: 0,
          max: rules[0] || '',
          interval: rules[1] || '',
          axisLabel: {
            formatter: function (value) {
                // return value + " " + (lycDataFlag ? 'lcy' : 'usd');
                return value;
            }
          }
      },
      {
          type: 'value',
          name: '环比',
          yAxisIndex: 0,
          splitLine: {
              show: false
          },
          axisTick: {
            show: false
          },
          min: Math.round(minValue - 10),
          max: Math.round(maxValue + 10),
          interval: (channelName.length &&   channelName.length > 1) ? Math.abs(Math.floor(maxValue - minValue))/5 : Math.abs(Math.floor(maxValue - minValue)),
          axisLabel: {
            formatter: function (value, index) {
                return value + '%';
            }
          }
      }];

    if(channelName.length && channelName.length > 1){
      for (let i = 1; i < channelName.length; i++) {
        yAxis.push({
          type: 'value',
          name: '',
          splitLine: {
              show: false
          },
          axisTick: {
            show: false
          },
          yAxisIndex: i + 1,
          min: Math.round(minValue - 10),
          max: Math.round(maxValue + 10),
          interval: Math.abs(Math.floor(maxValue - minValue))/5,
          axisLabel: {
            formatter: function (value, index) {
                return value + '%';
            }
          }
        });
      }
    }
      return yAxis;
    },
    getEndResult(data, name){
      const result = {};
      const scaleRules = [];
      data.forEach(obj => {
          for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                  result[key] = obj[key];
              }
          }
      });
      if(result[name] && result[name].length){
        for (let i = 0; i < result[name].length; i++) {
          if(result[name] && result[name][i]){
            scaleRules.push(result[name][i].includes(',') ? parseInt(result[name][i].replace(/,/g, '')) : parseInt(result[name][i]));
          }
        }
      }
      return scaleRules;
    },
    set_Series(data, channelName, rectangle_color,line_color, type, lycDataFlag){
      let series = [];
      // Y轴 柱状图数据
      for (let i = 0; i < channelName.length; i++) {
        series.push({
          name: channelName[i],
          type: 'bar',
          tooltip: {
              valueFormatter: (value) => value + " " + (lycDataFlag ? 'lcy' : 'usd')
          },
          data: this.getEndResult(this.getChannelData(data, type), channelName[i]),
          color: [rectangle_color[i].value]
        })
      }

      // Y轴 折线图数据
      for (let i = 0; i < channelName.length; i++) {
        series.push({
          name: channelName[i],
          type: 'line',
          yAxisIndex: i + 1,
          tooltip: {
            valueFormatter: value => value + ' %'
          },
          data: this.getZheGraphData(this.getEndResult(this.getChannelData(data, type), channelName[i])),
          color: [line_color[i].value]
        })
      }
      // console.log(series, '2所有渠道的值收集-------------') ;
      return series;
    },
    getZheGraphData(originalArray) {
      const newArray = originalArray.reduce((result, currentValue, currentIndex, array) => {
        if (currentIndex > 0) {
          result.push(((currentValue - array[currentIndex - 1]) / array[currentIndex - 1] * 100).toFixed(2));
        }
        return result;
      }, []); // 初始化一个空数组作为结果
      return [0, ...newArray];
    },
    getNumberLength(num) {
      if(num < 0){
        return {
          value: num,
          valueLength:num.toString().length - 1,
        }
      }else {
        return {
          value: num,
          valueLength:num.toString().length,
        };
      }
    },
    getMimheight(num){
      if (num.value === 0) {
        return 1;
      }else if(num.value < 0){
        return - (num.valueLength * (Math.pow(10, num.valueLength - 1)) / num.valueLength) ;
      }else {
        return num.valueLength * (Math.pow(10, num.valueLength - 1)) / num.valueLength ;
      }
    },
    getTpvScaleForValue(value) {
      const amount = parseInt(value);
      const min = this.getMimheight(this.getNumberLength(amount));
      const max = Math.floor(amount / min) * min + min;
      if (max) {
        return [max, max/10];
      }
    },
    get_table_behavier_rules(type){
      for (const rule of table_behavier_rules) {
        if (rule.table_role === type) {
          return rule.table_select;
        }
      }
      return null;
    },
    getScaleRules(data,type){ // Y轴左侧 最大值 && 刻度 ???
      const scaleRules = [];
      let max = 0;
      let tvp = [];
      const liName = this.get_table_behavier_rules(type);
      for (let i = 0; i < data.length; i++) {
        if(data[i][liName] && data[i].accountOrChannelName && data[i].accountOrChannelName != '汇总'){
          scaleRules.push(data[i][liName].includes(',') ? parseInt(data[i][liName].replace(/,/g, '')) : parseInt(data[i][liName]));
        }
      }
      max = Math.max(...scaleRules);
      tvp = this.getTpvScaleForValue(max);
      // console.log(max ,'最大值', tvp, '刻度')
      return tvp;
    },
    getScaleRightRules(data,type){
      // let scaleRules = [];
      // let percentScaleRules = [];
      // const liName = this.get_table_behavier_rules(type);
      // for (let i = 0; i < data.length; i++) {
      //   if(data[i][liName] && data[i].accountOrChannelName && data[i].accountOrChannelName != '汇总'){
      //     scaleRules.push(data[i][liName].includes(',') ? parseInt(data[i][liName].replace(/,/g, '')) : parseInt(data[i][liName]));
      //   }
      // }
      // console.log(type, 'type',scaleRules, 'scaleRules','zhel');
      // percentScaleRules = this.getZheGraphData(scaleRules);
      // // 将字符串转换为数字并找到最大值
      // const maxValue = percentScaleRules.reduce((max, value) => {
      //   const numValue = Number(value);
      //   return Math.max(max, numValue);
      // }, -Infinity);

      // // 将字符串转换为数字并找到最小值
      // const minValue = percentScaleRules.reduce((min, value) => {
      //   const numValue = Number(value);
      //   return Math.min(min, numValue);
      // }, Infinity);
      // return {
      //   max: parseInt(maxValue + 10),
      //   min: parseInt(minValue - 10),
      //   level: parseInt((maxValue  - minValue + 20)/10),
      // }
      // console.log(percentScaleRules, maxValue, minValue, 'scaleRulesscaleRulesscaleRulesscaleRulesscaleRules');
    },
    getChannelName(data){
      const channelName = [];
      for (let i = 0; i < data.length; i++) {
        (data[i].accountOrChannelName && data[i].accountOrChannelName != '汇总') && channelName.push(data[i].accountOrChannelName);
      }
      return  [...new Set(channelName)];
    },
    getXTime(data){
      const xTime = [];
      for (let i = 0; i < data.length; i++) {
        data[i].timeDimension && xTime.push(data[i].timeDimension);
      }
      return xTime;
    },
    // 获取每个渠道对应的值
    getChannelData(data, type){
      const liName = this.get_table_behavier_rules(type);
      const groupedByAccountOrChannel = data.reduce((acc, curr) => {
        const key = curr.accountOrChannelName;
        if (!acc[key]) {
          acc[key] = [];
        }
        if(key != '汇总' && key!= undefined && key!= null){
          acc[key].push(curr[liName]);
        }
        return acc;
      }, {});

      const formattedResult = Object.entries(groupedByAccountOrChannel).map(([accountOrChannelName, items]) => (
        {
          [accountOrChannelName]: items
        }
        )
      );

      return formattedResult;
    },
    getOptions(type, data){
      if(data == null || data == '' || data == undefined || data == null) return;
      const xTime = this.getXTime(data); // X 轴数据
      const channelName = this.getChannelName(data); // 渠道名称
      const ScaleRules = this.getScaleRules(data, type); // Y轴左侧  最大值 && 刻度
      // const ScalerightRules = this.getScaleRightRules(data, type); // Y轴右侧 最大值 && 刻度
      // console.log(type, '表类型', data,'表格数据', xTime,'X轴数据', channelName, '渠道集合', ScaleRules, 'Y轴左侧 最大值 + 刻度' );
      return {
                  tooltip: line_tooltip,
                  legend: {
                      data: channelName
                  },
                  toolbox: {
                    feature: {
                      // dataView: { show: true, readOnly: false },
                      saveAsImage: { show: true }
                    }
                  },
                  xAxis: [
                      {
                          type: 'category',
                          data: xTime,
                          axisPointer: {
                              type: 'shadow'
                          },
                          axisTick: {
                              show: false
                          },
                      }
                  ],
                  yAxis: this.set_Y_Axis(ScaleRules, channelName, data, type),
                  series: this.set_Series(data, channelName, rectangle_color,line_color, type, this.lycDataFlag),
            };
    },
    changelcyData(){
      this.lycDataFlag = !this.lycDataFlag;
      this.dealAllType(this.detailTableData, this.lycDataFlag );
    },
    tableCellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex !== 0) {
        const linerSet = ['capitalInflow', 'capitalOutflow', 'nettingAmount'];
        const name  = linerSet[columnIndex - 1];
        if(row[name].startsWith('-') || Number(row[name]) == 0 ){
            return { color: 'blue', background:'#ECF3FF' };
        }else{
            return { color: 'red', background:'#FAEBEC' };
        }
      }
    },
    tableDetailCellStyle({ rowIndex, columnIndex }) {
      // if (rowIndex == 0) {
      //   if( parseInt(columnIndex) <= 3) {
      //     return { background: 'blue' }
      //   }
      //   if ( 4 <= parseInt(columnIndex) ){
      //     return { background: 'red'}
      //   }
      //   if(columnIndex == 0){
      //     return { background: '#fff'}
      //   }
      // }
    },
    justFu(numberStr) {
      const pattern =  /^-\d+(,\d{3})*(\.\d+)?$/;
      if (pattern.test(numberStr)) {
        return true;
      }
      return false;
    },
    setTableAllSet() {
      const pageContainer = document.querySelector('.page-container');
      const tableAllSet = document.querySelector('.pay-table-all-set');
      const payFooter = document.querySelector('.pay-footer');
      const width = pageContainer.offsetWidth;

      if (tableAllSet) {
        tableAllSet.style.width = width + 'px';
      }

      if(payFooter){
        payFooter.style.width = (width - 280 * 2) + 'px';
      }

      setTimeout(()=>{
        const flag = this.justTableChildren();
        if(tableAllSet){
          if(!flag){
            tableAllSet.style.zIndex = '0';
          }else{
            tableAllSet.style.zIndex = '8';
          }
        }
      },100);
    },
    justTableChildren(){
      const element = document.querySelector('.pay-table-all-set');
      if (element && element.childElementCount > 0) {
          return true;
      } else {
          return false;
      }
    },
    showtable(val) {
      if (val == 'in') {
        this.dialogIn = true;
      }
      if (val == 'out') {
        this.dialogOut = true;
      }
      if (val == 'bottom') {
        this.dialogBottom = true;
      }
    },
    payInTableRowClassName({ row, rowIndex }) {
      if (row.isSum === true) {
        return 'payinout-row';
      }
      return '';
    },
    initDetail() {
      const params = {
        fundFlowViewList: get_default_table,
        id: this.id,
        params: {
          timeFrame: this.zhouFlag? 'week':'month',
          startDate: this.topStartTime,
          endDate: this.topEndTime,
          // version: this.tableVersion,
        }
      };
      if(this.flowNo == null || this.flowNo == undefined || this.flowNo == ''){
         return;
      }
      try {
        this.varyDiffenentDynamiticTableData(params);
      } catch (error) {
        this.loading = false;
      }
    },
    varyDiffenentDynamiticTableData(params) {
      this.loading = true;
      try {
        getFlowDynamicTableData(params)
          .then(res => {
            if (res && res.data) {
              const info = res.data || {};
              const { code, data } = info;
              if (code === 'APPLY_SUCCESS') {
                this.detailTableData = data;
                this.dealAllType(this.detailTableData, this.lycDataFlag );
                this.loading = false;
              }
            }
          })
          .catch(err => {
            this.$message.error(err.message);
            this.loading = false;
          });
      } catch (error) {
        this.loading = false;
      }
    },
    dealALlminTable(data,lcyFlag){
      return {
          tableData: this.getSecondInfo(data[lcyFlag ? 'lcyData':'usdData'].detailData) || [],
          headers: data[lcyFlag? 'lcyData':'usdData'].detailHeaders || [],
          summeryTableData: this.getSecondInfo(data[lcyFlag ? 'lcyData':'usdData'].sumData) || [],
          summeryHeaders: data[lcyFlag ? 'lcyData':'usdData'].sumHeaders || [],
        }
    },
    dealAllType(val, lcyFlag) {
      const {
        ACCOUNT_BALANCE_CHANGES = {},
        BUSINESS_TYPE_FLOW_NETTING = {},
        CHANNEL_CLEARING_RECEIVABLES = {},
        CHANNEL_TOP_UP = {},
        FUNDS_REPLACE_SEND = {},
        SETTLEMENT_FUNDS = {},
        VA_RECEIVABLES = {},
      } = val || {};
      // 账户余额变动表
      if(ACCOUNT_BALANCE_CHANGES != {} && ACCOUNT_BALANCE_CHANGES['lcyData']){
         this.ACCOUNT_BALANCE_CHANGES_NEW = this.dealALlminTable(ACCOUNT_BALANCE_CHANGES, lcyFlag);
      }
      // 业务类型流量轧差表
      if(BUSINESS_TYPE_FLOW_NETTING != {} && BUSINESS_TYPE_FLOW_NETTING['lcyData']){
        this.BUSINESS_TYPE_FLOW_NETTING_NEW = this.dealALlminTable(BUSINESS_TYPE_FLOW_NETTING, lcyFlag);
      }
      // 渠道结算收款资金流量表
      if(CHANNEL_CLEARING_RECEIVABLES != {} && CHANNEL_CLEARING_RECEIVABLES['lcyData']){
        this.CHANNEL_CLEARING_RECEIVABLES_NEW = this.dealALlminTable(CHANNEL_CLEARING_RECEIVABLES, lcyFlag);
      }
      // 渠道充值资金流量表
      if(CHANNEL_TOP_UP != {} && CHANNEL_TOP_UP['lcyData']){
        this.CHANNEL_TOP_UP_NEW = this.dealALlminTable(CHANNEL_TOP_UP, lcyFlag);
      }
      // 资金代发资金流量表
      if(FUNDS_REPLACE_SEND != {} && FUNDS_REPLACE_SEND['lcyData']){
        this.FUNDS_REPLACE_SEND_NEW = this.dealALlminTable(FUNDS_REPLACE_SEND, lcyFlag);
      }
      // 结算资金流量表
      if(SETTLEMENT_FUNDS != {} && SETTLEMENT_FUNDS['lcyData']){
        this.SETTLEMENT_FUNDS_NEW = this.dealALlminTable(SETTLEMENT_FUNDS, lcyFlag);
      }
      // VA收款资金流量表
      if(VA_RECEIVABLES != {} && VA_RECEIVABLES['lcyData']){
        this.VA_RECEIVABLES_NEW = this.dealALlminTable(VA_RECEIVABLES, lcyFlag);
      }
    },
    getSecondInfo(item) {
      // item 中包含 data 与 header
      item.forEach((origin) => {
        Object.keys(origin).forEach(mx => {
          let type = origin[mx].type;
          switch (type) {
            case 'string':
              origin[mx].finallName = origin[mx][mx] = origin[mx].value;
              break;
            case 'currency':
              origin[mx].finallName = origin[mx][mx] = this.$util.string.amountFormat((origin[mx].amount && origin[mx].amount.amount)? origin[mx].amount.amount : '').split('.')[0];
              break;
            case 'multiCurrency':
              origin[mx].finallName = origin[mx][mx] = `${this.$util.string.amountFormat((origin[mx].localAmount && origin[mx].localAmount.amount) ?  origin[mx].localAmount.amount : '').split('.')[0]}  ${origin[mx].localAmount.currency}
              ${this.$util.string.amountFormat(origin[mx].usdAmount.amount ? origin[mx].usdAmount.amount : '').split('.')[0]}  ${origin[mx].usdAmount.currency}`;
              break;
            default:
              break;
          }
        });
      });

      item.forEach((fine) => {
        Object.keys(fine).forEach((key) => {
          fine[key] = fine[key].finallName ? fine[key].finallName : '';
        });
      });
      return item;
    },
    initClick() {
      this.$nextTick(() => {
        this.initGraph()

        this.graph.on('blank:click', () => {
          this.isNode = false;
          this.isEdge = false;
        });

        this.graph.on('cell:click', ({ cell }) => {
          this.isNode = cell.isNode();
          this.isEdge = cell.isEdge();
          // console.log(cell);
          this.curCel = this.graph.getCellById(cell.id);
          if (this.isNode) {
            if (cell.store.data.attrs.text.text) {
              this.formData.labelText = cell.store.data.attrs.text.text
            } else {
              this.formData.labelText = ''
            }
            if (cell.store.data.attrs.text.ruleSetId) {
              this.formData.ruleSetId = cell.store.data.attrs.text.ruleSetId
            } else {
              this.formData.ruleSetId = '';
            }
            if (cell.store.data.attrs.text.ruleId) {
              this.formData.ruleId = cell.store.data.attrs.text.ruleId
            } else {
              this.formData.ruleId = '';
            }
            this.formData.type = cell.store.data.attrs.text.type;
          }
          if (this.isEdge) {
            let node = cell.getSourceCell();
            if (node) {
              if (node.attrs.text.type !== 'decision') {
                this.isEdge = false;
                return
              }
              this.formData.condExp = ''
              const labels = cell.store.data.labels
              if (Array.isArray(labels) && labels.length) {
                this.formData.condExp = ((labels[0].attrs || {}).text || {}).text || ''
              }
            }
          }
        });
      });
    },
    initGraph() {
      //渲染画布
      this.graph = new Graph({
        container: this.$refs.containerDetailRef,
        width: this.width, //this.width * 0.5,
        height: this.height,
        keyboard: true,
        grid: {
          size: 10,      // 网格大小 10px
          visible: false, // 渲染网格背景
        },
        interacting: {
          nodeMovable: false,
          edgeMovable: false,
        },
        connecting: {
          allowBlank: false,
          allowLoop: false,
          allowNode: false,
          allowEdge: false,
          highlight: false,
        },
        scroller: {
          autoSize: true,
          enabled: true,
          pannable: true,
          pageVisible: true,
          pageBreak: false,
        },
        mousewheel: {
          enabled: true,
          modifiers: ['ctrl', 'meta'],
          minScale: 0.5,
          maxScale: 2,
        },
      });
      this.graph.options.scaling.min = 0.1;
      this.graph.options.scaling.max = 10;
      this.graph.enablePanning();

      this.graph.on('node:contextmenu', ({ node, e }) => {
        e.preventDefault();
        e.stopPropagation();
      });

      this.graph.on('edge:contextmenu', ({ edge, e }) => {
        e.preventDefault();
        e.stopPropagation();
      });

      this.graph.on('node:mousedown', ({ node, e }) => {
        e.preventDefault();
        e.stopPropagation();
      });

      this.graph.on('edge:mousedown', ({ edge, e }) => {
        e.preventDefault();
        e.stopPropagation();
      });

      this.$nextTick(() => {
          setTimeout(()=>{
          deleteNode('delete-node');
          deleteNode('x6-port');
        }, 800)
      });
    },
    initFlow() {
      if (!this.$route.query.flowNo) {
        // this.$message.error("国家资金流号不能为空!");
        return;
      }
      this.getFlowContentPort(this.$route.query.flowNo);
    },
    getFlowContentPort(flowNo = ''){
      getFlowContent({ 'flowNo': flowNo }).then(res => {
        const resp = res.data || {};
        if (resp.code === 'APPLY_SUCCESS' && resp.data) {
          if( Array.isArray(resp.data) && resp.data.length){
            console.log(resp.data, 'resp.dataresp.dataresp.data');
            this.graphVersionList = resp.data;
            const flowHtml = resp.data[0].flowHtml;
            if (flowHtml && this.graph) {
              this.graph.fromJSON(JSON.parse(flowHtml));
              this.graph.centerContent();
            }
            this.topSelectionData =  {
              flowName: resp.data[0].flowName || '视图',
              country: resp.data[0].country || '国家',
            };
          }

        } else {
          this.$message.error(resp.msg);
        }
      }).catch(err => {
        // console.log('查询 国家资金流图信息 出错', err);
        this.$message.error(err.message);
        return;
      })
    },
    changeGraphVersion(id) {
      this.graphVersionList.filter((item)=>{
        if (id === item.id) {
          const flowHtml = item.flowHtml;
          if (flowHtml && this.graph) {
            this.graph.fromJSON(JSON.parse(flowHtml));
            this.graph.centerContent();
          }
          this.topSelectionData =  {
            flowName: item.flowName || '视图',
            country: item.country || '国家',
          };
        }
      })
    },
    //回到列表页
    backToList() {
      // const currentPath = this.$route.path;
      // this.$router.replace({ name: "decisionFlow" }, () => {
      //   this.$closeTagView(currentPath);
      // });
    },
    edit() {
      const currentPath = this.$route.path;
      this.$router.push({ name: "countryFundsCreate", query: { flowNo: this.flowNo } }, () => {
        this.$closeTagView(currentPath);
      });
    },
    checkVe(val) {
      // console.log(val,'chanTab');
      switch (val) {
        case 'al':
          this.allVib = !this.allVib;
          if (this.allVib) {
            this.leftVib = true;
            this.rightVib = true;
            this.bottomVib = true;
            this.allVib = true;
          } else {
            this.leftVib = false;
            this.rightVib = false;
            this.bottomVib = false;
            this.allVib = false;
          }
          this.setTableAllSet();
          break;
        case 'le':
          this.leftVib = !this.leftVib;
          if (this.leftVib) {
            this.allVib = true;
          }

          break;
        case 'ri':
          this.rightVib = !this.rightVib;
          if (this.rightVib) {
            this.allVib = true;
          }
          break;
        case 'bo':
          this.bottomVib = !this.bottomVib;
          if (this.bottomVib) {
            this.allVib = true;
          }
          break;
        case 'info':
          this.infoVib = true;
          break;
        default:
          break;
      }
    },

    detailedDataExportToExcel(flowName) {
      const fileName = flowName || '资金流图';

      const tableMap = new Map([
        ['渠道结算收款资金流量表', this.CHANNEL_CLEARING_RECEIVABLES_NEW],
        ['渠道充值资金流量表', this.CHANNEL_TOP_UP_NEW],
        ['VA收款资金流量表', this.VA_RECEIVABLES_NEW],
        ['账户的余额变动数据表', this.ACCOUNT_BALANCE_CHANGES_NEW],
        ['业务流量轧差表', this.BUSINESS_TYPE_FLOW_NETTING_NEW],
        ['资金代发资金流量表', this.FUNDS_REPLACE_SEND_NEW],
        ['结算资金流量表', this.SETTLEMENT_FUNDS_NEW],
      ]);

      const sheets = [...Array.from(tableMap.entries())]
        .map(([tableName, tableData]) => this.convertToExcelData(tableName, tableData))
        .filter(Boolean);

      if (sheets.length === 0) {
        this.$message.warning("没有可导出的数据");
        return;
      }

      export_json_to_excel_many_sheets({
        sheets: sheets,
        filename: `${fileName}_${this.zhouFlag ? 'week' : 'month'}_${this.lycDataFlag ? 'LCY' : 'USD'}`
      });
    },

    convertToExcelData(sheetName, tableData) {
      if (!tableData || tableData === {} || tableData.tableData.length === 0) {
        return null;
      }

      const labels = tableData.headers.map(header => header.label);
      const dataArr = tableData.tableData.map(item =>
        tableData.headers.map(header => item[header.key] || '')
      );

      return {
        header: labels,
        data: dataArr,
        sheetName: sheetName
      };
    },

  }
}
</script>
<style lang="scss" scoped>
.flex-row {
  display: flex;
  align-items: stretch;
  width: 100%;
}
.new-blanck{
  width:50px;
  height: 100%;
}
 /deep/ .gacha-form-table .el-table__header th:nth-child(2) .cell {
   background: #F44444 !important;
   color: #fff;
 }

 /deep/ .gacha-form-table .el-table__header th:nth-child(3) .cell {
  background:  #3782FF !important;
  color: #fff;
 }

 /deep/ .gacha-detail-form-table .el-table__header th:nth-child(2) .cell {
   background: #F44444 !important;
   color: #fff;
 }

 /deep/ .gacha-detail-form-table .el-table__header th:nth-child(3) .cell {
  background: #F44444 !important;
  color: #fff;
 }

 /deep/ .gacha-detail-form-table .el-table__header th:nth-child(4) .cell {
  background: #F44444 !important;
  color: #fff;
 }

 /deep/ .gacha-detail-form-table .el-table__header th:nth-child(5) .cell {
  background: #F44444 !important;
  color: #fff;
 }

 /deep/ .gacha-detail-form-table .el-table__header th:nth-child(n+6) .cell {
   background:  #3782FF !important;
   color: #fff;
 }

.pay-table-all-set {
  display: flex;
  // width:100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 8;

  .pay-footer {
    flex: 1;
    /* 中间部分自适应剩余空间 */
    display: flex;
    align-items: end;
    justify-content: center;

    .pay-footer-conx {
      overflow: scroll;
      width: 100%;
    }

    .pay-footer-conx-lit {
      overflow: scroll;
      width: 100%;
      // border-top: 1px solid #EAEAEA;
    }
  }

  .show-quanping {
    position: absolute;
    right: 0;
    z-index: 3;
    top: 3px;
  }

  .show-quanping-bottom {
    position: absolute;
    right: 0;
    z-index: 3;
    margin-right: 290px;
    margin-bottom: 221px;
  }
}

.table-dialog {
  position: absolute;
  left: 0;
  top: 0;
}

.desisionFlowGraph {
  position: relative;
}


.page-container {
  position: relative;
  padding: 0 10px;
  box-sizing: border-box;

  /* 仅对表头加粗 */
   /deep/ .el-table .el-table__header th .cell {
    font-weight: bold !important;
  }

  .page-header {
    display: flex;
    justify-content: center;
    position: absolute;
    left: 50%;
    margin-left: -430px;
    z-index: 9;
    transform: scale(0.8);
  }
  .page-footer{
    display: flex;
    justify-content: center;
    position: absolute;
    cursor: pointer;
    z-index: 9;
    right:0;
    bottom: 0;
    margin-right: 30px;
    margin-bottom: 60px;
  }

  .title {
    flex: none;
  }

  .pay-title {
    color: #1B1D1F;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Poppins;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    /* 150% */
    margin-top: 8px;
    margin-bottom: 8px;
    padding-left: 16px;
  }

  .pay-content {
    color: #9DA2A7;
    font-feature-settings: 'clig' off, 'liga' off;
    /* Caption 1/Regular-400 */
    font-family: Poppins;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    padding: 4px 0 12px 16px;
  }

  .payout-vo {
    flex: 0 0 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    z-index: 2;
    border-left: 1px solid var(--Neutral-Light-100, #EAEAEA);
    background: #F8F8F8;
    position: relative;

    .tip-container {
      width: 100%;
    }

    .payout-vo-conx {
      overflow-y: scroll;
    }
  }

  .payout-vo-none {
    flex: 0 0 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    z-index: 2;
  }

  .payin-vo {
    flex: 0 0 280px;
    flex-direction: column;
    display: flex;
    align-items: center;
    z-index: 2;
    border-right: 1px solid var(--Neutral-Light-100, #EAEAEA);
    background: #F8F8F8;
    position: relative;

    .payin-vo-conx {
      overflow-y: scroll;
    }
  }

  .payin-vo-none {
    flex: 0 0 280px;
    flex-direction: column;
    display: flex;
    align-items: center;
    z-index: 2;
  }

  .pay-bootom {
    flex: 1;
    /* 中间部分自适应剩余空间 */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mgtop {
    margin-bottom: 6px;
  }
}

.el-table {
  .payinout-row {
    /* background-color: #eff22e; */
    background: var(--Others-White, #FFF);
  }
}

.desisionFlowGraph {
  .wrap {
    width: 100%;
    height: 100%;

    .content {
      display: flex;
      height: calc(100% - 48px);
      z-index: 8;

      .sider {
        position: relative;
        width: 180px;
        // height: 100%;
        // height: 650px;
        border-right: 1px solid rgba(0, 0, 0, 0.08);
      }

      .container {
        width: 70%;
        box-shadow: none;
      }

      .panel {
        height: 100%;

        .toolbar {
          display: flex;
          align-items: center;
          height: 38px;
          background-color: #f7f9fb;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }
      }

      .config {
        box-sizing: border-box;
        width: 290px;
        height: 100%;
        padding: 0 10px;
        border-left: 1px solid rgba(0, 0, 0, 0.08);
      }
    }
  }
}

/deep/ .x6-graph-scroller {
  width: 100vw;
}
</style>
