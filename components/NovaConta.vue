<script lang="ts" setup>
import { ref } from "vue";

const descricao = ref('');

const contas = useLocalStorage('contas', [], {
  serializer: {
    read: (v: any) => v ? JSON.parse(v) : null,
    write: (v: any) => JSON.stringify(v),
  },
});

</script>

<template>
<div>
  <div class="join">
    <input v-model="descricao" class="input input-bordered join-item" placeholder="Crie uma nova conta" />
    <button class="btn join-item rounded-r-full" @click="contas.push(descricao)">Criar</button>
  </div>

</div>
</template>

<style scoped></style>
