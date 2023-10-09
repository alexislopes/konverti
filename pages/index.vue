<script lang="ts" setup>

useHead({
  title: "Konverti by Alexis Lopes",
  link: [{ rel: 'icon', type: 'image/png', href: '/favicon.ico' }]
})

import download from "downloadjs";
import Papa from "papaparse";
import { computed, ref, watch } from "vue";
const csv = ref([]);
const account = ref('');
const ocultados = ref([])

const files = ref<File[]>([]);

const contas = useLocalStorage('contas', [], {
  serializer: {
    read: (v: any) => v ? JSON.parse(v) : null,
    write: (v: any) => JSON.stringify(v),
  },
});

const parseDate = (date = "") => {

  date = new Date(
    ...date
      .split("/")
      .map((m) => Number(m))
      .reverse()
  );
  return new Date(date.setMonth(date.getMonth() - 1));
}

const date = ref({
  start: new Date(),
  end: new Date(),
})

const attrs = ref([
  {
    key: 'today',
    highlight: {
      color: '#7c3aed',
      fillMode: 'solid'
    },
    dates: new Date()
  }
])

const rules = ref({
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
});

const filtered = computed(() => {
  return csv.value.filter(m => {
    const data = new Date(parseDate(m.Data))
    return data.getTime() >= date.value.start.getTime() && data.getTime() <= date.value.end.getTime()
  })
})

const lastImport = useLocalStorage('lastImport', 0)

const handleFile = (file: File) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results: any) {
      csv.value = results.data.map(item => { return { ...item, Conta: account.value, Categoria: "" } });
      const datas = [... new Set(csv.value.map(m => parseDate(m.Data).getTime()))]
      date.value = {
        start: new Date(Math.min(...datas)),
        end: new Date(Math.max(...datas)),
      }
    }.bind(this)
  });
}


const downloadExemplo = () => {
  const header = ['Data', 'Descrição', 'Valor', 'Conta', 'Categoria']
  const rows = filtered?.value.map(m => { return { ...m, Conta: account.value } }).map(dado => header.map(k => `"${dado[k]}"`))

  const convertedcsv = [
    header.map(m => `"${m}"`), // header row first
    ...rows,
  ]
    .map((m) => m.join(";"))
    .join("\r\n");

  download(convertedcsv, `NUB2MOB Converter for ${account.value} at ${new Date().toLocaleDateString(navigator.language, { day: 'numeric', month: '2-digit', year: '2-digit', hour: 'numeric', minute: 'numeric' })}.csv`, "text/csv");

  lastImport.value = new Date().getTime();
}


watch(files, (files) => {
  handleFile(files[0])
})

const receitas = computed(() => {
  const valor = filtered.value.filter(f => Number(f.Valor) > 0).map(m => Number(m.Valor)).reduce((a, b) => a + b, 0)
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
})

const despesas = computed(() => {
  const valor = filtered.value.filter(f => Number(f.Valor) < 0).map(m => Number(m.Valor)).reduce((a, b) => a + b, 0)
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
})


</script>

<template>
<div class="flex items-center justify-center h-screen flex-col gap-6">
  <VDatePicker isDark v-model.range="date" :attributes="attrs" :max-date="new Date()" color="indigo" :rules="rules"
    :disabled="!filtered.length">
    <template #default="{ togglePopover, inputValue, inputEvents }">
      <div class="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden cursor-pointer"
        @click="togglePopover">
        <button
          class="flex justify-center items-center px-2 bg-accent-100 hover:bg-accent-200 text-accent-700 border-r border-gray-300 dark:bg-gray-700 dark:text-accent-300 dark:border-gray-600 dark:hover:bg-gray-600">
          <Icon name="octicon:calendar-16" class="text-xl" />
        </button>
        <input readonly :value="`${inputValue.start} - ${inputValue.end}`" v-on="inputEvents"
          class="flex-grow px-2 py-1 bg-white dark:bg-gray-700 cursor-pointer" />
      </div>
    </template>
  </VDatePicker>
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box flex justify-between items-center">
      <NovaConta />
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn btn-circle btn-outline btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </form>
    </div>
  </dialog>

  <div class="flex gap-4">
    <div class="flex flex-col">
      <div class="bg-[#fefefe] rounded-md p-5 flex gap-4 flex-col">
        <h1 class="text-xl font-medium text-slate-600">Adicione novas transferências</h1>
        <Dropzone @onDrop="files = $event" class="w-full" />

        <div v-for="file in files" :key="file.name">
          <FileItem :file="file" />
        </div>

        <div :class="files.length === 0 || !account ? 'tooltip' : ''"
          data-tip="Você precisa importar o arquivo de transferências e selecionar uma conta.">
          <button :disabled="files.length === 0 || !account" class="btn btn-block btn-primary"
            @click="downloadExemplo">converter</button>
        </div>
      </div>

    <!-- <div class="stats stats-horizontal lg:stats-horizontal shadow">
      <div class="stat">
        <div class="stat-title">Linhas filtradas</div>
        <div class="stat-value">{{ filtered.length }}</div>
        <div class="stat-desc">de {{ csv.length }} importadas</div>
      </div>

      <div class="stat">
        <div class="stat-title">Receitas</div>
        <div class="stat-value"> {{ receitas }}</div>
        <div class="stat-desc">no período {{ `${new Date(date.start).toLocaleDateString('pt-BR', { day: "numeric", month: "short" })} - ${new Date(date.end).toLocaleDateString('pt-BR', { day: "numeric", month: "short" })}` }}</div>

      </div>

      <div class="stat">
        <div class="stat-title">Despesas</div>
        <div class="stat-value">{{ despesas }}</div>
        <div class="stat-desc">no período {{ `${new Date(date.start).toLocaleDateString('pt-BR', { day: "numeric", month: "short" })} - ${new Date(date.end).toLocaleDateString('pt-BR', { day: "numeric", month: "short" })}` }}</div>
      </div>
    </div> -->
  </div>


    <div>
      <div class="form-control" v-for="conta in contas" :key="conta">
        <label class="label cursor-pointer flex gap-2">
          <input type="radio" name="radio-10" class="radio checked:bg-red-500" v-model="account" :value="conta" />
          <span class="label-text w-full !text-start  ">{{ conta }}</span>
        </label>
      </div>

      <button onclick="my_modal_1.showModal()" class="btn btn-ghost w-full">
        <Icon name="octicon:plus-16" class="text-xl" />
        Nova conta
      </button>
    </div>
    <div class="stats shadow">



    </div>
  </div>
  <div class="absolute top-0 right-0 p-8">
    <ProfileBadge />
  </div>
</div>
</template>

<style scoped></style>
