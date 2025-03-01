<template>
    <aside class="sidebar">
      <router-link to="/">Home</router-link>
      <router-link to="/categorias">Categorías</router-link>
      <router-link to="/subcategorias">SubCategorías</router-link>
      <router-link to="/ingresos">Ingresos</router-link>
      <router-link to="/egresos">Egresos</router-link>
      <router-link to="/informes">Informes</router-link>
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/configuracion">Configuración</router-link>
      <router-link to="/acercade">Acerca de</router-link>
    </aside>
  </template>
  
  <style scoped>
  .sidebar {
    width: 250px;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background-color: #f4f4f4;
    height: 100vh;
  }
  
  .sidebar a {
    margin-bottom: 1rem;
    text-decoration: none;
    font-weight: bold;
    color: #333;
  }
  
  .sidebar a.router-link-active {
    color: #7c3aed;
  }
  </style>
  