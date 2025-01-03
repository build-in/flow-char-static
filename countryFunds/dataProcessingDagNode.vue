<template>
  <div :class="['data-processing-dag-node', checkSuccess ? ' ': 'verify-card']">
    <div :class="[checkSuccess ? 'cover-set-next': 'cover-set']">
    </div>
    <div class="main-area" @mouseenter="onMainMouseEnter" @mouseleave="onMainMouseLeave">
      <div class="main-area-header">
        <BankIcon class="icon-instance-node"/>
        <div class="institution-alias">{{ data.institutionAlias.length > 14 ? `${data.institutionAlias.slice(-12)}...`: data.institutionAlias }}</div>
      </div>
      <div class="main-area-footer">
        <div>{{ data.contractEntity }}</div>
        <div>{{ data.currency }}</div>
        <div>{{ data.accountNo ? `** ${data.accountNo.slice(-4)}` : ''}}</div>
      </div>
      <div v-if="showClose" class="delete-node" @click="()=>{deleteNode()}">
        <i class="node-logo" :style="closeLogo" />
      </div>
    </div>
  </div>
</template>

<script>
import close from '@/assets/close.png';
import BankIcon from './components/bank.vue';
import { hasInDetail }  from './const/index';
export const PROCESSING_TYPE_LIST = [
  {
    type: 'FILTER',
    name: '数据筛选',
  },
  {
    type: 'JOIN',
    name: '数据连接',
  },
  {
    type: 'UNION',
    name: '数据合并',
  },
  {
    type: 'AGG',
    name: '数据聚合',
  },

  {
    type: 'OUTPUT',
    name: '数据输出',
  },
];

// 边状态列表
export const edgeStatusList = [
  {
    id: 'edge-0',
    status: 'success',
  },
  {
    id: 'edge-1',
    status: 'success',
  },
  {
    id: 'edge-2',
    status: 'success',
  },
  {
    id: 'edge-3',
    status: 'success',
  },
];

// 节点状态列表
export const nodeStatusList = [
  {
    id: 'node-0',
    status: 'success',
  },
  {
    id: 'node-1',
    status: 'success',
  },
  {
    id: 'node-2',
    status: 'success',
  },
  {
    id: 'node-3',
    status: 'success',
  },
  {
    id: 'node-4',
    status: 'error',
    statusMsg: '错误信息示例',
  },
];

