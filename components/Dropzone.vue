<script lang="ts" setup>
import { toRef } from 'vue';
const emit = defineEmits(['onDrop', 'onDropError'])

const dropZoneRef = ref<HTMLDivElement>()
const file = ref<File | undefined>()
const matcher = ref<string[]>(["Data", "Valor", "Identificador", "Descrição"])
const { header } = usePapaparse(file)

const match = computed(() => {
  return matcher.value.filter(m => header.value.includes(m)).length === matcher.value.length
})

function onDrop(files: File[] | null) {
  file.value = files?.[0]

  const { type } = file.value

  if (type !== 'text/csv') {
    emit('onDropError', { message: 'Tipo de arquivo inválido' })
  }
  else if (!match.value) {
    emit('onDropError', { message: 'Arquivo contém estrutura inválida' })
  } else {
    emit('onDrop', files)
  }
}

const { files, isOverDropZone } = useDropZone(dropZoneRef, onDrop)
</script>

<template>
<div ref="dropZoneRef" class="flex flex-col items-center gap-6 p-4 border-2  border-spacing-2 rounded-md"
  :class="isOverDropZone ? 'border-violet-600 bg-violet-600/10' : 'border-dashed border-slate-700'">
  <Icon name="bi:upload" class="text-2xl" color="black" />
  <label class="font-medium text-slate-600">Arraste e solte ou <label for="input-file" class="text-violet-600 cursor-pointer">Escolha um
      arquivo</label> para upload</label>
  <p class="text-slate-600">CSV</p>
  <input type="file" id="input-file" class="hidden" accept=".csv" @change="onDrop($event.target.files)" />
</div>
</template>

<style scoped></style>
