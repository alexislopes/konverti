<script lang="ts" setup>

import { onMounted } from 'vue';

defineProps({
  file: {
    type: Object as PropType<File>,
    required: true,
  }
});
const progress = ref(0)
const interval = ref();

const frame = () => {
  if (progress.value >= 100) {
    clearInterval(interval.value);
  } else {
    progress.value += 1;
  }
}

onMounted(() => {
  interval.value = setInterval(frame, 10);
})

</script>

<template>
<div class="flex gap-4 bg-slate-600 p-4 rounded-md">
  <Icon name="teenyicons:spreadsheet-outline" class="text-4xl" />
  <div>

    <div>
      <p>{{ file.name }}</p>
      <div class="flex justify-between">
        <span>{{ file.size }} B</span>
        <p>{{ progress }}%</p>
      </div>
    </div>
    <progress class="progress" :value="progress" max="100"></progress>
  </div>
</div>
</template>

<style scoped></style>
