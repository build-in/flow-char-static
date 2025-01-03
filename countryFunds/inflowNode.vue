<template>
    <el-popover
    placement="top"
    width="300"
    :disabled=" realpath == false ? true : false"
    trigger="hover">
    <div v-if="realpath">
      <div class="list-item" v-if="data.country">
        <div  class="weight-tilte">国家：</div>
        <div>{{ currentCountry }}</div>
      </div>
      <div  class="list-item" v-if="data.channelName">
        <div :class="['weight-tilte', Array.isArray(data.channelName) &&  data.channelName.length > 1 ? 'expaned-mulity' :'expaned-only' ] "> 渠道或银行：</div>
        <div style="width:200px;text-align: left;">
          <div class="main-area--title-long" v-if="Array.isArray(data.channelName) && data.channelName.length > 0">
          <span v-for="(item, index) in data.channelName" :key="index">
            {{ item }}
          </span> &nbsp;
          </div>
          <div v-else class="main-area--title">
            {{data.channelName}}
          </div>
        </div>
      </div>
      <div  class="list-item" v-if="data.subjectContract">
        <div class="weight-tilte">签约主体：</div>
        <div>{{data.subjectContract}}</div>
      </div>
      <div  class="list-item" v-if="data.transferCurrency">
        <div class="weight-tilte">支付币种：</div>
        <div>{{data.transferCurrency}}</div>
      </div>
      <div  class="list-item" v-if="data.businessType">
        <div class="weight-tilte">业务类型：</div>
        <div>{{data.businessType | getReal}}</div>
      </div>
      <div  class="list-item" v-if="data.settleCurrency">
        <div class="weight-tilte">结算币种：</div>
        <div>{{ data.settleCurrency }}</div>
      </div>
    </div>
    <div slot="reference" :class="['data-inflow-dag-node', checkSuccess ? ' ': 'verify-card']">
    <div class="main-area">
      <div class="main-area-content">
        <!-- <div class="main-area--title" v-if="data.country">{{ data.country }}</div> -->
        <div class="main-area--title-long" v-if="Array.isArray(data.channelName)">
          <span v-for="(item, index) in data.channelName" :key="index">
            {{ item }}
          </span>
        </div>
        <div v-else class="main-area--title">
          {{data.channelName}}
        </div>
        <div class="main-area-footer">
          <div>{{ data.subjectContract}}</div>
          <div>{{ data.transferCurrency}}</div>
          <div>{{ data.businessType  | getReal }}</div>
        </div>
      </div>
      <div class="main-area-right"></div>
      <div v-if="showClose" class="delete-node" @click="() => { deleteNode() }">
        <i class="node-logo" :style="closeLogo" />
      </div>
    </div>
    </div>
   </el-popover>
</template>

<script>
import close from '@/assets/close.png';
import { hasInDetail, currentRoutePath }  from './const/index';
import { getDictInfo } from "@/api/common";

const inFlow = [{
  value:'1',
  label:'渠道结算收款',
},{
  value:'2',
  label:'VA收款',
},{
  value:'3',
  label:'商户充值',
},{
  value:'4',
  label:'入转出',
}];

export default {
  name: 'DataInflowNode',
  inject: ["getGraph", "getNode"],
  data() {
    return {
      data: {
        cardType:'payInFlow',
        channelName:'',
        subjectContract:'',
        businessType:'',
        transferCurrency:'',
        flowFundsChart:'',
        fundTrendChart:'',
        settleCurrency:'',
        country:'',
      },
      showClose: hasInDetail(),
      checkSuccess: false,
      realpath: currentRoutePath(),
      currentCountry: '',
    };
  },
  computed: {
    closeLogo() {
      return {
        display: 'inline-block',
        backgroundImage: `url(${close})`,
        zIndex: 99999,
      };
    },
  },
  mounted() {
    const node = this.getNode();
    const data = node.getData();
    if (data) {
      this.data = data;
      this.checkSuccess = data.checkSuccess ? data.checkSuccess : false;
    }
    this.initCountry();
  },
  filters: {
    getReal(val) {
      let newLabel = '';
      inFlow.map((v) => {
        if (v.value == val) {
          newLabel = v.label;
        }
      });
      return newLabel;
    }
  },
  methods: {
    initCountry(){
      getDictInfo('payment_country')
          .then(resp => {
            const countryLists = resp.data.data.itemList || [];
            const enName  =  this.data.country;
            if(Array.isArray(countryLists) && countryLists.length){
              const country = countryLists.find(item => item.itemValue === enName);
              this.currentCountry = country ? country.itemName : '国家';
            }
          })
          .catch(err => {
            console.log('查询国家列表报错了', err);
            this.$message.error(err.message);
          });
    },
    deleteNode() {
      const node = this.getNode();
      const graph = this.getGraph();
      graph.removeNode(node.id);
    }
  }
}
</script>

<style lang="scss" scoped>
.list-item{
  display: flex;
  .expaned-mulity{
    width:110px;
  }
  .expaned-only{
    width: 95px;
  }
  .weight-tilte{
    font-weight: 600;
    margin-right:10px;
  }
}
.only-deal{
  justify-content: flex-start;
}
.verify-card{
  border: 3px solid red;
  border-radius: 12px;
  padding: 3px;
}
.data-inflow-dag-node {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  
  .main-area-content{
    display: flex;
    align-items: center;
    flex-direction: column;
    width:100%;
    min-height: 48px;
    .main-area--title{
      color:#1B1D1F;
      font-size: 14px;
      font-family: Poppins;
      font-weight: 500;
    }
    .main-area--title-long{
      color:#1B1D1F;
      font-size: 14px;
      font-family: Poppins;
      font-weight: 500;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 130px;
      overflow: hidden;
    }
    .main-area-footer{
      display: flex;
      color:#727880;
      font-size: 12px;
      font-family: Poppins;
      font-weight: 400;
      :nth-child(1){
        margin-right:5px;
      }
      :nth-child(2){
        margin-right:5px;
      }
    }
  }
  .main-area {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 5px 12px;
    width: 240px;
    height: 100%;
    color: #727880;
    font-size: 12px;
    font-family: PingFangSC;
    line-height: 24px;
    background-color: #fff;
    box-shadow: 0 -1px 4px 0 rgba(209, 209, 209, 50%), 1px 1px 4px 0 rgba(217, 217, 217, 50%);
    border-radius: 12px;
    border: 1px solid #C6C8CB;

    .delete-node {
      position: absolute;
      top: 0;
      right: 0;
      margin-right: -9px;
      margin-top: -9px;
      cursor: pointer;
      visibility: hidden;
      z-index: 2;
    }

    &:hover {
      border: 1px solid #727880;
      box-shadow: 0 -2px 4px 0 rgba(209, 209, 209, 50%), 2px 2px 4px 0 rgba(217, 217, 217, 50%);
      box-sizing: border-box;
      .delete-node {
        position: absolute;
        top: 0;
        right: 0;
        margin-right: -9px;
        margin-top: -9px;
        cursor: pointer;
        visibility: visible;
        z-index: 99999;
      }
    }
    .main-area-right{
      width: 12px;
      height: 100%;
      background: #F44444;
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
      position: absolute;
      top:0;
      right: 0;
    }
    .node-logo {
      display: inline-block;
      width: 20px;
      height: 20px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100%;
    }
  }
}
</style>