export default {
  name: 'DataProcessingDagNode',
  inject: ["getGraph", "getNode"],
  data() {
    return {
      data: {
        cardType:'bankAccount',
        accountId: '',
        accountType: '',
        contractEntity: '',
        institutionAlias: '',
        country: '',
        currency: '',
        accountNo: '',
        flowFundsChart:'',
        fundTrendChart:''
      },
      showClose: hasInDetail(),
      // 节点类型
      NodeType: {
        INPUT: 'INPUT',   // 数据输入
        FILTER: 'FILTER', // 数据过滤
        JOIN: 'JOIN',     // 数据连接
        UNION: 'UNION',   // 数据合并
        AGG: 'AGG',       // 数据聚合
        OUTPUT: 'OUTPUT', // 数据输出
      },
      // 不同节点类型的icon
      NODE_TYPE_LOGO: {
        BANK: 'https://d00.paixin.com/thumbs/1062321/37008501/staff_1024.jpg', // 数据输入
        CHANNEL: 'https://d00.paixin.com/thumbs/1062321/37008501/staff_1024.jpg', // 数据连接
      },
      CellStatus: {
        DEFAULT: 'default',
        SUCCESS: 'success',
        ERROR: 'error',
      },
      checkSuccess: false,
    };
  },
  components:{
    BankIcon
  },
  computed: {
    accountLogo() {
      return {
        display: 'inline-block',
        backgroundImage: `url(${this.NODE_TYPE_LOGO[this.data.accountType]})`,
        marginRight:'10px',
        zIndex:99999,
      };
    },
    closeLogo(){
      return {
        display: 'inline-block',
        backgroundImage: `url(${close})`,
        zIndex:99999,
      };
    }
  },
  mounted() {
    const node = this.getNode();
    const data = node.getData();
    if (data) {
      this.data = data;
      this.checkSuccess = data.checkSuccess ? data.checkSuccess : false;
    }
  },
  methods: {
    // 鼠标进入矩形主区域的时候显示连接桩
    onMainMouseEnter() {
      //禁止历史记录
      // this.disableHistory();
      // const node = this.getNode();
      // 获取该节点下的所有连接桩
      // const ports = node.getPorts() || [];
      // ports.forEach((port) => {
      //   node.setPortProp(port.id, 'attrs/circle', {
      //     fill: '#fff',
      //     stroke: '#85A5FF',
      //   })
      // });
      // this.enableHistory();
    },

    // 鼠标离开矩形主区域的时候隐藏连接桩
    onMainMouseLeave() {
       //禁止历史记录
      // this.disableHistory();
      // const node = this.getNode();
      // 获取该节点下的所有连接桩
      // const ports = node.getPorts() || [];

      // ports.forEach((port) => {
      //   node.setPortProp(port.id, 'attrs/circle', {
      //     fill: 'transparent',
      //     stroke: 'transparent',
      //   });
      // });
      // this.enableHistory();
    },
    deleteNode(){
      const node = this.getNode();
      const graph = this.getGraph();
      graph.removeNode(node.id);
      console.log(node,'nodenodenode', graph,'graph');
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
.data-processing-dag-node {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
}
.cover-set{
  position: absolute;
  top:0;
  height: 48px;
  background: #FAEBEC;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  width: 92.2%;
  margin-left: 0.4%;
  z-index: 1;
  box-sizing: border-box;
  // opacity: 0.4;
  overflow: hidden;
  margin-top: 7px;
}
.cover-set-next{
  position: absolute;
  top:0;
  height: 48px;
  background: #FAEBEC;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  width: 98.8%;
  margin-left: 0.4%;
  z-index: 1;
  box-sizing: border-box;
  // opacity: 0.4;
  overflow: hidden;
  margin-top: 1px;
}

.country{
  color: #FFF;
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  /* Caption 1/Medium-500 */
  font-family: Poppins;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  border-radius: 12px;
  padding: 1px 8px;
  background: #727880;
}
.title{
  color: #1B1D1F;
  font-feature-settings: 'clig' off, 'liga' off;
  /* Subhead/Medium-500 */
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
}
.main-area {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px 12px;
  width: 240px;
  height: 80px;
  color: #727880;
  font-size: 12px;
  font-family: PingFangSC;
  line-height: 24px;
  background-color: #fff;
  // background: #FFF1D7; 
  box-shadow: 0 -1px 4px 0 rgba(209, 209, 209, 50%), 1px 1px 4px 0 rgba(217, 217, 217, 50%);
  border-radius: 12px;
  border: 1px solid #C6C8CB;
  // z-index: 99999999;
  .main-area-header{
    z-index: 2;
    display: flex;
    margin-top: 8px;
  }
  .main-area-footer{
    z-index: 2;
    display: flex;
    color:#727880;
    font-size: 12px;
    font-family: Poppins;
    font-weight: 500;
    justify-content: space-between;
  }
  .icon-instance-node {
    height: 24px !important;
    position: relative !important;
    width: 24px !important;
    margin-right: 8px;
  }
  .institution-alias{
      color:#1B1D1F;
      font-size: 14px;
      font-family: Poppins;
      font-weight: 500;
  }
  .delete-node{
    position: absolute;
    top:0;
    right:0;
    margin-right:-9px;
    margin-top: -9px;
    cursor: pointer;
    visibility: hidden;
    z-index:2;
  }
  &:hover{
    .delete-node{
      position: absolute;
      top:0;
      right:0;
      margin-right:-9px;
      margin-top: -9px;
      cursor: pointer;
      visibility:visible;
    }
  }
}

.main-area:hover {
  border: 1px solid #727880;
  box-shadow: 0 -2px 4px 0 rgba(209, 209, 209, 50%), 2px 2px 4px 0 rgba(217, 217, 217, 50%);
}

.node-logo {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}
.mes-con{
  z-index:99999;
}

.node-name {
  overflow: hidden;
  display: inline-block;
  width: 70px;
  margin-left: 6px;
  color: rgba(0, 0, 0, 65%);
  font-size: 12px;
  font-family: PingFangSC;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: top;
  z-index:99999;
}

.status-action {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.status-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
}

.status-icon-error {
  background: url('https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SEISQ6My-HoAAAAAAAAAAAAAARQnAQ') no-repeat center center / 100% 100%;
}

.status-icon-success {
  background: url('https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*6l60T6h8TTQAAAAAAAAAAAAAARQnAQ') no-repeat center center / 100% 100%;
}

.more-action-container {
  margin-left: 12px;
  width: 15px;
  height: 15px;
  text-align: center;
  cursor: pointer;
}

.more-action {
  display: inline-block;
  width: 3px;
  height: 15px;
  background: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*tFw7SIy-ttQAAAAAAAAAAAAADtOHAQ/original') no-repeat center center / 100% 100%;
}

.plus-dag {
  visibility: hidden;
  position: relative;
  margin-left: 12px;
  height: 48px;
}

.plus-action {
  position: absolute;
  top: calc(50% - 8px);
  left: 0;
  width: 16px;
  height: 16px;
  background: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*ScX2R4ODfokAAAAAAAAAAAAADtOHAQ/original') no-repeat center center / 100% 100%;
  cursor: pointer;
}

.plus-action:hover {
  background-image: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*tRaoS5XhsuQAAAAAAAAAAAAADtOHAQ/original');
}

.plus-action:active,
.plus-action-selected {
  background-image: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*k9cnSaSmlw4AAAAAAAAAAAAADtOHAQ/original');
}

.x6-node-selected .main-area {
  border-color: #3471f9;
}

.x6-node-selected .plus-dag {
  visibility: visible;
}

.processing-node-menu {
  padding: 2px 0;
  width: 105px;
  background-color: #fff;
  box-shadow: 0 9px 28px 8px rgba(0, 0, 0, 5%), 0 6px 16px 0 rgba(0, 0, 0, 8%),
    0 3px 6px -4px rgba(0, 0, 0, 12%);
  border-radius: 2px;
}

.processing-node-menu ul {
  margin: 0;
  padding: 0;
}

.processing-node-menu li {
  list-style: none;
}

.each-sub-menu {
  padding: 6px 12px;
  width: 100%;
}

.each-sub-menu:hover {
  background-color: rgba(0, 0, 0, 4%);
}

.each-sub-menu a {
  display: inline-block;
  width: 100%;
  height: 16px;
  font-family: PingFangSC;
  font-weight: 400;
  font-size: 12px;
  color: rgba(0, 0, 0, 65%);
}

.each-sub-menu span {
  margin-left: 8px;
  vertical-align: top;
}

.each-disabled-sub-menu a {
  cursor: not-allowed;
  color: rgba(0, 0, 0, 35%);
}

.node-mini-logo {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  vertical-align: top;
}

@keyframes running-line {
  to {
    stroke-dashoffset: -1000;
  }
}
</style>