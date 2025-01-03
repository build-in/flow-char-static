<template>
  <div class="page-container desisionFlowGraph" v-loading.fullscreen.lock="loading">
    <div v-show="miniMapFlage" id="minimapContainer"></div>
    <!-- 顶部筛选 -->
    <div class="page-header">
      <div class="title">
        <div>
          <span class="red-start">*</span><span>资金图维度:</span>
        </div>
        <div>
        <el-select v-model="graphArea" @change="areaSelect" filterable clearable placeholder="请选择状态" style="width: 120px;margin-left: 3px;">
                <el-option
                  v-for="(item, index) in dimensionEnum"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
        </el-select>
        </div>
        <div style="margin-left:10px;" v-if="graphArea == 'COUNTRY'">
          <span class="red-start">*</span><span>国家:</span>
        </div>
        <div class="little"  v-if="graphArea == 'COUNTRY'">
          <CountrySelect style="width: 120px" v-bind:parentSelected="graphCountry" @change="fundsCountrySelect" :parentDisabled="false" ref="fundsCountrySelect">
          </CountrySelect>
        </div>
        <div style="margin-left:10px;">
          <span class="red-start">*</span><span>视图名称: </span>
        </div>
        <div class="little">
          <el-input  v-model="graphName" placeholder="请输入视图名称"></el-input>
        </div>
      </div>

      <div class="right-actions">
        <el-button plain @click="backToList">{{ $t('common.actions.backToList') }}</el-button>
        <el-button plain @click="setMiniMap">{{ miniMapFlage ? '关闭小地图': '开启小地图'  }}</el-button>
        <!-- <el-button plain @click="setMoveMap">{{ moveFlage ? '禁止画布平移': '开启画布平移'  }}</el-button> -->
        <el-button plain @click="() => { onCenter() }">居中</el-button>
        <el-button plain @click="() => { onUndo() }">{{ $$t('liquidity.action.revoke') }}</el-button>
        <el-button plain @click="() => { onRedo() }">{{ $$t('liquidity.action.recover') }}</el-button>
        <el-button plain @click="() => { onClear() }">{{ $$t('liquidity.action.clear') }}</el-button>
        <!-- <el-button plain v-has="'OMC_RISK_MANAGE_saveRuleFlow'" :loading="saveFlowLoading" @click="saveFlow">{{
          $t('common.save') }}</el-button> -->
        <el-button plain type="primary" :loading="saveFlowLoading" @click="submitThrottle">{{
          $t('common.save') }}</el-button>
        <!-- <el-button plain @click="() => { onToSVG() }">导出SVG</el-button>
        <el-button plain @click="() => { onToPNG() }">导出PNG</el-button> -->
        <!-- <el-button plain @click="() => { printAllNodes() }">打印所有节点</el-button> -->
      </div>
    </div>
    <div class="wrap" id="graph-view-all">
      <div class="content">
        <el-row :gutter="24" style="width: 100%">
          <!-- 拖拽区 -->
          <el-col :span="5">
            <div ref="stencilRef" class="sider" id="stencilRef" />
          </el-col>
          <!-- 画布 -->
          <el-col :span="14">
            <div ref="containerRef" class="container" id="containerRef" />
          </el-col>
          <!-- 右侧操作区 -->
          <el-col :span="5" v-if="isNode || isEdge" class="deal-edge-pannel">
            <!-- 选择银行账户 -->
            <el-form label-width="100px" :model="bankAccountData" :rules="bankRules" ref="bankRules" label-position="top">
              <div v-if="isNode && nodeType == 'bankAccount'" class="bank-cho">
                <el-form-item class="formItem" :label="$$t('liquidity.label.accountAlias')" prop="accountId">
                  <!-- <SingleAccountAliasSelect @change="nodeAccountAliasSelect"
                    :parentSelected="bankAccountData.accountId" ref="accountAliasSelect" style="width: 260px">
                  </SingleAccountAliasSelect> -->
                  <el-select 
                    style="width: 260px"
                    ref="accountAliasSelect" 
                    v-model="bankAccountData.accountId" 
                    filterable 
                    clearable 
                    placeholder="请选择账户" 
                    @change="nodeAccountAliasSelect">
                    <el-option
                      v-for="item in accountCandidateList"
                      :key="item.accountAlias"
                      :label="item.accountName"
                      :value="item.accountAlias">
                    </el-option>
                  </el-select>
                </el-form-item>
                <br /><br />

                <el-form-item class="formItem" :label="$$t('liquidity.label.channelSubject')"
                  prop="account.institutionAlias">
                  <el-input v-model="bankAccountData.institutionAlias" style="width: 260px" disabled></el-input>
                </el-form-item>
                <br /><br />

                <el-form-item class="formItem" :label="$$t('liquidity.label.chanenAndbank')" prop="accountNo">
                  <el-input v-model="bankAccountData.accountNo" style="width: 260px" disabled></el-input>
                </el-form-item>
                <br /><br />

                <el-form-item class="formItem" :label="$$t('liquidity.label.currency')" prop="currency">
                  <el-input v-model="bankAccountData.currency" style="width: 260px" disabled></el-input>
                </el-form-item>
                <br /><br />

                <el-form-item class="formItem" :label="$$t('liquidity.label.accountType')" prop="accountType">
                  <el-input v-model="bankAccountData.accountType" style="width: 260px" disabled></el-input>
                </el-form-item>
                <br /><br />
                <el-form-item :label="$$t('liquidity.label.whetherdisplaybalancechart')" prop="flowFundsChart">
                  <el-select v-model="bankAccountData.flowFundsChart" @change="flowFundsBankAccountData" clearable style="width: 260px">
                    <el-option label="是" value="true"></el-option>
                    <el-option label="否" value="false"></el-option>
                  </el-select>
                </el-form-item>
                <br />
                <!-- <el-form-item :label="$$t('liquidity.label.whetherdisplayflowstype')"  prop="fundTrendChart">
                  <el-select v-model="bankAccountData.fundTrendChart" @change="fundTrendBankAccountData" style="width: 260px">
                    <el-option label="是" value="true"></el-option>
                    <el-option label="否" value="false"></el-option>
                  </el-select>
                </el-form-item> -->
              </div>
            </el-form>
            <!-- 选择兑换卡片 -->
            <el-form label-width="100px" label-position="top" :model="exchangeCardData" :rules="exchangeCardRules" ref="exchangeCardRules">
              <div v-if="isNode && nodeType == 'exchangeCard'" class="bank-cho">
                <el-form-item class="formItem" label="机构名称" prop="institutionName">
                  <el-select v-model="exchangeCardData.institutionName" filterable clearable placeholder="请选择"  style="width: 260px"
                          @change="selectInstitution">
                 <el-option v-for="item in institutionList" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
                </el-form-item>
                <br /><br />
              </div>
            </el-form>
            <!-- 选择流入流出 -->
            <el-form label-width="100px" label-position="top" :model="payinPayoutData" :rules="payinPayoutRules" ref="payinPayoutRules">
              <div v-if="isNode && (nodeType == 'payOutFlowNew' || nodeType == 'payInFlowNew')" class="pay-cho">
                <el-form-item v-if="graphArea == 'GLOBAL' || graphArea == 'REGION' " class="formItem" :label="$$t('liquidity.label.countryName')" prop="country">
                  <CountrySelect style="width: 260px;margin-bottom: 15px;" :parentSelected="payinPayoutData.country" @change="payCountrySelect" :parentDisabled="false" ref="payfundsCountrySelect">
                  </CountrySelect>
                </el-form-item>
                <!-- 渠道或银行名称  分开写解决同一个容器内切换卡顿与变形-->
                <el-form-item v-if="graphArea == '' || graphArea == 'COUNTRY'" :label="$$t('liquidity.label.chanenAndbank')" prop="channelName">
                  <el-select v-model="payinPayoutData.channelName" filterable clearable placeholder="请选择" style="width: 260px"
                    @change="institutionSelect">
                    <el-option v-for="item in institutionList" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  v-if="graphArea == 'GLOBAL' || graphArea == 'REGION'" class="formItem"  :label="$$t('liquidity.label.chanenAndbank')" prop="channelName">
                  <el-select multiple v-model="payinPayoutData.channelName" filterable clearable placeholder="请选择" style="width: 260px"
                    @change="institutionSelect">
                    <el-option v-for="item in institutionList" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <br /> <br v-if="graphArea == 'GLOBAL' || graphArea == 'REGION'"  />
                <el-form-item class="formItem" :label="$$t('liquidity.label.subjectContract')" prop="subjectContract">
                  <el-select v-model="payinPayoutData.subjectContract" filterable clearable placeholder="请选择" style="width: 260px"
                            @change="channelSubjectSelect">
                    <el-option
                      v-for="item in channelSubjectList"
                      :key="item.itemKey"
                      :label="item.itemValue"
                      :value="item.itemKey">
                    </el-option>
                  </el-select>
                </el-form-item>
                <br /><br />
                <el-form-item v-if="nodeType == 'payInFlowNew'" :label="$$t('liquidity.label.businessType')" prop="businessType">
                  <el-select v-model="payinPayoutData.businessType" @change="businessTypeSelect" style="width: 260px">
                    <el-option label="渠道结算收款" value="1"></el-option>
                    <el-option label="VA收款" value="2"></el-option>
                    <el-option label="商户充值" value="3"></el-option>
                    <el-option label="入转出" value="4"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-else :label="$$t('liquidity.label.businessType')" prop="businessType">
                  <el-select v-model="payinPayoutData.businessType" @change="businessTypeSelect" style="width: 260px">
                    <el-option label="资金代发" value="1"></el-option>
                    <el-option label="结算提现" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <br />
                <!-- 调拨币种大类匹配 -->
                <el-form-item class="formItem" :label="currentLable" prop="transferCurrency">
                  <el-select v-model="payinPayoutData.transferCurrency" filterable clearable placeholder="请选择" style="width: 260px"
                      @change="currencySelect">
                    <el-option
                      v-for="item in currencyList"
                      :key="item.itemValue"
                      :label="item.itemValue"
                      :value="item.itemValue">
                    </el-option>
                  </el-select>
                </el-form-item>
                <br /><br />
                <el-form-item v-if="payinPayoutData.businessType == '1' && nodeType == 'payInFlowNew' " class="formItem" :label="$$t('liquidity.label.settleCurrency')" prop="settleCurrency">
                  <el-select v-model="payinPayoutData.settleCurrency" filterable clearable placeholder="请选择" style="width: 260px"
                      @change="settleCurrencySelect">
                    <el-option
                      v-for="item in currencyList"
                      :key="item.itemValue"
                      :label="item.itemValue"
                      :value="item.itemValue">
                    </el-option>
                  </el-select>
                </el-form-item>
                <br /><br />
                <!-- <el-form-item :label="$$t('liquidity.label.whetherdisplaybalancechart')" prop="flowFundsChart">
                  <el-select v-model="payinPayoutData.flowFundsChart" @change="flowFundsChartSelect">
                    <el-option label="是" value="true"></el-option>
                    <el-option label="否" value="false"></el-option>
                  </el-select>
                </el-form-item>
                <br /> -->
                <!-- <el-form-item label="是否展示资金流量趋势图"  prop="fundTrendChart">
                  <el-select v-model="payinPayoutData.fundTrendChart" @change="fundTrendChartSelect" style="width: 260px">
                    <el-option label="是" value="true"></el-option>
                    <el-option label="否" value="false"></el-option>
                  </el-select>
                </el-form-item> -->
              </div>
            </el-form>
            <!-- 选择边 -->
            <el-form label-width="100px" label-position="top" :model="lineData" :rules="lineDataRules" ref="lineDataRules">
              <div v-if="isEdge && (nodeType == 'line')">
                <br />
                <el-form-item v-if="graphArea == 'COUNTRY'" label="选择时间" prop="time">
                  <el-select v-model="lineData.time" filterable @change="timeSelect" style="width: 260px">
                    <el-option
                      v-for="item in real_time"
                      :key="item.value"
                      :label="item.lable"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <br />
                <el-form-item label="选择线类型"  prop="type"> 
                  <el-select v-model="lineData.type" @change="lineSelect" style="width: 260px">
                    <el-option
                      v-for="item in line_type"
                      :key="item.value"
                      :label="item.lable"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <br />
                <el-button @click="deleteCurrentEdge()">删除</el-button>
                <!-- <el-form-item class="formItem" :label="$$t('liquidity.label.transferCurrency')" prop="transferCurrency">
                  <el-select v-model="lineData.transferCurrency" filterable clearable placeholder="请选择" 
                      @change="lineDataCurrencySelect">
                    <el-option
                      v-for="item in currencyList"
                      :key="item.itemValue"
                      :label="item.itemValue"
                      :value="item.itemValue">
                    </el-option>
                  </el-select>
                </el-form-item> -->
              </div>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { Graph, Addon, Shape, DataUri } from '@antv/x6';
