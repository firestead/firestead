<template>
      <div class="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <div class="border-4 border-dashed border-gray-200 rounded-lg p-10">
            <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
                <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                    <div class="ml-4 mt-2">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                        My Todos
                    </h3>
                    </div>
                    <div class="ml-4 mt-2 flex-shrink-0">
                    <button type="button" v-on:click="addTodo" class="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Add Todo
                    </button>
                    </div>
                </div>
            </div>
          <fieldset class="mt-5">
            <legend class="sr-only">
              Todos
            </legend>
            <div class="bg-white rounded-md -space-y-px">
                <div
                    v-for="(todo, index) in todos"
                    v-bind:key="todo.id"
                    v-bind:class="[
                        todo.data.checked ? 'bg-indigo-50 border-indigo-200 z-10' : 'border-gray-200',
                        (index===0) ? 'rounded-tl-md rounded-tr-md' : '',
                        ((todos.length-1)===index) ? 'rounded-bl-md rounded-br-md' : '',
                        todo.edit ? 'border-indigo-500 bg-gray-50 space-itm rounded-tl-md rounded-tr-md rounded-bl-md rounded-br-md' : ''
                        ]"  
                    class="relative border p-4 flex flex-row focus:outline-none">
                    <div class="flex-none inline-flex items-center">
                        <input 
                        type="checkbox" 
                        v-model="todo.data.checked"
                        v-on:change="updateDoc(index)" 
                        :disabled="todo.edit||todo.disabled" 
                        name="todo"
                        class="h-4 w-4 cursor-pointer text-indigo-600 border-gray-300 focus:ring-indigo-500" aria-labelledby="privacy-setting-0-label" aria-describedby="privacy-setting-0-description">
                    </div>
                    <div
                        v-on:click="toggleEdit(todo,index)"
                        v-bind:class="[
                            todo.data.checked ? '' : 'cursor-pointer'
                        ]"
                        class="ml-3 flex-grow inline-flex items-center"
                    >
                        <span 
                            id="privacy-setting-0-label"
                            v-show="!todo.edit"
                            v-bind:class="[
                                todo.data.checked ? 'text-indigo-900 line-through' : 'text-gray-900'
                            ]" 
                            class="block text-sm font-medium">
                            {{todo.data.content}}
                        </span>
                        <input 
                            type="text"
                            v-show="todo.edit" 
                            v-model="todo.data.content"
                            class="flex-grow"
                            v-on:keyup.enter="updateDoc(index)"
                            >
                    </div>
                    <button 
                    v-show="!todo.edit"
                    v-on:click="deleteDoc(index)"
                    type="button" class="flex-none inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
          </fieldset>
          
        </div>
      </div>
</template>
<script setup>
    const {
        state, 
        result: todos, 
        setDoc, 
        updateDoc, 
        deleteDoc, 
        updateResult,
        fetchDetails, 
        subscribe} = useFirestore('getTodos')
        
    //const { secureMiddleware } = useAuth()
    //await secureMiddleware()

    watch(state.pending,(newState, oldState)=>{
        console.log(newState)
    })
    watch(fetchDetails.lastUpdate,(lastUpdate)=>{
        console.log(lastUpdate)
    })

    const addTodo = async () =>{
        if(typeof todos !== 'undefined' && todos.value.length>0){
            for(const todo of todos.value){
                todo.edit = false
            }
        }
        await setDoc('Todos',{
            content: "",
            checked: false
        })
    }

    const toggleEdit = (todo,index) => {
        if(!todo.data.checked){
            for(const todoItem of todos.value){
                todoItem.disabled = true
                todoItem.edit = false
            }
            todo.data.checked = false
            todo.edit = true
            todos.value.splice(index, 1, todo)
        }
    }

    subscribe((db, { collection, query, orderBy, onSnapshot })=>{
        const todoRef = collection(db, "Todos")
        const q = query(todoRef, orderBy("createdAt", "desc"))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            updateResult(querySnapshot)
        })
        return unsubscribe
    })
</script>