<template>
  <div class="p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 font-weight-bold">Subcategorías</h1>
      <button @click="openModal()" class="btn btn-primary px-4 py-2 rounded shadow hover:bg-blue-700" :disabled="loading">
        Agregar Subcategoría
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
        <tr v-for="subcategoria in subcategorias" :key="subcategoria.id">
          <td>{{ subcategoria.id }}</td>
          <td>{{ subcategoria.descripcion }}</td>
          <td>
            <button @click="openModal(subcategoria)" class="btn btn-info btn-sm me-2">Editar</button>
            <button @click="deleteSubcategoria(subcategoria.id)" class="btn btn-danger btn-sm">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="showModal" class="modal fade show" style="display: block;" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ editMode ? 'Editar Subcategoría' : 'Agregar Subcategoría' }}</h5>
            <button type="button" @click="closeModal" class="btn-close" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveSubcategoria">
              <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción</label>
                <input v-model="form.descripcion" type="text" id="descripcion" class="form-control" required />
              </div>
              <div class="mb-3">
                <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
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
  name: 'Subcategorias',
  data() {
    return {
      subcategorias: [],
      categorias: [],
      showModal: false,
      editMode: false,
      form: { id: null, descripcion: '' },
      loading: false,
      categoriasMap: {}, // Asegúrate de inicializar categoriasMap aquí
    };
  },
  methods: {
    async fetchSubcategorias() {
      this.loading = true;
      const { data, error } = await supabase.from('subcategorias').select('*').order('id', { ascending: true });
      if (error) console.error('Error al obtener subcategorías:', error);
      else this.subcategorias = data;
      this.loading = false;
    },
    openModal(subcategoria = null) {
      if (this.loading) {
        alert('Por favor, espera mientras se cargan los datos...');
        return;
      }
      if (subcategoria) {
        this.editMode = true;
        this.form = { ...subcategoria };
      } else {
        this.editMode = false;
        this.form = { id: null, descripcion: '' };
      }
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async saveSubcategoria() {
      if (!this.form.descripcion ) {
        alert('Todos los campos son obligatorios');
        return;
      }
      this.loading = true;
      if (this.editMode) {
        const { error } = await supabase.from('subcategorias').update({
          descripcion: this.form.descripcion,
        }).eq('id', this.form.id);
        if (error) console.error('Error al actualizar subcategoría:', error);
      } else {
        const { error } = await supabase.from('subcategorias').insert([
          { descripcion: this.form.descripcion },
        ]);
        if (error) console.error('Error al agregar subcategoría:', error);
      }
      this.fetchSubcategorias();
      this.closeModal();
    },
    async deleteSubcategoria(id) {
      if (confirm('¿Estás seguro de que deseas eliminar esta subcategoría?')) {
        this.loading = true;
        const { error } = await supabase.from('subcategorias').delete().eq('id', id);
        if (error) console.error('Error al eliminar subcategoría:', error);
        else this.fetchSubcategorias();
      }
    },
  },
  mounted() {
    this.fetchSubcategorias();
  },
};
</script>

<style scoped>
body {
  background-color: #f7f9fc;
}
</style>
