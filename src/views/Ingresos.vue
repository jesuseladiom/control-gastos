<template>
  <div class="container mt-4">
    <h2 class="mb-4">Movimientos</h2>

    <button class="btn btn-success mb-3" @click="openModal()">Agregar Ingreso</button>

    <table class="table table-striped">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Fecha</th>
          <th>Tipo</th>
          <th>Importe</th>
          <th>Categoría</th>
          <th>Subcategoría</th>
          <th>Mes Pagando</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mov in movimientos" :key="mov.id">
          <td>{{ mov.id }}</td>
          <td>{{ mov.fecha }}</td>
          <td>{{ mov.tipo_mov === 'I' ? 'Ingreso' : 'Egreso' }}</td>
          <td>${{ mov.importe.toFixed(2) }}</td>
          <td>{{ categoriasMap[mov.categoria_id] || 'N/A' }}</td>
          <td>{{ subcategoriasMap[mov.subcategoria_id] || 'N/A' }}</td>
          <td>{{ mov.mes_pagando }}</td>
          <td>
            <button class="btn btn-info btn-sm me-2" @click="openModal(mov)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="deleteMovimiento(mov.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="movimientoModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editMode ? 'Editar Movimiento' : 'Agregar Ingreso' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveMovimiento">
              <div class="mb-3">
                <label class="form-label">Fecha</label>
                <input v-model="form.fecha" type="date" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Importe</label>
                <input v-model.number="form.importe" type="number" step="0.01" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Categoría</label>
                <select v-model="form.categoria_id" class="form-select" required>
                  <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.descripcion }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Subcategoría</label>
                <select v-model="form.subcategoria_id" class="form-select" required>
                  <option v-for="sub in subcategorias" :key="sub.id" :value="sub.id">{{ sub.descripcion }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Mes Pagando (seleccionar múltiples fechas)</label>
                <input type="date" v-model="mesPagandoInput" class="form-control mb-2" />
                <button type="button" class="btn btn-secondary btn-sm" @click="addMesPagando">Agregar Fecha</button>
                <ul class="list-group mt-2">
                  <li v-for="(fecha, index) in form.mes_pagando" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
                    {{ fecha }}
                    <button type="button" class="btn btn-danger btn-sm" @click="removeMesPagando(index)">X</button>
                  </li>
                </ul>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { supabase } from '../lib/supabase';
import { Modal } from 'bootstrap';

export default {
  name: 'Movimientos',
  data() {
    return {
      movimientos: [],
      categorias: [],
      subcategorias: [],
      categoriasMap: {},
      subcategoriasMap: {},
      form: { id: null, fecha: '', tipo_mov: 'I', importe: 0, categoria_id: null, subcategoria_id: null, mes_pagando: [] },
      mesPagandoInput: '',
      editMode: false,
      modalInstance: null,
    };
  },
  computed: {
    subcategoriasFiltradas() {
      return this.subcategorias.filter(sub => sub.categoria_id === this.form.categoria_id);
    }
  },
  methods: {
    async fetchMovimientos() {
      const { data, error } = await supabase.from('movimientos').select('*').order('fecha', { ascending: false });
      if (error) console.error('Error al obtener movimientos:', error);
      else this.movimientos = data;
    },
    async fetchCategorias() {
      const { data, error } = await supabase.from('categorias').select('*');
      if (error) console.error('Error al obtener categorías:', error);
      else {
        this.categorias = data;
        this.categoriasMap = Object.fromEntries(data.map(cat => [cat.id, cat.descripcion]));
      }
    },
    async fetchSubcategorias() {
      const { data, error } = await supabase.from('subcategorias').select('*');
      if (error) console.error('Error al obtener subcategorías:', error);
      else {
        this.subcategorias = data;
        this.subcategoriasMap = Object.fromEntries(data.map(sub => [sub.id, sub.descripcion]));
      }
    },
    openModal(movimiento = null) {
      if (movimiento) {
        this.editMode = true;
        this.form = { ...movimiento, mes_pagando: [movimiento.mes_pagando] };
      } else {
        this.editMode = false;
        this.form = { id: null, fecha: '', tipo_mov: 'I', importe: 0, categoria_id: null, subcategoria_id: null, mes_pagando: [] };
      }
      this.modalInstance.show();
    },
    async saveMovimiento() {
  if (!this.form.mes_pagando.length) {
    alert('Debes seleccionar al menos una fecha para Mes Pagando.');
    return;
  }

  const registros = this.form.mes_pagando.map(mes => ({
    fecha: this.form.fecha,
    tipo_mov: this.form.tipo_mov,
    importe: this.form.importe,
    categoria_id: this.form.categoria_id,
    subcategoria_id: this.form.subcategoria_id,
    mes_pagando: mes
  }));

  try {
    // Usar Promise.all para ejecutar todas las inserciones en paralelo
    const { error } = await supabase.from('movimientos').insert(registros);
    
    if (error) {
      console.error('Error al guardar movimientos:', error);
      alert('Hubo un error al guardar los movimientos.');
      return;
    }

    // Si todo salió bien, actualizar la lista y cerrar modal
    await this.fetchMovimientos();
    this.modalInstance.hide();

  } catch (err) {
    console.error('Error inesperado:', err);
    alert('Ocurrió un error inesperado.');
  }
},    
addMesPagando() {
      if (this.mesPagandoInput && !this.form.mes_pagando.includes(this.mesPagandoInput)) {
        this.form.mes_pagando.push(this.mesPagandoInput);
        this.mesPagandoInput = '';
      }
    },
    removeMesPagando(index) {
      this.form.mes_pagando.splice(index, 1);
    }
  },
  mounted() {
    this.fetchMovimientos();
    this.fetchCategorias();
    this.fetchSubcategorias();
    this.modalInstance = new Modal(document.getElementById('movimientoModal'));
  }
};
</script>
