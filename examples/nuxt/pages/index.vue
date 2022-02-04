<template>
  <div class="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
    <div class="h-96 border-4 border-dashed border-gray-200 rounded-lg p-10">
        <h1>Hallo Welt</h1>
        <p 
          v-for="(todo, index) in todos"
          v-bind:key="todo.id">
          {{todo.data.content}}
        </p>
        <a v-on:click="fetch()">reFetch</a>
    </div>
  </div>
</template>
<script setup>
  const { result: todos, state, fetchDetails, serverFetch, fetch } = useFirestore('getTodos')

  watch(state.pending,(newState, oldState)=>{
      console.log(newState)
  })

  watch(fetchDetails.lastUpdate,(lastUpdate)=>{
      console.log(lastUpdate)
  })

  fetch(async (db, {collection, getDocs, query, orderBy})=>{
    console.log('fetch function')
    const todoRef = collection(db, 'Todos')
    const q = query(todoRef, orderBy("createdAt", "desc"))
    return await getDocs(q)
  })
  
  await serverFetch(async ( db )=>{
    return await db.collection('Todos').get()
  })
</script>