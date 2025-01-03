<template>
  <div class="frame">
    <div class="block">
      <!-- <div class="text-wrapper">马来西亚</div> -->
      <!-- <ArrowDown class="icon-instance-node" /> -->
      <!-- <CountrySelect v-bind:parentSelected="graphCountry" ref="fundsCountrySelect">
        </CountrySelect> -->
      <el-popover
        placement="bottom"
        width="200"
        trigger="hover"
        :content="topSelectionData.flowName"
      >
        <div slot="reference" class="view-set">
          {{ topSelectionData.flowName || "视图" }}
        </div>
      </el-popover>
    </div>
    <div class="icons-wrapper">
      {{ currentCountry }}
    </div>
    <div class="icons-wrapper" @click="changeBillStatus">
      <div style="width: 28px">{{ lcyFlag ? "LCY" : "USD" }}</div>
      <div style="margin-top: 3px">
        <BtnChange class="icon-instance-node" />
      </div>
    </div>
    <div class="icons-wrapper">
      <div
        @click="changeTimeStatus"
        style="
          display: flex;
          align-items: center;
          background: #eaeaea;
          padding: 4px 8px;
          border-radius: 4px;
        "
      >
        <div style="margin-top: 3px; margin-right: 2px">
          <Calendar class="icon-instance-node" />
        </div>
        <div style="width: 29px">{{ zhouFlag ? "按周" : "按月" }}</div>
      </div>
      <div>
        <el-date-picker
          v-model="value1"
          :picker-options="pickerOptions"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          style="width: 195px"
          prefix-icon="none"
          @change="getdatePickTime"
          end-placeholder="结束时间"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="icons-wrapper">
      <el-popover
        placement="bottom"
        trigger="hover"
        width="50px"
        height="120px"
        v-model="visibleArrow"
      >
        <div
          class="icon-select-style"
          style="
            justify-content: center;
            align-items: center;
            display: flex;
            flex-direction: column;
            cursor: pointer;
          "
        >
          <div style="margin-bottom: 15px" @click="checkItem('le', leSt)">
            <TypeLeft class="icon-instance-node" :status="leSt" />
          </div>
          <div style="margin-bottom: 15px" @click="checkItem('ri', riSt)">
            <TypeRight class="icon-instance-node" :status="riSt" />
          </div>
          <div @click="checkItem('bo', boSt)">
            <TypeBottom class="icon-instance-node" :status="boSt" />
          </div>
        </div>
        <div slot="reference" @click="checkItem('al', alSt)">
          <TypeAll
            class="icon-instance-node"
            style="margin-top: 3px"
            :status="alSt"
          />
        </div>
      </el-popover>
    </div>
    <div class="icons-wrapper">
      <el-popover
        placement="bottom"
        trigger="hover"
        width="50px"
        height="120px"
        v-model="visibleVersion"
      >
        <div
          class="icon-select-style"
          style="
            justify-content: center;
            align-items: center;
            display: flex;
            flex-direction: column;
            cursor: pointer;
          "
        >
          <div
            v-for="(item, index) in graphVersionList"
            class="div-wrapper-blue"
            :key="`${index}_index`"
            @mouseover="hoveredIndex = index"
            @mouseleave="hoveredIndex = null"
          >
            <div
              @click="selectVersion(item)"
              :class="{
                'hover-blue': hoveredIndex == index,
                'version-list': true,
              }"
            >
              <span>V{{ item.version }}</span>
              <span style="margin-left:10px">{{ item.utcCreateTime | formatTime }}</span>
            </div>
          </div>
        </div>
        <div slot="reference">
          <Clock class="icon-instance-node" style="margin-top: 3px" />
        </div>
      </el-popover>
    </div>
    <div class="icons-wrapper" @click="checkCommonApi('info')">
      <TypeInfo class="icon-instance-node" />
    </div>
    <div class="div-wrapper" @click="dataExport">
      <!-- <div class="div" @click="edit">{{ $$t('liquidity.action.edit') }}</div> -->
      <div>数据导出</div>
      <div style="margin-top: 3px">
        <DownLoad class="icon-instance-node" />
      </div>
    </div>
  </div>
</template>

