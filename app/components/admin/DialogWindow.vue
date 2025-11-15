<template>
  <v-dialog v-model="confirmConfig.isOpen" persistent max-width="400px">
    <v-card class="confirm-panel">
      <v-container>
        <v-row>
          <v-col> </v-col>
        </v-row>
        <div class="confirm-panel__content">
          <v-row>
            <v-col>
                <p>{{ confirmConfig.message }}</p>
            </v-col>
          </v-row>
        </div>
      </v-container>
      <v-card-actions class="confirm-panel__actions">
        <v-spacer></v-spacer>
        <div
          variant="outlined"
          class="btn admin-sm-btn"
          @click="confirmConfig.cancel"
        >
          {{ confirmConfig.cancelLabel }}

        </div>
        <div
          variant="outlined"
          class="btn admin-sm-btn ml-3 red"
          @click="confirmConfig.confirm"
        >
          {{ confirmConfig.confirmLabel }}
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useConfirm } from '@/compositions/useConfirm';
const { confirmConfig } = useConfirm()
</script>

<style lang="scss" scoped>

.confirm-panel {
  font-family: $font-sans;

  h1,
  h2,
  h3 {
    font-family: $font-sans;
    color: #111;
    font-weight: 600;
  }

  &__content {
    padding: .5rem;
  }
  &__actions {
    border-top: 1px solid #ddd;
    padding: 1rem;
  }
}
</style>