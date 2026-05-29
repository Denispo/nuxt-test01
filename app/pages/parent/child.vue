<script setup lang="ts">
const props = defineProps<{
   foobar: number,
}>()

</script>
<template>
   <br>
   --- I am child view. {{props.foobar}} ---
   <br>
</template>