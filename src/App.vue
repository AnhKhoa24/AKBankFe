<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- Header (navbar) -->
    <nav
      ref="headerEl"
      class="navbar navbar-expand-lg navbar-dark bg-dark px-4 sticky-top transition"
      id="header"
    >
      <a class="navbar-brand" href="/">
        <img
          :src="logo"
          alt="Logo"
          width="30"
          height="30"
          style="transform: scale(1.5); transform-origin: center"
        />
        &nbsp;AKBank
      </a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link active" to="/">Trang chủ</router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center">
          <!-- Nếu chưa login, hiển thị icon login -->
          <router-link
            v-if="!isLogged"
            to="/login"
            id="id_avt"
            class="d-flex align-items-center text-white text-decoration-none"
          >
            <img
              :src="loginIcon"
              alt="avatar"
              width="32"
              height="32"
              class="rounded-circle"
            />
          </router-link>

          <!-- Nếu đã login, hiển thị dropdown avatar -->
          <div v-else class="dropdown">
            <a
              href="#"
              class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <!-- Hiển thị avatar thực của user, nếu chưa có thì mặc định defaultAvatar -->
              <img
                :src="userAvatar"
                alt="avatar"
                width="32"
                height="32"
                class="rounded-circle"
              />
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end dropdown-menu-dark text-small"
              aria-labelledby="dropdownUser1"
            >
              <li><a class="dropdown-item" href="#">Thông tin tài khoản</a></li>
              <li><a class="dropdown-item" href="#">Cài đặt</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="logout">Đăng xuất</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    <!-- End Header -->

    <!-- Nơi Vue Router “cắm” component theo route -->
    <main>
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4">
      <div class="container text-center">
        <p class="mb-0">© 2025 AKBank. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Import logo và icon login
import logo from './assets/images/logo.png'
import loginIcon from './assets/images/icons8-login-64.png'
// Avatar mặc định (nếu không có avatar riêng)
import defaultAvatar from './assets/images/logo.png'

const router = useRouter()
const headerEl = ref(null)

// Biến reactive để track trạng thái đã login hay chưa
const isLogged = ref(false)
// Biến chứa URL avatar của user (nếu fetch từ API hoặc lưu ở localStorage); mặc định defaultAvatar
const userAvatar = ref(defaultAvatar)

onMounted(() => {
  // 1) Kiểm tra token trong localStorage
  const token = localStorage.getItem('akbank_token')
  isLogged.value = !!token  // Nếu có token → true, không thì false

  // 2) Nếu bạn đã lưu URL avatar vào localStorage khi login, có thể đọc ở đây
  // Ví dụ:
  // const savedAvatar = localStorage.getItem('user_avatar')
  // if (savedAvatar) {
  //   userAvatar.value = savedAvatar
  // }

  // 3) Xử lý hiệu ứng scroll thay đổi màu background cho header
  // Đảm bảo bạn đã import jQuery trong index.html (hoặc bundle)
  const $header = $(headerEl.value)
  window.addEventListener('scroll', () => {
    if (window.scrollY > $header.height()) {
      $header.addClass('scrolled')
    } else {
      $header.removeClass('scrolled')
    }
  })
})

// Hàm logout: xóa token và chuyển về trang /login
function logout() {
  localStorage.removeItem('akbank_token')
  // Nếu có lưu avatar hay thông tin khác, xóa luôn:
  // localStorage.removeItem('user_avatar')

  isLogged.value = false
  router.push({ name: 'Login' })
}
</script>

<style>
/* Style cho class .scrolled khi scroll */
#header.scrolled {
  background-color: rgba(0, 0, 0, 0.85) !important;
  transition: background-color 0.3s ease;
}
</style>
