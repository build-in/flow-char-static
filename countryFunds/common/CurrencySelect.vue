<template>
  <el-select v-model="currency" filterable clearable placeholder="请选择" @change="selectCurrency">
    <el-option
      v-for="item in currencyList"
      :key="item.itemValue"
      :label="item.itemValue"
      :value="item.itemValue">
    </el-option>
  </el-select>
</template>

<script>
import { getDictInfo } from "@/api/common";

export default {
  name: 'CurrencySelect',
  props: {
    defaultValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currencyList: [],
      currency: ''
    }
  },
  methods: {
    selectCurrency() {
      this.$emit('change', this.currency)
    },
    clear() {
      this.currency = '';
    }
  },
  created() {
    this.currency = this.defaultValue;
    getDictInfo('currency_mapping')
      .then(resp => {
        this.currencyList = resp.data.data.itemList;
      })
      .catch(err => {
        console.log('查询币种对列表报错了', err);
        this.$message.error(err.message);
      });
  }
}
</script>

<style scoped>

</style>