import { initShape, stencilData } from './shape';
import { initEvent } from './event';
import { throttle } from 'lodash';

import SingleAccountAliasSelect from "@/components/funds/liquidity/SingleAccountAliasSelect";
import CountrySelect from "@/components/funds/select/CountrySelect";
import CurrencySelect from "./common/CurrencySelect.vue";
import ChannelSubjectSelect from "./common/ChannelSubjectSelect.vue";
import InstCenterInstitutionSelect from "./common/InstCenterInstitutionSelect.vue";

import { getCompletedAccountDetail } from "@/api/liquidity/account";
import {channelAccountQuery} from "@/api/common";
import { saveCountryFundsFlow, getFlowContent } from "@/api/liquidity/topology";
import { instCenterInstitutionQuery, listChannelSubject, getDictInfo } from "@/api/common";
import { real_time, line_type }  from './const/index';
import { dimensionEnum } from './dict/dict.js';

//存储表单所有数据到loacalStorage
const KEY_LOC_STORE_NODES = 'bkr';
const InOutRequire = {
      channelName: [
          { required: true, message: '请选择', trigger: 'change' },
      ],
      subjectContract: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
      businessType: [
          { required: true, message: '请选择', trigger: 'change' }
      ],
      transferCurrency: [
          { required: true, message: '请选择', trigger: 'change' }
      ],
    };
