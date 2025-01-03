<template>
  <div :class="['data-exchange-dag-node', checkSuccess ? ' ': 'verify-card']">
    <div class="main-area">
      <div class="main-area-content">
        <Exchange class="icon-instance-node" />
        <div class="main-area--title">{{ data.institutionName}}</div>
      </div>
      <div class="main-area-left"></div>
      <div class="main-area-right"></div>
      <div v-if="showClose" class="delete-node" @click="() => { deleteNode() }">
        <i class="node-logo" :style="closeLogo" />
      </div>
    </div>
  </div>
</template>

<script>
import close from '@/assets/close.png';
import Exchange from '../../topologyGraph/countryFunds//components/Exchange';
import { hasInDetail, deleteNode }  from './const/index';

const outFlow = [{
  value:'1',
  label:'资金代发',
},{
  value:'2',
  label:'结算',
}];

export default {
  name: 'DataOutflowNode',
  inject: ["getGraph", "getNode"],
  components: {
    Exchange
  },
  data() {
    return {
      data: {
        cardType:'exchange',
        institutionName:'',
      },
      showClose: hasInDetail(),
      checkSuccess: false,
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
  },
  filters: {
    getReal(val) {
      let newLabel = '';
      outFlow.map((v) => {
        if (v.value == val) {
          newLabel = v.label;
        }
      });
      return newLabel;
    }
  },
  methods: {
    deleteNode() {
      const node = this.getNode();
      const graph = this.getGraph();
      graph.removeNode(node.id);
    }
  }
}
</script>

<style lang="scss" scoped>
.verify-card{
  border: 3px solid red;
  border-radius: 12px;
  padding: 3px;
}
.data-exchange-dag-node {
  display: flex;
  flex-direction: row;
  align-items: center;
  
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
    .main-area-left{
      width: 12px;
      height: 100%;
      background: #FB9701;
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
      position: absolute;
      top:0;
      left: 0;
    }
    .main-area-right{
      width: 12px;
      height: 100%;
      background: #FB9701;
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