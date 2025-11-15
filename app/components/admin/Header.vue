<template>
  <div class="admin-nav">
    <nav class="admin-header">
      <div class="main-logo">
        <nuxt-link :to="'/admin/reservations'" class="">
        </nuxt-link>
      </div>
      <div class="logout" v-if="authenticated">
        <a href="#" class="admin-sm-btn" @click="logout()">
          <v-icon :icon="'mdi-logout-variant'" class="icon"></v-icon>  
          Logout
        </a>
      </div>
    </nav>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from '~/store/auth';
const authStore = useAuthStore();
const authenticated = computed(() => authStore.isAuthenticated);
const router = useRouter();

const logout = async () => {
  await authStore.logOut();
};
</script>


<style lang="scss" scoped>


.admin-header {
  font-family: $font-sans;
  height: 70px;
  z-index: 99;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0 1.5rem;
  background: transparent;
  

  .container {
    max-width: 100%;
    margin-top: 0;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: space-between;

    /*прижимает содержимое к краям */
    align-items: center;
  }

  .main-logo {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    width: 125px;

    img {
      width: 100%;
    }

    a {
      font-size: 18px;
      font-weight: 700;
      color: #111;
    }
  }

  .logout {
    display: flex;
    // font-size: .8rem;
    // text-transform: uppercase;
    // font-weight: 500;
    // color: #999;
  }

  ul {
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;
    justify-content: flex-end;

    li {
      padding: 0 20px;

      a {
        color: #111;
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: .5px;
        font-size: .9rem;

        &:hover {
          color: #333;
        }

        &.nuxt-link-exact-active, &.nuxt-link-active {
          color: $mainColor;
        }
      }
    }
  }

  .logout a:hover {
    color: #333;
  }
}

</style>
