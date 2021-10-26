<template>
  <div class="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <div class="h-96 border-4 border-dashed border-gray-200 rounded-lg p-10">
            <h1>Test Seite {{pending?'Lade':''}}</h1>
            <span>{{data?.name}}</span>
        </div>
    </div>
</template>
<script setup>
    const {pending,data} = await useAsyncFunction('fake','fakeCall')
</script>