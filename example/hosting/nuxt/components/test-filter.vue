<template>
    <h1>Test Filter</h1>
    <span>{{todo?.data?.content}}</span>
</template>
<script setup>
    const { filter, fetch } = useFirestore('getTodos')

    const todo = filter((todo) => todo.id === '98GY3dB71Ovtc1pByu69', true)

    fetch(async ()=>{
        console.log('Test filter with fetch')
    })
</script>