<template>
  <el-select v-model="channelSubject" filterable clearable placeholder="请选择" :disabled="parentDisabled"
             @change="selectChannelSubject">
    <el-option
      v-for="item in channelSubjectList"
      :key="item.itemKey"
      :label="item.itemValue"
      :value="item.itemKey">
    </el-option>
  </el-select>
</template>

<script>

import { listChannelSubject } from "@/api/common";

export default {
  name: 'ChannelSubjectSelect',
  data() {
    return {
      channelSubjectList: [],
      channelSubject: this.parentSelected
    }
  },
  props: {
    parentSelected: {
      type: String,
      default: '',
    },
    parentDisabled: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    parentSelected: {
      handler (n, o) {
        this.channelSubject = n;
      },
      deep: true
    },
  },
  methods: {
    init(){
      this.channelSubject = ''
    },
    selectChannelSubject() {
      this.$emit('change', this.channelSubject)
    },
    setSelectedValueInSilence(newValue) {
      this.channelSubject = newValue;
    },
    directlySetSelectedValue(newValue) {
      this.channelSubject = newValue;
      this.selectChannelSubject();
    },
    clear() {
      this.channelSubject = '';
    }
  },
  created() {
    listChannelSubject()
      .then(resp => {
        this.channelSubjectList = resp.data.data;
      })
      .catch(err => {
        console.log('查询我方主体列表报错', err);
        this.$message.error(err.message);
      });
  }
}
</script>

<style scoped>

</style>
