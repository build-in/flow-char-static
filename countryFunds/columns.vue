<script>
import {stateEnum, dimensionEnum} from './dict/dict.js'
import {getDictInfo} from "@/api/common";

export default {
  data() {
    return {
      dictInfo: {}
    }
  },
  mounted() {
    getDictInfo('payment_country')
      .then(resp => {
        const countryLists = resp.data.data.itemList || [];
        if (Array.isArray(countryLists) && countryLists.length) {
          this.dictInfo = countryLists;
        }
      })
      .catch(err => {
        console.log('查询国家列表报错了', err);
        this.$message.error(err.message);
      });
  },

  computed: {
    columns() {
      return [
        // 流程编号
        {
          prop: 'flowNo',
          label: this.$$t('liquidity.label.flowNo'),
          minWidth: 110
        },
        // 流程名称
        {
          prop: 'flowName',
          label: this.$$t('liquidity.label.flowName'),
          minWidth: 110
        },
        // 维度
        {
          prop: 'dimension',
          label: this.$$t('liquidity.label.flowDimension'),
          minWidth: 110,
          render(h, row) {
            const dimension = dimensionEnum.find(item => item.value === row.dimension);
            return (<span>{dimension ? dimension.label : '/'}</span>)
          }
        },
        // 国家
        {
          prop: 'country',
          label: this.$$t('liquidity.label.flowCountry'),
          minWidth: 110,
          render(h, row) {
            const countryName = this.dictInfo.find(item => item.itemValue === row.country);
            return <span> {countryName ? countryName.itemName : row.country} </span>
          }
        },
        // 操作人
        {
          prop: 'operator',
          label: this.$$t('liquidity.label.operator'),
          minWidth: 110
        },
        // 创建时间
        {
          prop: 'utcCreateTime',
          label: this.$$t('liquidity.label.utcCreateTime'),
          minWidth: 110,
          render(h, row) {
            return <span> {this.$util.string.betterDisplay(this.$util.formatTime(row.utcCreateTime))} </span>
          }
        },
        // 流量视图状态
        {
          prop: 'state',
          label: this.$$t('liquidity.label.state'),
          minWidth: 110,
          render(h, row) {
            const state = stateEnum.find(item => item.value === row.state);
            return (<span>{state ? state.label : '/'}</span>)
          }
        },
        //操作
        {
          label: this.$t('common.action'),
          minWidth: 180,
          fixed: 'right',
          render(h, row) {
            const btnArr = []
            btnArr.push(<el-button type="text" size="small"
                                   onClick={() => this.changeStateFunc(row)}> {this.$$t('liquidity.action.changeState')} </el-button>)

            // 编辑
            btnArr.push(<el-button type="text" size="small"
                                   onClick={() => this.flowEdit(row)}> {this.$$t('liquidity.action.edit')} </el-button>)

            // 查看详情
            btnArr.push(<el-button type="text" size="small"
                                   onClick={() => this.flowDetail(row)}> {this.$$t('liquidity.action.accountDetail')} </el-button>)

            return (<span>{btnArr}</span>)
          }
        },
      ];
    },
  },
  methods: {
    flowEdit(row) {
      this.$router.push({name: "countryFundsCreate", query: this.assembleQueryParam(row, true)})
    },

    flowDetail(row) {
      this.$router.push({name: "countryFundsDetail", query: this.assembleQueryParam(row, false)})
    },

    assembleQueryParam(row, isEdit) {
      return {
        id: row.id,
        flowNo: row.flowNo,
        flowName: row.flowName,
        country: row.country,
        dimension: row.dimension,
        ...(isEdit ? {isEdit: 'Y'} : {})
      };
    }
  }
}
</script>
