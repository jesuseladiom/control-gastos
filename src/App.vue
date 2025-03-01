<template>
  <div class="app">
    <Sidebar />
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
</script>

<style scoped>
.app {
  display: flex;
}

.content {
  flex: 1;
  padding: 2rem;
  background-color: #eaf0f8;
}
</style>
