<script lang="ts" setup>
const emit = defineEmits(['onDrop'])

const dropZoneRef = ref<HTMLDivElement>()

function onDrop(files: File[] | null) {
  emit('onDrop', files)
}

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)
</script>

<template>
<div ref="dropZoneRef" class="flex flex-col items-center gap-6 p-4 border-2  border-spacing-2 rounded-md"
  :class="isOverDropZone ? 'border-violet-600 bg-violet-600/10' : 'border-dashed border-slate-700'">
  <Icon name="bi:upload" class="text-2xl" color="black" />
  <label class="font-medium text-slate-600">Arraste e solte ou <label for="input-file" class="text-violet-600 cursor-pointer">Escolha um
      arquivo</label> para upload</label>
  <p class="text-slate-600">CSV</p>
  <input type="file" id="input-file" class="hidden" @change="onDrop($event.target.files)" />
</div>
</template>

<style scoped></style>
