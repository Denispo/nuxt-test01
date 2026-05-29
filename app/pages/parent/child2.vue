<script setup lang="ts">
const props = defineProps({
   foobar: String,
})


</script>
<template>
   <br>
   I am child2 view. {{props.foobar}}
   <br>
</template>