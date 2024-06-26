import { computed, watch } from "vue";
import Papa from "papaparse";

export const usePapaparse = (file: Ref<File | undefined>) => {
  console.log("🚀 ~ file: usePapaparse.ts:4 ~ usePapaparse ~ file:", file.value)

  const csv = ref<object[] | undefined>([])
  const header = ref<string[] | undefined>([])

  // const onParseComplete = (results: any) => {
  //   console.log("🚀 ~ file: usePapaparse.ts:9 ~ onParseComplete ~ results:", results)
  //   csv.value = results.data //.map(item => { return { ...item, Conta: account.value, Categoria: "" } });
  // }

  watch(file, (file) => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (rslts: object[]) {
          header.value = rslts.meta.fields
          console.log("🚀 ~ file: usePapaparse.ts:21 ~ watch ~ rslts:", rslts)
          csv.value = rslts.data
        }  //onParseComplete.bind(this)
      });
    }
  })

  return { csv, header }
}
