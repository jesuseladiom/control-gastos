import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Categorias from '../views/Categorias.vue';
import Subcategorias from '../views/Subcategorias.vue';
import Ingresos from '../views/Ingresos.vue';
import Egresos from '../views/Egresos.vue';
import Informes from '../views/Informes.vue';
import Dashboard from '../views/Dashboard.vue';
import Configuracion from '../views/Configuracion.vue';
import AcercaDe from '../views/AcercaDe.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/categorias', name: 'Categorias', component: Categorias },
  { path: '/subcategorias', name: 'Subcategorias', component: Subcategorias },
  { path: '/ingresos', name: 'Ingresos', component: Ingresos },
  { path: '/egresos', name: 'Egresos', component: Egresos },
  { path: '/informes', name: 'Informes', component: Informes },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/configuracion', name: 'Configuracion', component: Configuracion },
  { path: '/acercade', name: 'AcercaDe', component: AcercaDe },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
