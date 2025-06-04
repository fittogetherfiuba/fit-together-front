<!-- MetricsView.vue  -->
<template>
  <div class="pa-4 d-flex flex-column align-center">
    <!-- ---------- SUB-MENÚ CON TABS ---------- -->
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab value="foods">Alimentos</v-tab>
      <v-tab value="water">Agua</v-tab>
      <v-tab value="activities">Ejercicios</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="mt-6" style="width:100%;">
      <!-- Foods -->
      <v-window-item value="foods">
        <FoodsMetricCard :userId="userId" />
      </v-window-item>

      <!-- Water -->
      <v-window-item value="water">
        <WaterMetricsCard :userId="userId" />
      </v-window-item>

      <!-- Activities -->
      <v-window-item value="activities">
        <ActivitiesMetricsCard :userId="userId" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import WaterMetricsCard      from '@/components/WaterMetricsCard.vue';
import ActivitiesMetricsCard from '@/components/ExercisesMetricsCard.vue';
import FoodsMetricCard       from '@/components/FoodsMetricCard.vue';

export default {
  name: 'MetricsView',
  components: { WaterMetricsCard, FoodsMetricCard, ActivitiesMetricsCard },
  data: () => ({ tab: 'foods' }),
  computed: {
    userId () { return this.$store.state.main.user.userId; }
  }
};
</script>
