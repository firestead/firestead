<template>
    <Block label="Todo" description="Example todo app with firestore">
        <div>
            <button @click="toggleTodos">Toggle todos</button> <br />
            <form @submit.prevent="addTodo">
            <input v-model.trim="newTodoText" placeholder="Add new todo" />
            <button>Add Todo</button>
            </form>
            <ul>
            <TodoItem
                v-for="todo in todos"
                :key="todo.id"
                :todo="todo"
                @delete="removeTodo"
                @update:todo="updateTodo"
            />
            </ul>
        </div>
    </Block>
</template>
<script setup lang="ts">
import {
  push,
  remove,
  ref as dbRef,
  serverTimestamp,
  update,
} from 'firebase/database'
import { ref } from 'vue'
import { useDatabase, useDatabaseList } from 'vuefire'
import type { Todo } from '../todo-item.vue'

const db = useDatabase()
const todosRef = dbRef(db, 'todos')
// TODO:
// const finishedTodos = query(todosRef, where('finished', '==', true))
// const unfinishedTodos = query(todosRef, where('finished', '==', false))

const todos = useDatabaseList<Todo>(todosRef)

const newTodoText = ref('')

function addTodo() {
  if (newTodoText.value) {
    push(todosRef, {
      text: newTodoText.value,
      finished: false,
      created: serverTimestamp(),
    })
    newTodoText.value = ''
  }
}

function updateTodo(id: string, newTodo: Todo) {
  update(dbRef(db, 'todos/' + id), newTodo)
}

function removeTodo(id: string) {
  remove(dbRef(db, 'todos/' + id))
}

function toggleTodos() {
  // TODO:
}
</script>