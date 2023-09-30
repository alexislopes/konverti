<script lang="ts" setup>
import download from "downloadjs";
import Papa from "papaparse";
import { ref, watch } from "vue";
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

const lastImport = useLocalStorage('lastImport', 0)

const handleFile = (file: File) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results: any) {
      csv.value = results.data.map(item => { return { ...item, Conta: account.value, Categoria: "" } });
    }.bind(this)
  });
}

const headers = computed(() => {
  if (csv.value.length > 0) {
    return Object.keys(csv.value[0]);
  }
  return [];
});

const downloadExemplo = () => {
  const header = ['Data', 'Descrição', 'Valor', 'Conta', 'Categoria']
  const rows = csv?.value.map(m => { return { ...m, Conta: account.value } }).map(dado => header.map(k => `"${dado[k]}"`))
  console.log(rows)

  // const header = keys.map(m => props.colunas.find(f => f.key === m)?.nome.normalize("NFD").replace(/[^a-zA-Z\s]/g, ""))
  // console.log(header)

  const convertedcsv = [
    header.map(m => `"${m}"`), // header row first
    ...rows,
  ]
    .map((m) => m.join(";"))
    .join("\r\n");

  console.log(convertedcsv)
  download(convertedcsv, `NUB2MOB Converter for ${account.value} at ${new Date().toLocaleDateString(navigator.language, { day: 'numeric', month: '2-digit', year: '2-digit', hour: 'numeric', minute: 'numeric' })}.csv`, "text/csv");

  lastImport.value = new Date().getTime();
}


watch(files, (files) => {
  handleFile(files[0])
})
</script>

<template>
<div class="flex items-center justify-center h-screen">
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
  </div>
</div>
</template>

<style scoped></style>
