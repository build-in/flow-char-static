<template>
  <div v-if="options" :id="chartId" :style="{ width: '100%', height: '400px' }"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "FundsChart",
  props: {
      options: {
          type: Object,
          required: true
      },
      chartId: {
          type: String,
          required: true
      }
  },
  data() {
      return {
          chart: null,
      }
  },
  watch: {
    options: {
      handler: 'init',
      deep: true,
      immediate: true
    }
  },
  mounted(){
      this.init();
      this.resize();
  },
  methods:{
      init(){
          this.$nextTick(() => {
            this.chart = echarts.init(document.getElementById(this.chartId));
            this.options && this.chart.setOption(this.options);
          })
      },
      resize(){
        let that = this;
          window.addEventListener("resize", () => {
            that.chart.resize();
        });
      }
  },
  beforeDestroy(){
    let that = this;
    if (this.chart) {
      that.chart.dispose();
    }
    window.removeEventListener('resize', ()=> {
      that.chart.resize();
    })
  }
}
</script>

<style></style>