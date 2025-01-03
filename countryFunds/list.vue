<template>
  <div class="page-container">
    <div class="page-header">
      <div class="title">{{ $$t("liquidity.route.countryFundsList") }}</div>
      <el-button type="primary" @click="$router.push({name: 'countryFundsCreate'})">
        {{ $$t("liquidity.action.add") }}
      </el-button>
    </div>

    <div class="search-form">
      <el-form ref="searchForm" :model="queryForm">
        <el-row justify="left" class="action-group">
          <el-col :span="6">
            <el-form-item class="formItem" :label="$$t('liquidity.label.flowDimension')" prop="dimension">
              <el-select v-model="queryForm.dimension" filterable clearable placeholder="请选择状态">
                <el-option
                  v-for="(item, index) in dimensionEnum"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item class="formItem" :label="$$t('liquidity.label.flowCountry')" prop="country">
              <CountrySelect v-bind:parentSelected="queryForm.country" @change="fundsCountrySelect"
                             ref="fundsCountrySelect"/>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item class="formItem" :label="$$t('liquidity.label.flowName')" prop="flowName">
              <el-input v-model="queryForm.flowName" clearable placeholder="请输入流量视图名称"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item class="formItem" :label="$$t('liquidity.label.state')" prop="state">
              <el-select v-model="queryForm.state" filterable clearable placeholder="请选择状态">
                <el-option
                  v-for="(item, index) in stateEnum"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 按钮 -->
        <el-row justify="left" class="action-group">
          <base-button type="primary" @click="updateTable(1)">
            {{
              $t("common.actions.search")
            }}
          </base-button>
          <el-button type="primary" plain @click="onReset">
            {{
              $t("common.actions.reset")
            }}
          </el-button>
        </el-row>
      </el-form>
    </div>

    <si-render-table
      ref="table"
      v-bind="tableBind"
      :columns="columns"
      @update="searchReq"
      border>
    </si-render-table>

    <el-dialog
      title="状态变更确认"
      :visible.sync="stateVisible"
      width="30%">
      <el-form label-position="top" label-width="80px" :model="flowRow">
        <el-form-item :label="this.$$t('liquidity.label.flowNo')" prop="flowNo">
          <el-input v-model="flowRow.flowNo" disabled/>
        </el-form-item>
        <br/>
        <el-form-item :label="this.$$t('liquidity.label.flowName')" prop="flowName">
          <el-input v-model="flowRow.flowName" disabled/>
        </el-form-item>
        <br/>
        <el-form-item :label="this.$$t('liquidity.label.flowCountry')" prop="country">
          <el-input v-model="flowRow.country" disabled/>
        </el-form-item>
        <br/>
        <el-form-item :label="this.$$t('liquidity.label.state')" prop="state">
          <el-select v-model="flowRow.state" disabled placeholder="请选择状态">
            <el-option
              v-for="(item, index) in stateEnum"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <br/>
        <el-form-item :label="this.$$t('liquidity.label.state')" prop="state">
          <el-select v-model="flowRow.newState" filterable clearable placeholder="请选择状态">
            <el-option
              v-for="(item, index) in stateEnum"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="stateVisible = false">{{ $t("common.actions.cancel") }}</el-button>
          <el-button type="primary" @click="confirmChangeStatus">{{ $t('common.actions.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import CountrySelect from "../../../../components/funds/select/CountrySelect.vue";
import SiRenderTable from "../../../../components/si-table/renderTable.vue";
import columns from "./columns.vue";
import {getFlowList, stateChange} from "../../../../api/liquidity/topology";
import {stateEnum, dimensionEnum} from './dict/dict.js';

export default {
  name: "countryFundsList",
  mixins: [columns],
  components: {SiRenderTable, CountrySelect},
  data() {
    return {
      queryForm: {
        dimension: '',
        country: '',
        flowName: '',
        state: '',
      },
      stateEnum: stateEnum,
      dimensionEnum: dimensionEnum,
      stateVisible: false,
      flowRow: {},
      pageIndex: '',
      limit: '',
      tableBind: {
        data: [],
        total: 0,
        pageSize: 50,
        loading: false,
        showPagination: true,
      },
    };
  },
  methods: {
    // 国家选择变化
    fundsCountrySelect(country) {
      this.queryForm.country = country ? country : '';
    },

    //重置
    onReset() {
      //将表单的值变为初始状态
      this.queryForm = {};

      this.updateTable(this.$refs.table.pagination.currentPage);
    },

    // 生成请求数据
    getSearchData() {
      const formData = Object.assign({}, this.queryForm);

      formData.pageIndex = this.pageIndex;
      formData.limit = this.limit;
      return formData;
    },

    // 更新
    updateTable(pageNum) {
      this.$refs.table && this.$refs.table.updateDrive(pageNum);
    },
    // 查找
    searchReq(eq) {
      this.tableBind.loading = true;
      this.pageIndex = eq.pageNum;
      this.limit = eq.pageSize;

      getFlowList(this.getSearchData()).then(res => {
        const resData = (res.data || {}).data || {}
        const tableData = resData.rows || []
        this.tableBind.total = resData.total || 0;
        this.tableBind.data = tableData
        this.tableBind.loading = false;
      }).catch(err => {
        this.tableBind.data = [];
        this.tableBind.total = 0;
        this.tableBind.loading = false;

        this.$message.error(err.message);
      })
    },
    // 状态变更
    changeStateFunc(row) {
      this.flowRow = row;
      this.stateVisible = true;
    },
    confirmChangeStatus() {
      const params = {
        id: this.flowRow.id,
        state: this.flowRow.newState,
      };
      if (this.flowRow.state === this.flowRow.newState) {
        this.$message.warning('状态未变更');
        return;
      }
      stateChange(params).then(res => {
        if (res.data.code === 'APPLY_SUCCESS' && res.data.data) {
          this.$message.success('状态变更成功');
          this.updateTable(this.$refs.table.pagination.currentPage);
        } else {
          this.$message.error('状态变更失败');
        }
      })
      this.stateVisible = false;
    },

  }
}
</script>

<style  lang="scss" scoped>
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

/deep/ input[type="number"] {
  -moz-appearance: textfield;
}
</style>