const InOutRequireDeal = {
  ...InOutRequire,
  // settleCurrency: [
  //         { required: true, message: '请选择', trigger: 'change' }
  // ],
};

export default {
  name: 'countryFundsCreate',
  components: {
    CountrySelect,
    SingleAccountAliasSelect,
    CurrencySelect,
    ChannelSubjectSelect,
    InstCenterInstitutionSelect
  },
  data() {
    return {
      isNode: false,
      nodeType: '',
      isEdge: false,
      loading: false,// 展示属性
      saveFlowLoading: false,
      graph: {}, //中间画布
      stencil: {},//左边拖拽
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      curCel: {},
      editingNodeData: {},
      institutionList: [],
      institutionName: [],
      channelSubjectList: [],
      currencyList: [],
      flowNo: this.$route.query.flowNo || '',
      graphCountry: '',
      accountCandidateList: [],
      bankAccountData: {  //选择节点/ 银行 / 进出款
        cardType:'bankAccount',
        accountId: '',
        accountName: '',
        accountType: '',
        contractEntity: '',
        institutionAlias: '',
        country: '',
        currency: '',
        accountNo: '',
        flowFundsChart:'',
        fundTrendChart:'',
        settleCurrency:'',
      },
      payinPayoutData: {
        cardType: this.nodeType == 'payOutFlowNew' ? 'payOutFlow' :'payInFlow',
        text: '',
        country: '',
        channelName:'',
        subjectContract:'',
        businessType:'',
        transferCurrency:'',
        flowFundsChart:'',
        fundTrendChart:''
      },
      exchangeCardData:{
        cardType:'exchange',
        institutionName:''
      },
      lineData:{
        cardType:'line',
        time:'',
        type:'',
        transferCurrency:''
      },
      real_time,
      line_type,
      miniMapFlage: false,
      moveFlage: false,
      graphName: '',
      graphArea:'',
      bankRules:{
        accountId: [
          { required: true, message: '请选择', trigger: 'change' },
          ],
        flowFundsChart: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
      },
      exchangeCardRules:{
        institutionName: [
            { required: true, message: '请选择', trigger: 'change' },
          ]
      },
      payinPayoutRules: InOutRequire,
      lineDataRules:{
        // time: [
        //     { required: true, message: '请选择', trigger: 'change' },
        // ],
        type: [
            { required: true, message: '请选择', trigger: 'change' },
        ]
      },
      isEdit: this.$route.query.isEdit == 'Y' ? true : false,
      timeSet:'',
      currentLable: '调拨币种',
      dimensionEnum: dimensionEnum,
    }
  },
  created() {
    // 初始化图形
    initShape();
    // 初始化左侧拖拽、画布
    this.initClick();
    this.initBankAccount();
  },
  mounted() {
    this.init();
  },
  watch: {
        $route(to, from) {
          this.init();
        }
  },
  activated() {
  },
  destory(){
    clearTimeout(this.timeSet);
  },
  methods: {
    init(){
      this.initFlow();
      this.instCenterInstitution();
      this.listChannelSubjectTion();
      this.getDictInfoTion();
      this.deletePortAndClose();
      // this.queryVerifyClass();
    },
    initBankAccount(){
      channelAccountQuery({
      'accountType': '',
      'channelProductType': '',
      'statusList': ['NORMAL']})
      .then(resp => {
        this.accountCandidateList = resp.data.data;
      }).catch(err => {
        console.log('所有账户列表 查询报错了', err);
        this.$message.error(err.message);
      });
    },
    deletePortAndClose(){
      this.$nextTick(() => {
        const stencilRefElement = document.getElementById('stencilRef');
        if(stencilRefElement){
          this.queryNodesDelete(stencilRefElement, 'x6-port');
          this.queryNodesDelete(stencilRefElement, 'delete-node');
        }
       });
    },
    queryNodesDelete(element, name){
        const x6PortNodes = element.querySelectorAll(`.${name}`);
        x6PortNodes.forEach(node => {
          node.remove();
        });
    },
    queryVerifyClass(){
      this.$nextTick(() => {
        const parentElement = document.getElementById('graph-view-all');
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
    submitThrottle: throttle(function() {
      this.saveFlow();
    }, 1000, { leading: false, trailing: true }),
    deleteCurrentEdge(){
      this.graph.removeNode(this.lineData.id);
    },
    flowFundsBankAccountData(val){
      if (this.isNode) {
        this.bankAccountData.flowFundsChart = val;
      }
    },
    fundTrendBankAccountData(val){
      if (this.isNode) {
        this.bankAccountData.fundTrendChart = val;
      }
    },
    instCenterInstitution(){
      instCenterInstitutionQuery()
      .then(resp => {
        this.institutionList = resp.data.data;
      })
      .catch(err => {
        console.log('查询报错了', err);
      })
    },
    listChannelSubjectTion(){
      listChannelSubject()
      .then(resp => {
        this.channelSubjectList = resp.data.data;
      })
      .catch(err => {
        console.log('查询我方主体列表报错', err);
      });
    },
    getDictInfoTion(){
      getDictInfo('currency_mapping')
      .then(resp => {
        this.currencyList = resp.data.data.itemList;
      })
      .catch(err => {
        console.log('查询币种对列表报错了', err);
      });
    },
    // 渠道或银行名称
    institutionSelect(val) {
      console.log(val,'gggggggg');
      if (this.isNode) {
        this.payinPayoutData.channelName = val;
      }
    },
    payCountrySelect(val){
      if (this.isNode) {
        this.payinPayoutData.country = val;
      }
    },
    selectInstitution(val) {
      if (this.isNode) {
        this.exchangeCardData.institutionName = val;
      }
    },
    // 调拨币种
    currencySelect(val) {
      if (this.isNode) {
        this.payinPayoutData.transferCurrency = val;
      }
    },
    settleCurrencySelect(val){
      if(this.payinPayoutData.businessType == '1' && this.nodeType == 'payInFlowNew'){
        this.payinPayoutRules = InOutRequireDeal;
      }else{
        this.payinPayoutRules = InOutRequire;
      }
      this.payinPayoutData.settleCurrency = val;
    },
    // 业务类型
    businessTypeSelect(val){
      if (this.isNode) {
        this.payinPayoutData.businessType = val;
      }
      // 处理调拨币种大类
      if(this.nodeType == 'payInFlowNew'){
        switch (val) {
          case '1':
            this.currentLable = '支付币种';
            break;
          case '2':
            this.currentLable = 'VA收款币种';
            break;
          case '3':
            this.currentLable = '充值币种';
            break;
          default:
            this.currentLable = '调拨币种';
            break;
        }
      }

      if(this.nodeType == 'payOutFlowNew'){
        switch (val) {
          case '1':
            this.currentLable = '资金代发币种';
            break;
          case '2':
            this.currentLable = '结算提现币种';
            break;
          default:
            this.currentLable = '调拨币种';
            break;
        }
      }
    },
    // 签约主体
    channelSubjectSelect(val) {
      if (this.isNode) {
        this.payinPayoutData.subjectContract = val;
      }
    },
    flowFundsChartSelect(val){
      if (this.isNode) {
        this.payinPayoutData.flowFundsChart = val;
      }
    },
    fundTrendChartSelect(val){
      if (this.isNode) {
        this.payinPayoutData.fundTrendChart = val;
      }
    },
    timeSelect(val){
      if (this.isEdge) {
        this.lineData.time = val;
        this.setLineLabel();
      }
    },
    lineSelect(val){
      if (this.isEdge) {
        this.lineData.type = val;
        this.setLineBot(val);
      }
    },
    lineDataCurrencySelect(val){
      if (this.isEdge) {
        this.lineData.transferCurrency = val;
        this.setLineLabel();
      }
    },
    setLineBot(val){
      switch (val) {
        case 'lcy':
          this.lineColorSet('red', 'origin')
          break;
        case 'usd':
          this.lineColorSet('green', 'origin')
          break;
        case 'crossCurrency':
          this.lineColorSet('blue', 'origin')
          break;
        case 'dottedLine':
          this.lineColorSet('#727880', 'dotted')
          break;
        case 'unVerify':
          this.lineColorSet('yellow', 'dotted')
          break;
        default:
          break;
      }
    },
    lineColorSet(color, type){
      // 边的属性配置
      this.curCel.setAttrs({
          lines: {
            connection: true,
            strokeDasharray: '5,5',
            strokeLinejoin: 'round',
            fill: 'none',
            cursor:'pointer'
          },
          line1: {
            stroke: type === 'dotted'? 'transpanet' : color,
            strokeWidth: 2,
            cursor:'pointer'
          },
          line3: {
            strokeWidth: 2,
            strokeDashoffset: 25,
            stroke: color,
            targetMarker: {
              name: 'classic',
              size: 8,
              stroke: color,
              strokeWidth: 1,
              d: 'M 0 -4 0 -10 -12 0 0 10 0 4',
            },
            cursor:'pointer'
          }
      });
    },
    setLineLabel(){
      this.curCel.setLabels([
          {
            attrs: {
              label: {
                text: this.getRealTime(this.lineData.time),
                cursor:'pointer'
              },
              rect: {
                cursor:'pointer'
              },
              // body: {
              //   ref: 'label',
              //   fill: '#ffd591',
              //   stroke: '#ffa940',
              //   strokeWidth: 2,
              //   rx: 4,
              //   ry: 4,
              //   refWidth: '140%',
              //   refHeight: '140%',
              //   refX: '-20%',
              //   refY: '-20%',
              // },
            },
            position:{
              distance: 0.4
            },
          },
          {
            attrs: {
              label: {
                text:  this.lineData.transferCurrency ? this.lineData.transferCurrency : '',
                cursor:'pointer'
              },
              rect: {
                cursor:'pointer'
              },
              // body: {
              //   ref: 'label',
              //   fill: '#ffd591',
              //   stroke: '#ffa940',
              //   strokeWidth: 2,
              //   rx: 4,
              //   ry: 4,
              //   refWidth: '140%',
              //   refHeight: '140%',
              //   refX: '-20%',
              //   refY: '-20%',
              // },
            },
            position:{
              distance: 0.5
            },
          },
        ]);
    },
    getRealTime(val){
      console.log(val,'valvalval');
       return val ? this.real_time[Number(val) - 1].lable : '';
    },
    printAllNodes() {
      if (!this.graph) return
      console.log('All Nodes:', this.graph.getNodes());
      console.log('All line and node:', this.graph);
    },
    // closeProhibit() {
    //   this.graph && this.graph.disablePanning();
    // },
    setMiniMap(){
      this.miniMapFlage = !this.miniMapFlage;
    },
    setMoveMap(){
      console.log(this.moveFlage,'this.moveFlage');
      this.moveFlage = !this.moveFlage;
      if(this.graph){
        if(this.moveFlage){
          this.graph.enablePanning();
        }else{
          this.graph.disablePanning();
        }
      }
    },
    // onProhibit() {
    //   this.graph && this.graph.enablePanning();
    // },
    // 撤销
    onUndo() {
      this.graph.history.undo()
    },
    // 恢复
    onRedo() {
      this.graph.history.redo()
    },
    onClear() {
      if (!this.graph) return;
      this.graph.clearCells();
    },
    onCenter(){
      if (!this.graph) return;
      this.graph.centerContent()
    },
    onToSVG() {
      this.graph && this.graph.toSVG((dataUri) => {
        DataUri.downloadDataUri(DataUri.svgToDataUrl(dataUri), 'chart.svg')
      }, 'chart.svg');
    },
    onToPNG() {
      this.graph.toPNG((dataUri) => {
        // 下载
        DataUri.downloadDataUri(dataUri, 'chart.png');
      })
    },
    editEdge() {
      // alert('bian');
    },
    areaSelect(val){
      console.log(val, 'valvalval');
      this.graphArea = val;
    },
    // 国家选择变化
    fundsCountrySelect(country) {
      if (country) {
        console.log(country,'countrycountrycountry');
        this.graphCountry = country;
      }
    },
    nodeAccountAliasSelect(accountAlias) {
      this.getAccountInfo(accountAlias, (channelAccount) => {
        if (channelAccount) {
          this.bankAccountData.accountId = channelAccount.accountAlias;
          this.bankAccountData.accountName = channelAccount.accountName;

          this.bankAccountData.accountType = channelAccount.accountType;
          this.bankAccountData.contractEntity = channelAccount.contractEntity;
          this.bankAccountData.institutionAlias = channelAccount.institutionAlias;
          this.bankAccountData.country = channelAccount.country;
          this.bankAccountData.currency = channelAccount.currency;
          this.bankAccountData.accountNo = channelAccount.accountNo;
        }
      });
    },
    checkBankRule(){
      this.$refs['bankRules'].validate((valid) => {
            if (valid) {
              this.isNode = false;
              this.isEdge = false;
            } else {
              return false;
            }
          });
    },
    vervifyLineAndCard(){
      this.isNode = false;
      this.isEdge = false;
      // 处理连接线
      const json = this.addStatus(this.graph.toJSON());
      this.changeGraphCountry(json);
    },
    initClick() {
      this.$nextTick(() => {
        this.initGraph();
        // 画布单击
        this.graph.on('blank:click', () => {
          this.vervifyLineAndCard();
        });
        // 画布双击
        this.graph.on('blank:dblclick', () => {
          this.vervifyLineAndCard();
        });
        // 节点单击 （ 包括节点 + 边 ）
        this.graph.on('cell:click', ({ cell }) => {
          this.isNode = cell.isNode();
          this.isEdge = cell.isEdge();
          this.curCel = this.graph.getCellById(cell.id);
           // 节点点击
          if (this.isNode) {
            // console.log(cell, 'cell', this.curCel, 'this.curCel');
            this.nodeType = cell.store.data.attrs.label.type;
            if (this.nodeType === 'bankAccount') {
              if (cell.store.data.data) {
                this.bankAccountData = cell.store.data.data;
                console.log(this.bankAccountData, '银行账户信息');
              }
            } else if (this.nodeType === 'payOutFlowNew' || this.nodeType === 'payInFlowNew') {
              this.payinPayoutData = cell.store.data.data;
              console.log(this.payinPayoutData, '资金流入流出数据');
            }else if(this.nodeType === 'exchangeCard'){
              this.exchangeCardData = cell.store.data.data;
              console.log(this.exchangeCardData, '交换卡');
            }
          }
          // 边点击
          if (this.isEdge) {
            let source = cell.getSourceCell();
            let target = cell.getTargetCell();
            console.log(cell.store.data.data.cardType, 'cell.store.data.data.cardType');
            this.nodeType = cell.store.data.data.cardType || 'line';
            this.lineData = cell.store.data.data;
            this.lineData.id = cell.id || '';
            this.lineData.cardType = 'line';
            console.log('当前节点', this.curCel, cell, source, target);
            // if (source && node) {
            //   if (node.attrs.text.type !== 'decision') {
            //     this.isEdge = false;
            //     return
            //   }
            // }
          }
        });
      });
    },

    initGraph() {
      //渲染画布
      this.graph = new Graph({
        container: this.$refs.containerRef,
        width: this.width * 0.65,
        height: this.height,
        // 配置交互行为，禁止在拖拽时选中元素
        interacting: {
          // 开启橡皮筋选择，但禁用其选中功能
          rubberband: { enabled: true, movable: false },
          // 开启节点和边的移动，但禁用选中功能
          nodeMovable: { enabled: true, selected: false },
          edgeMovable: { enabled: true, selected: false },
          // 开启画布平移，但禁用选中功能
          magnet: { enabled: true, selected: false }
        },
        resizing: true,
        background: {
          color: '#fff1cf', // 设置画布背景颜色
        },
        grid: {
          size: 10,      // 网格大小 10px
          visible: true, // 渲染网格背景
        },
        scroller: {
         enabled: true,
         autoSize: true,
         pageBreak: true,
          // pannable: true,
         zoomingSteps: 0.1 // 每次缩放的步长，可以根据需要调整这个值，值越小缩放速度相对越慢，值越大缩放速度相对越快
        },
        minimap: {
          enabled: true,
          container: minimapContainer,
        },
        selecting: {
          enabled: true,
          multiple: true,
          showNodeSelectionBox: true,
          showEdgeSelectionBox: true,
          rubberband: true,
          movable: true,
        },
        mousewheel: {
          enabled: true,
          modifiers: ['ctrl', 'meta'],
          minScale: 0.5,
          maxScale: 2,
        },
        // 配置全局的连线规则
        connecting: {
          snap: true, // 距离节点或者连接桩时会触发自动吸附
          allowMulti:true, // 允许在相同的起始节点和终止之间创建多条边
          anchor: 'center',
          connectionPoint: 'anchor',
          allowBlank: false, // 允许连接到画布空白位置的点
          highlight: true,
          createEdge() { // 连接的过程中创建新的边(保证连接过程中有弯曲路径)
            return new Shape.Edge({
              // shape: 'custom-edge',
              markup: [
                {
                  tagName: 'path',
                  selector: 'wrap',
                  groupSelector: 'lines',
                },
                {
                  tagName: 'path',
                  selector: 'line1',
                  groupSelector: 'lines',
                },
                {
                  tagName: 'path',
                  selector: 'line3',
                  groupSelector: 'lines',
                },
              ],
              attrs: {
                line: {
                  stroke: '#3c4260',
                  strokeWidth: 2,
                  targetMarker: 'classic',
                },
                lines: {
                  connection: true,
                  strokeDasharray: '5,5',
                  strokeLinejoin: 'round',
                  fill: 'none',
                  cursor:'pointer',
                },
                line1: {
                  stroke: '#727880',
                  strokeWidth: 2,
                  cursor:'pointer'
                },
                line3: {
                  strokeWidth: 2,
                  strokeDashoffset: 25,
                  stroke: '#727880',
                  targetMarker: {
                    name: 'classic',
                    size: 8,
                    stroke: '#727880',
                    strokeWidth: 1,
                    d: 'M 0 -4 0 -10 -12 0 0 10 0 4',
                  },
                  cursor:'pointer'
                },
              },
              // router: {
              //   name: 'manhattan',
              //   args: {
              //     offset: 10,
              //   },
              // },
              tools: {
                name: 'segments',
                args: {
                  snapRadius: 10,
                  attrs: {
                    fill: '#444',
                  },
                },
              },
              // 设置vertexMarkup来显示顶点标记
              vertexMarkup: [
                  'circle',
                  {
                      r: 5,
                      fill: 'blue',
                      stroke: 'white',
                      cursor: 'pointer'
                  }
              ],
              router: {
                name: 'manhattan',
                args: {
                  padding: 20,
                  offset: 20,
                  },
              },
              connecting: {
                allowBlank: true,
              },
              data: {
                cardType:'line',
                // time: '',
                type: '',
                transferCurrency:''
              },    // 增加路径点 边就可以移动
              // vertices: [
              //   { x: 200, y: 200 },
              //   { x: 380, y: 120 },
              // ], // 默认模式的边删除
              // tools: {
              //   name: 'button-remove',
              //   args: { distance: -40 },
              // },
              className: 'hover-edge'
            })
          },
          validateConnection({
            sourceView,
            targetView,
            sourceMagnet,
            targetMagnet,
          }) {
            if (sourceView === targetView) {
              return false
            }
            if (!sourceMagnet) {
              return false
            }
            if (!targetMagnet) {
              return false
            }
            return true
          },
        },
        // interacting: function() {
        //   return {
        //     nodeMovable: true,
        //     edgeMovable: true,
        //     edgeLabelMovable:true,
        //     magnetConnectable: true
        //   }
        // },
        highlighting: {
          magnetAvailable: {
            name: 'stroke',
            args: {
              padding: 4,
              attrs: {
                strokeWidth: 4,
                stroke: 'rgba(223,234,255)',
              },
            },
          },
        },
        snapline: true,
        history: {
          enabled: true,
          beforeAddCommand(event, args) {
            // console.log(args.options, 'args.options');
            if (args.options.key === 'ports') {
              return args.options.ignore !== false;
            }
            return args.options.ignore !== true;
          },
          afterAddCommand(event, args) {
            // console.log(args.options, 'args.options');
            if (args.options.key === 'ports') {
              return args.options.ignore !== false;
            }
            return args.options.ignore !== true;
          }
        },
        clipboard: {
          enabled: true,
        },
        keyboard: {
          enabled: true,
        },
      });
      // 渲染左侧工具栏
      this.initStencil();
      // 注册的事件
      initEvent(this.graph, document.getElementById('containerRef'));
    },
    initStencil() {
      //增加左侧模板
      this.stencil = new Addon.Stencil({
        title: '',
        target: this.graph,
        stencilGraphWidth: this.width / 4.5,
        stencilGraphHeight: this.height,
        // search:{
        //   rect: true,
        // },
        // collapsable: true,
        groups: [
          {
            name: 'basic',
            title: '基础节点',
            graphWidth: this.width / 6,
            graphHeight: 360,
            layoutOptions: {
              columns: 1,
              dx: 40,
            },
          },
          // {
          //   name: 'combination',
          //   title: '组合节点',
          //   collapsed: true,
          //   graphWidth: this.width / 6,
          //   graphHeight: 280,
          //   layoutOptions: {
          //     columns: 1,
          //     marginX: 60,
          //   },
          // },
          // {
          //   name: 'other',
          //   title: '特殊节点',
          //   collapsed: true,
          //   graphWidth: this.width / 6,
          //   graphHeight: 280,
          //   layoutOptions: {
          //     columns: 1,
          //     marginX: 60,
          //   },
          // }
        ],
      });
      this.$refs.stencilRef.appendChild(this.stencil.container);
      //左侧拖拽节点数据加载
      this.stencil.load(stencilData(this.graph), 'basic');
    },
    initFlow() {
      if (this.$route.query.flowNo){
        this.loading = true;
        // 如果是修改，则需要获取已保存内容
        getFlowContent({ 'flowNo': this.$route.query.flowNo }).then(res => {
          const resp = res.data || {};
          if (resp.code === 'APPLY_SUCCESS' && resp.data) {
            const flowHtml = resp.data[0].flowHtml;
            if (flowHtml && this.graph) {
              this.graph.fromJSON(JSON.parse(flowHtml));
              this.graph.centerContent();
            }
            this.graphCountry = resp.data[0].country;
            this.graphName = resp.data[0].flowName;
            this.graphArea = resp.data[0].dimension;
            this.loading = false;
          } else {
            this.loading = false;
            this.$message.error(resp.msg);
          }
        }).catch(err => {
          console.log('查询 国家资金流图信息 出错', err);
          this.$message.error(err.message);
          return {};
        })
      }
    },
    // 校验添加状态/判断校验框
    addStatus(json){
        json.cells.forEach((v)=>{
          const type = v.shape == 'edge' ? 'line' : v.attrs.label.type;
          switch (type){
            case 'payInFlowNew':
            case 'payOutFlowNew':
             if(v.data.channelName == '' || v.data.subjectContract == '' || v.data.businessType == '' || v.data.transferCurrency == ''){
                v.checkSuccess = false;
                v.data.checkSuccess = false;
             }else{
                v.checkSuccess = true;
                v.data.checkSuccess = true;
             }
             break;
            case 'bankAccount':
              if(v.data.accountId == '' || v.data.flowFundsChart == ''){
                  v.checkSuccess = false;
                  v.data.checkSuccess = false;
              }else{
                  v.checkSuccess = true;
                  v.data.checkSuccess = true;
              }
              break;
            case 'exchangeCard':
              if(v.data.institutionName == ''){
                  v.checkSuccess = false;
                  v.data.checkSuccess = false;
              }else{
                  v.checkSuccess = true;
                  v.data.checkSuccess = true;
              }
              break;
            case 'line':
              const color = 'red';
              if(v.data.type == ''){
                  v.checkSuccess = false;
                  v.data.checkSuccess = false;
                  v.attrs = {
                    lines: {
                      connection: true,
                      strokeDasharray: '5,5',
                      strokeLinejoin: 'round',
                      fill: 'none',
                      cursor:'pointer'
                    },
                    line1: {
                      stroke: color,
                      strokeWidth: 3,
                      cursor:'pointer'
                    },
                    line3: {
                      strokeWidth: 3,
                      strokeDashoffset: 25,
                      stroke: color,
                      targetMarker: {
                        name: 'classic',
                        size: 8,
                        stroke: color,
                        strokeWidth: 1,
                        d: 'M 0 -4 0 -10 -12 0 0 10 0 4',
                      },
                      cursor:'pointer'
                    },
                  }
                }else{
                    v.checkSuccess = true;
                    v.data.checkSuccess = true;
                }
              break;
            default:
              break;
          }

        });
        return json;
    },
    changeGraphCountry(json){
      this.graph.fromJSON(json);
    },
    saveFlow() {
      // 存储本地数据
      if(this.graphArea == ''){
        this.$message.error('请选择“资金图维度”');
      }else if((this.graphArea == 'GLOBAL' || this.graphArea == 'REGION') && this.graphName == ''){
        this.$message.error('请选择“视图名称”');
      }else if(this.graphArea == 'COUNTRY' && this.graphCountry == ''){
        this.$message.error('请选择“国家”');
        return;
      }else if(this.graphArea == 'COUNTRY' && this.graphName == ''){
        this.$message.error('请选择“视图名称”');
      }else {
        this.saveFlowLoading = true;
        let json = this.graph.toJSON();
        json.cells.forEach(v => {
          v.checkSuccess = false;
          if(v.data.cardType== null || v.data.cardType == ''){
            if(v.attrs.lines){
              v.data.cardType =  'line';
            }else{
              v.data.cardType =  v.attrs.label.type;
            }
          }
        });
        const newJson = this.addStatus(json);
        // 重新渲染画布数据
        this.changeGraphCountry(newJson);
        // this.graph.centerContent();
        // 数据完整性校验
        const allActive =  newJson.cells.every(item => item.checkSuccess === true);
        console.log(newJson,'newJsonnewJsonnewJsonnewJson');
        // 数据完整性校验完成后，调用掉用保存接口
        if(allActive){
            console.log(this.graphName, this.graphCountry, '222222');
            saveCountryFundsFlow({
              flowNo: this.flowNo,
              flowName: this.graphName,
              country: this.graphArea == 'COUNTRY' ? this.graphCountry : '',
              flowHtml: JSON.stringify(newJson),
              dimension: this.graphArea || '',
             }).then(res => {
            const resp = res.data || {};
            if (resp.code === 'APPLY_SUCCESS') {
              this.$message.success('保存成功!');
              const { id, flowNo } = resp.data || {};
              const currentPath = this.$route.path;
              this.$router.push({ name: "countryFundsDetail", query: {
                id: id ? id : '',
                flowNo: flowNo ? flowNo : '',
                country: this.graphArea == 'COUNTRY' ? this.graphCountry : '',
                dimension: this.graphArea || '',
              }
              }, () => {
                this.$closeTagView(currentPath);
                this.timeSet = setTimeout(() => {
                  this.saveFlowLoading = false;
                }, 2000);
              });
            } else {
              console.log(resp.msg);
              this.$message.error(resp.msg);
              clearTimeout(this.timeSet);
            }
          }).catch(error => {
            this.$message.error("保存国家资金流出错");
            this.saveFlowLoading = false;
            clearTimeout(this.timeSet);
            return;
          });
        }else{
          this.$message.error("请确认卡片或连接线的必填信息填写完整");
          this.saveFlowLoading = false;
        }
      }
    },
    save() {
      if (!this.graph) return
      localStorage.setItem(KEY_LOC_STORE_NODES, JSON.stringify(this.graph.toJSON()));
    },
    //回到列表页
    backToList() {
      const currentPath = this.$route.path;
      this.$router.push('/topologyGraph/countryFunds/list');
      this.$closeTagView(currentPath);
    },
    getAccountInfo(accountAlias, callback) {
      getCompletedAccountDetail({ 'accountAlias': accountAlias }).then(res => {
        const resp = res.data || {};
        if (resp.code === 'APPLY_SUCCESS' && resp.data) {
          callback(resp.data.channelAccount || {}, resp.data.suggestRechargeAccount || {}, resp.data.extraInfo || {});
        } else {
          this.$message.error(resp.msg);
        }
      }).catch(err => {
        console.log('查询账户基本信息出错', err);
        this.$message.error(err.message);
        return {};
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.hover-edge:hover {
  stroke-width: 8px;
  stroke: black;
}
.page-header{
  .title{
    display: flex;
    .red-start{
      color: red;
      margin-right: 2px;
      font-size: 22px;
    }
  }
  .right-actions{
    cursor: pointer;
  }
  .little{
    margin-left:6px;
  }
}
.flex-row {
  display: flex;
  align-items: stretch;
}

.deleteNode {
  margin-top: 20px;
}

.bank-cho,
.pay-cho {
  margin-top: 20px;
}
.page-container {
  padding: 0 20px;
}

.desisionFlowGraph {
  position: relative;
  #minimapContainer{
    position: absolute;
    left:0;
    top: 0;
    margin-top: 47px;
    margin-left: 21%;
    width: 200px;
    height: 200px;
    z-index: 2;
  }
  .wrap {
    width: 100%;
    height: 100%;

    .content {
      display: flex;
      height: calc(100% - 48px);

      .sider {
        position: relative;
        width: 100%;
        height: 100vh;
        border-right: 1px solid rgba(0, 0, 0, 0.08);
      }

      .container {
        width: 70%;
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
      .deal-edge-pannel{
        border-left: 1px solid rgba(0, 0, 0, 0.08); 
        position: absolute;
        height: 100%;
        background-color: white;
        right:0;
        // margin-right:-40px;
        width: 260px;
      }
    }
  }
}
</style>
