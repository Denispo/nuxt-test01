<script setup lang="ts">

</script>
<template>
   <div>
      I am parent
      <br>
      <NuxtPage :foobar="123" />
      -----------
      <br>
      <NuxtPage :foobar="555" />
   </div>
</template>