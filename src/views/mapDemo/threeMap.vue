<template>
    <div class="pieCharts" ref="pieCharts">
        <threeMap></threeMap>
        <!-- <div>hh</div> -->
    </div>
</template>
  
<script>
import threeMap from '@/components/map/map.vue'
export default {
    components: { threeMap }
}
</script>
  
<style scoped>
.pieCharts {
    width: 100%;
    height: 100%;
}
</style>