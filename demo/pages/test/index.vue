<template>
  <div class="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <div class="h-96 border-4 border-dashed border-gray-200 rounded-lg p-10">
            <h1 class="text-gray-300">Hallo Welt 2 {{ test }}</h1>
            <NuxtLink to="/test/function">Function Test</NuxtLink>
        </div>
    </div>
</template>
<script setup>

   const test =  ref('Test')
   const todos = ref(null)
   const { save, update, remove } = useFirestoreSubscribe(()=>{
        const {query,orderBy,onSnapshot} = useFirestore()
        const todoRef = useFirestoreCollection("Todos")
        const q = query(todoRef, orderBy("createdAt", "desc"))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            handleFirestoreData(todos, querySnapshot)
            console.log(todos)
        })
        return unsubscribe
   })
   /*
   const { save, update, remove } = useFirestoreFetch(()=>{
   })
   */
</script>