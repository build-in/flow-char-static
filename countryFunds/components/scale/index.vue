<template>
  <div class="scale-graph">
    <div class="scale-min" @click="()=>{ zoomGraph('min') }">
        <Min />
    </div>
    <div class="scale-max" @click="()=>{ zoomGraph('max') }">
        <Max />
    </div>
  </div>
</template>

<script>
import Max from './max.vue';
import Min from './min.vue';
export default {
    name: "SclaleGraph",
    inject: ['app'],
    components: {
        Max,
        Min
    },
    methods: {
        zoomGraph(type){
            if(type == 'max'){
                this.app.graph.zoom(0.1);
                return;
            }
            this.app.graph.zoom(-0.1);
            return;
        },
    }
}
</script>

<style lang="scss" scoped>
.scale-graph{
    display: flex;
    .scale-min{
        width: 22px;
        margin-top: 2px;
    }
    .scale-max{
        margin-left: 25px;
        width: 27px;
    }
}
</style>