<script>
import CountrySelect from "@/components/funds/select/CountrySelect";
import ArrowDown from "./ArrowDown";
import TypeAll from "./TypeAll";
import TypeBottom from "./TypeBottom";
import TypeInfo from "./TypeInfo";
import TypeLeft from "./TypeLeft";
import TypeRight from "./TypeRight";
import BtnChange from "./BtnChange.vue";
import Clock from "./Clock.vue";
import DownLoad from "./DownLoad.vue";
import Calendar from "./Calendar.vue";
import { getDictInfo } from "@/api/common";
import { dimensionEnum } from '../dict/dict';

export default {
  name: "TopSelection",
  inject: ["app"],
  props: {
    topSelectionData: {
      default: {},
      type: Object,
    },
    graphVersionList: {
      default: [],
      type: Array,
    },
  },
  components: {
    ArrowDown,
    TypeAll,
    TypeBottom,
    TypeInfo,
    TypeLeft,
    TypeRight,
    CountrySelect,
    BtnChange,
    Clock,
    DownLoad,
    Calendar,
  },
  data() {
    return {
      graphCountry: "",
      flowNo: this.$route.query.flowNo,
      dimension: this.$route.query.dimension,
      alSt: false,
      leSt: false,
      riSt: false,
      boSt: false,
      inSt: false,
      value1: [new Date().setMonth(new Date().getMonth() - 1), new Date()],
      hoveredIndex: null,
      lcyFlag: true,
      zhouFlag: true,
      timeStart: "",
      timeEnd: "",
      currentVersion: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      visibleArrow: false,
      visibleVersion: false,
      currentCountry:'',
    };
  },
  mounted() {
    this.initCountry();
    this.initDropSelect();
  },
  filters: {
    formatTime: function (timestamp) {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
  },
  methods: {
    initCountry(){
      if(this.dimension == '' || this.dimension == undefined || this.dimension == null){
        this.currentCountry = '视图';
        return;
      }
      if(this.dimension == 'COUNTRY'){
        getDictInfo('payment_country')
          .then(resp => {
            const countryLists = resp.data.data.itemList || [];
            const enName  =  this.topSelectionData.country;
            if(Array.isArray(countryLists) && countryLists.length){
              const country = countryLists.find(item => item.itemValue === enName);
              this.currentCountry = country ? country.itemName : '国家';
            }
          })
          .catch(err => {
            console.log('查询国家列表报错了', err);
            this.$message.error(err.message);
          });
          return;
      } else {
        dimensionEnum.forEach(item => {
          if(item.value == this.dimension){
            this.currentCountry = item.label;
          }
        })
      }
    },
    selectVersion(val) {
      this.visibleVersion = !this.visibleVersion;
      if (val) {
        this.currentVersion = val;
        this.app.setTopVersion(this.currentVersion);
      } else {
        this.currentVersion = null;
        this.app.setTopVersion(this.currentVersion);
      }
    },
    getdatePickTime(val) {
      if (val) {
        [this.timeStart, this.timeEnd] = [val[0].getTime(), val[1].getTime()];
        this.app.setTopTime(this.timeStart, this.timeEnd);
      } else {
        [this.timeStart, this.timeEnd] = [null, null];
        this.app.setTopTime(this.timeStart, this.timeEnd);
      }
    },
    changeBillStatus() {
      this.lcyFlag = !this.lcyFlag;
      this.app.setLCYorUSD(this.lcyFlag);
    },
    changeTimeStatus() {
      this.zhouFlag = !this.zhouFlag;
      this.app.setZhouorYue(this.zhouFlag);
    },
    // 数据导出实现
    dataExport() {
      // 传递视图名称当作导出excel文件的文件名拼接币种类型LCY或USD
      this.app.detailedDataExportToExcel(this.topSelectionData.flowName);
    },
    initDropSelect() {
      const popovers = document.querySelectorAll(".el-popover");
      popovers.forEach((popover) => {
        popover.style.minWidth = "50px";
      });
    },
    handleSelectStyle(index) {
      console.log(index, "index");
    },
    edit() {
      const currentPath = this.$route.path;
      this.$router.push(
        { name: "countryFundsCreate", query: { flowNo: this.flowNo } },
        () => {
          this.$closeTagView(currentPath);
        }
      );
    },
    // initFlow() {
    // if (!this.flowNo) {
    //   this.$message.error("国家资金流号不能为空!");
    //   return;
    // }
    // getFlowContent({ 'flowNo': this.flowNo }).then(res => {
    //     const resp = res.data || {};
    //     if (resp.code === 'APPLY_SUCCESS' && resp.data) {
    //       const flowHtml = resp.data.flowHtml;
    //       if (flowHtml && this.graph) {
    //         this.graph.fromJSON(JSON.parse(flowHtml));
    //         // this.graph.centerContent();
    //       }
    //       this.graphCountry = resp.data.country;
    //     } else {
    //       this.$message.error(resp.msg);
    //     }
    //   }).catch(err => {
    //     console.log('查询 国家资金流图信息 出错', err);
    //     this.$message.error(err.message);
    //     return {};
    //   })
    // },
    checkItem(val, st) {
      // if(st) return;
      // update btn style
      // update layout
      this.visibleArrow = !this.visibleArrow;
      this.app.checkVe(val);
      this.app.setTableAllSet();
    },
    checkCommonApi(val) {
      this.app.checkVe(val);
      this.app.setTableAllSet();
    },
    changeBtnStyle(val) {
      switch (val) {
        case "al":
          this.alSt = true;
          this.leSt = false;
          this.riSt = false;
          this.boSt = false;
          break;
        case "le":
          this.alSt = false;
          this.leSt = true;
          this.riSt = false;
          this.boSt = false;
          break;
        case "ri":
          this.alSt = false;
          this.leSt = false;
          this.riSt = true;
          this.boSt = false;
          break;
        case "bo":
          this.alSt = false;
          this.leSt = false;
          this.riSt = false;
          this.boSt = true;
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.frame {
  align-items: center;
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid;
  border-color: rgba(234, 234, 234, 1);
  border-radius: 12px;
  font-size: 14px;
  display: inline-flex;
  height: 48px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  z-index: 2;
}
.div-wrapper-blue {
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  padding: 5px 7px;
}
.version-list {
  padding: 5px 7px;
}
.hover-blue {
  background: rgba(55, 130, 255, 1);
  color: white; /* 可选：更改文本颜色以提高可读性 */
  border-radius: 4px;
}

.frame .block {
  align-items: center;
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid;
  border-color: rgba(234, 234, 234, 1);
  display: inline-flex;
  flex: 0 0 auto;
  gap: 8px;
  height: 50px;
  justify-content: center;
  margin-bottom: -1px;
  margin-left: -1px;
  margin-top: -1px;
  padding: 0px 16px;
  position: relative;
  color: #1b1d1f;
  font-weight: 600;
  .view-set {
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    word-break: keep-all;
  }
}

.frame .text-wrapper {
  color: rgba(234, 234, 234, 1);
  font-family: "Poppins", Helvetica;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  letter-spacing: 0px;
  line-height: 21px;
  position: relative;
  white-space: nowrap;
  width: fit-content;
}

.frame .icon-instance-node {
  height: 16px !important;
  position: relative !important;
  width: 16px !important;
}

.frame .icons-wrapper {
  align-items: center;
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid;
  border-color: rgba(234, 234, 234, 1);
  display: inline-flex;
  flex: 0 0 auto;
  gap: 8px;
  height: 50px;
  justify-content: center;
  margin-bottom: -1px;
  margin-top: -1px;
  padding: 0px 16px;
  position: relative;
  /deep/ .el-date-editor .el-range-separator {
    padding: 0 0px;
    width: 7%;
  }
  /deep/ .el-popover {
    min-width: 50px !important;
  }
  /deep/ .el-date-editor.el-date-editor--daterange .el-range-input {
    width: 100%;
  }
}

.frame .div-wrapper {
  align-items: center;
  /* background-color: rgba(55, 130, 255, 1); */
  border: 1px solid;
  border-color: rgba(234, 234, 234, 1);
  display: inline-flex;
  flex: 0 0 auto;
  gap: 8px;
  height: 50px;
  justify-content: center;
  margin-bottom: -1px;
  margin-top: -1px;
  padding: 0px 16px;
  position: relative;
}

.frame .div {
  color: rgba(255, 255, 255, 1);
  font-family: "Poppins", Helvetica;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  letter-spacing: 0px;
  line-height: 21px;
  position: relative;
  white-space: nowrap;
  width: fit-content;
}

/deep/ .el-input__inner {
  border: none;
  width: 110px;
}
</style>
