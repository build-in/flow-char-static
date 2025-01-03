<template>
  <el-select v-model="institution" filterable clearable placeholder="请选择" :disabled="parentDisabled"
             @change="selectInstitution">
    <el-option
      v-for="item in institutionList"
      :key="item"
      :label="item"
      :value="item">
    </el-option>
  </el-select>
</template>

<script>
import {instCenterInstitutionQuery} from "@/api/common";

export default {
  name: 'InstCenterInstitutionSelect',
  data() {
    return {
      institutionList: [],
      institution: this.parentSelected
    }
  },
  props: {
    parentDisabled: {
      type: Boolean,
      default: false,
    },
    parentSelected: {
      type: String,
      default: '',
    },
  },
  watch: {
    parentSelected: {
      handler(n, o) {
        this.institution = n;
      },
      deep: true
    },
  },
  methods: {
    init() {
      this.institution = ''
    },
    selectInstitution() {
      this.$emit('change', this.institution)
    },
    setSelectedValueInSilence(newValue) {
      this.institution = newValue;
    },
    directlySetSelectedValue(newValue) {
      this.institution = newValue;
      this.selectInstitution();
    },
    clear() {
      this.institution = '';
    }
  },
  created() {
    instCenterInstitutionQuery()
      .then(resp => {
        this.institutionList = resp.data.data
      })
      .catch(err => {
        console.log('查询报错了', err);
        this.$message.error(err.message);
      });
  }
}
</script>

<style scoped>

</style>
