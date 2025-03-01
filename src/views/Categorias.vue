<template>
    <div class="p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 font-weight-bold">Categorías</h1>
        <button @click="openModal()" class="btn btn-info px-4 py-2 rounded shadow hover:bg-purple-700">
          Agregar Categoría
        </button>
      </div>
  
      <table class="table table-striped table-bordered">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="categoria in categorias" :key="categoria.id">
            <td>{{ categoria.id }}</td>
            <td>{{ categoria.descripcion }}</td>
            <td>
              <button @click="openModal(categoria)" class="btn btn-info btn-sm me-2">Editar</button>
              <button @click="deleteCategoria(categoria.id)" class="btn btn-danger btn-sm">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Modal -->
      <div v-if="showModal" class="modal fade show" style="display: block;" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">{{ editMode ? 'Editar Categoría' : 'Agregar Categoría' }}</h5>
              <button type="button" @click="closeModal" class="btn-close" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveCategoria">
                <div class="mb-3">
                  <label for="descripcion" class="form-label">Descripción</label>
                  <textarea v-model="form.descripcion" id="descripcion" class="form-control"></textarea>
                </div>
                <div class="d-flex justify-content-end">
                  <button type="button" @click="closeModal" class="btn btn-secondary me-2">Cancelar</button>
                  <button type="submit" class="btn btn-success">Guardar</button>
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
  
  export default {
    name: 'Categorias',
    data() {
      return {
        categorias: [],
        showModal: false,
        editMode: false,
        form: { id: null, nombre: '', descripcion: '' },
        loading: false,
      };
    },
    methods: {
      async fetchCategorias() {
        this.loading = true;
        const { data, error } = await supabase.from('categorias').select('*').order('id', { ascending: true });
        if (error) console.error('Error al obtener categorías:', error);
        else this.categorias = data;
        this.loading = false;
      },
      openModal(categoria = null) {
        if (categoria) {
          this.editMode = true;
          this.form = { ...categoria };
        } else {
          this.editMode = false;
          this.form = { id: null, descripcion: '' };
        }
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
      },
      async saveCategoria() {
        this.loading = true;
        if (this.editMode) {
          const { error } = await supabase.from('categorias').update({
            descripcion: this.form.descripcion,
          }).eq('id', this.form.id);
          if (error) console.error('Error al actualizar categoría:', error);
        } else {
          const { error } = await supabase.from('categorias').insert([
            { descripcion: this.form.descripcion },
          ]);
          if (error) console.error('Error al agregar categoría:', error);
        }
        this.fetchCategorias();
        this.closeModal();
      },
      async deleteCategoria(id) {
        if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
          this.loading = true;
          const { error } = await supabase.from('categorias').delete().eq('id', id);
          if (error) console.error('Error al eliminar categoría:', error);
          else this.fetchCategorias();
        }
      },
    },
    mounted() {
      this.fetchCategorias();
    },
  };
  </script>
  
  <style scoped>
  body {
    background-color: #f7f9fc;
  }
  </style>
  