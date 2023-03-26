<template>
  <div class="pieCharts" ref="pieCharts">
    <pieCharts></pieCharts>
  </div>
</template>

<script>
import pieCharts from '@/components/pie/pie.vue'
export default {
    components:{pieCharts}
}
</script>

<style scoped>
.pieCharts{
    width: 100%;
    height: 100%;
}
</style>