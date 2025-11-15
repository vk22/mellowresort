import { defineStore } from 'pinia'
// import { useToast } from "vue-toast-notification";
// const toast = useToast();
// import 'vue-toast-notification/dist/theme-bootstrap.css';


export const useAdminStore = defineStore('admin', {
  state: () => ({
    apiVersion: 'v1',
    loading: false,
    dialogIsOpen: false,
    deleteAnswerResult: false,
  }),
  actions: {
    async setLoading(state) {
      this.loading = state
    },

    async fetchData(route, method, body) {
      //console.log('fetchData method', route, method, body)
      
      this.setLoading(true);
      const { data, status } = await useFetch(`/api/${route}`, {
        method: method,
        body: body
      });
      this.setLoading(false);

      /// toast
      // if (process.client) {
      //   if (data.value.success) {
      //     toast.success(data.value.message, {
      //       timeout: 2000
      //     });
      //   } else {
      //     toast.error(data.value.message, {
      //       timeout: 2000
      //     });
      //   }
      // }

      if (status.value === 'success') {
        
        return {
         ...data.value
        }
        
      } else {
        return {
          success: false
        }
      }
    },
    async uploadFiles(formData) {
      const { data, pending } = await useFetch('/api/uploadgallery', { method: 'POST', body: formData })
      return data
    }
  },
  getters: {
    getDialogState(state) {
      return state.dialogIsOpen
    },
  }
})