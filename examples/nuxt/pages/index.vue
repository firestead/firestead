<template>
  <div class="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
    <div class="h-96 border-4 border-dashed border-gray-200 rounded-lg p-10">
        <h1>Hallo Welt</h1>
        <p 
          v-for="(todo, index) in filteredTodos"
          v-bind:key="todo.id">
          {{todo.data.content}}
        </p>
        <a v-on:click="fetch()">reFetch</a>
        <h1>Env Key: {{config.TEST_PUBLIC_KEY_TEST}}</h1>
    </div>
  </div>
</template>
<script setup>
  const config = useRuntimeConfig()
  const { result: todos, state, fetchDetails, serverFetch, fetch, filter } = useFirestore('getTodos')

  watch(state.pending,(newState, oldState)=>{
      console.log(newState)
  })

  watch(fetchDetails.lastUpdate,(lastUpdate)=>{
      console.log(lastUpdate)
  })
  
  const filteredTodos = filter(todo => todo.id === 'CmFSYLLrXQABsTs5WPj9')

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