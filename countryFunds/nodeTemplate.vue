<template>
  <div class="data-inflow-dag-node">
    <div class="cover-set">
    </div>
    <div class="main-area" @mouseenter="onMainMouseEnter" @mouseleave="onMainMouseLeave">
           资金流入
      <div class="delete-node" @click="()=>{deleteNode()}">
        <i class="node-logo" :style="closeLogo" />
      </div>
    </div>
  </div>
</template>

<script>
import close from '@/assets/close.png';

export default {
  name: 'DataProcessingDagNode',
  inject: ["getGraph", "getNode"],
  data() {
    return {
      data: {
        accountId: '',
        accountType: '',
        contractEntity: '',
        institutionAlias: '',
        country: '',
        currency: '',
        accountNo: ''
      }
    };
  },
  computed: {
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
    }
  },
  methods: {
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
.data-inflow-dag-node {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.cover-set{
  position: absolute;
  top:0;
  height: 32px;
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
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 12px;
  width: 240px;
  height: 60px;
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
  .delete-node{
    position: absolute;
    top:0;
    right:0;
    margin-right:-9px;
    margin-top: -9px;
    cursor: pointer;
    visibility: visible;
    z-index:2;
  }
  // &:hover{
  //   .delete-node{
  //     position: absolute;
  //     top:0;
  //     right:0;
  //     margin-right:3px;
  //     margin-top: 3px;
  //     cursor: pointer;
  //     visibility:visible;
  //   }
  // }
}

.main-area:hover {
  border: 1px solid rgba(0, 0, 0, 10%);
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

</style>