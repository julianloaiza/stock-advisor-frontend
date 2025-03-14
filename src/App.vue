<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <header class="bg-gray-800 p-4 shadow-md">
      <div class="container mx-auto">
        <h1 class="text-2xl md:text-3xl font-bold text-center">Stock Advisor</h1>
      </div>
    </header>
    <main class="container mx-auto p-4">
      <router-view />
    </main>
  </div>
</template>
