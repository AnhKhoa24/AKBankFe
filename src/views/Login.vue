<template>
  <div class="login-page d-flex align-items-center justify-content-center min-vh-100 px-3">
    <div class="login-card bg-white rounded-4 shadow-lg">
      <!-- Header -->
      <div class="card-header bg-success text-center text-white py-4 rounded-top-4">
        <img :src="logo" alt="Logo AKBank" class="logo mb-2" />
        <h3 class="fw-bold m-0">AKBank</h3>
      </div>

      <!-- Form Container -->
      <div class="card-body p-4">
        <!-- Login Form -->
        <div v-show="currentSection === 'login'">
          <form @submit.prevent="handleLogin">
            <div class="form-floating mb-3">
              <input
                v-model.trim="loginForm.account"
                type="text"
                class="form-control"
                id="inputAccount"
                placeholder="Email hoặc Tên đăng nhập"
                required
                :disabled="isLoading"
              />
              <label for="inputAccount">Email hoặc Tên đăng nhập</label>
            </div>

            <div class="form-floating mb-3">
              <input
                v-model.trim="loginForm.password"
                type="password"
                class="form-control"
                id="inputPassword"
                placeholder="Mật khẩu"
                required
                :disabled="isLoading"
              />
              <label for="inputPassword">Mật khẩu</label>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="form-check">
                <input
                  v-model="loginForm.remember"
                  class="form-check-input"
                  type="checkbox"
                  id="rememberCheck"
                  :disabled="isLoading"
                />
                <label class="form-check-label" for="rememberCheck">
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <a href="#" class="small text-success text-decoration-none">Quên mật khẩu?</a>
            </div>

            <div class="d-grid mb-3">
              <button
                type="submit"
                class="btn btn-success btn-lg fw-semibold d-flex justify-content-center align-items-center"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <span>{{ isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}</span>
              </button>
            </div>
          </form>

          <div v-if="errorLogin" class="alert alert-danger py-2 px-3 mt-2">
            {{ errorLogin }}
          </div>
        </div>

        <!-- OTP Form -->
        <div v-show="currentSection === 'otp'">
          <form @submit.prevent="handleOtp">
            <p class="mb-3 text-center">
              Mã OTP đã được gửi đến Email/SĐT. Vui lòng nhập mã để xác thực.
            </p>

            <div class="form-floating mb-3">
              <input
                v-model.trim="otpForm.code"
                type="text"
                class="form-control"
                id="inputOtp"
                placeholder="Mã OTP"
                maxlength="6"
                required
                :disabled="isOtpLoading"
              />
              <label for="inputOtp">Mã OTP</label>
            </div>

            <div class="d-grid mb-3">
              <button
                type="submit"
                class="btn btn-success btn-lg fw-semibold d-flex justify-content-center align-items-center"
                :disabled="isOtpLoading"
              >
                <span v-if="isOtpLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <span>{{ isOtpLoading ? 'Đang xác thực...' : 'Xác nhận OTP' }}</span>
              </button>
            </div>

            <div class="text-center">
              <a href="#" class="text-success text-decoration-none" @click.prevent="backToLogin">
                ← Quay lại đăng nhập
              </a>
            </div>
          </form>

          <div v-if="errorOtp" class="alert alert-danger py-2 px-3 mt-2">
            {{ errorOtp }}
          </div>
        </div>
      </div>
      <!-- End Card Body -->
    </div>
    <!-- End Login Card -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logo from '../assets/images/logo.png'

// --- Trạng thái hiển thị ---
const currentSection = ref('login') // 'login' hoặc 'otp'
const errorLogin = ref('')
const errorOtp = ref('')

// State loading
const isLoading = ref(false)
const isOtpLoading = ref(false)

// Dữ liệu form
const loginForm = ref({
  account: '',
  password: '',
  remember: false
})
const otpForm = ref({
  code: ''
})

// Lưu account tạm để gửi OTP
let savedAccount = ''

const router = useRouter()

// Hàm show/hide lỗi
function showLoginError(msg) {
  errorLogin.value = msg
}
function clearLoginError() {
  errorLogin.value = ''
}
function showOtpError(msg) {
  errorOtp.value = msg
}
function clearOtpError() {
  errorOtp.value = ''
}

// Xử lý submit login
async function handleLogin() {
  clearLoginError()

  const { account, password } = loginForm.value
  if (!account || !password) {
    showLoginError('Vui lòng điền đủ thông tin.')
    return
  }

  // Bắt đầu loading, disable nút
  isLoading.value = true

  try {
    const res = await fetch('https://anhkhoa.tryasp.net/api/Auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account, password })
    })
    const data = await res.json().catch(() => null)

    if (!res.ok) {
      let msg = 'Đăng nhập thất bại.'
      if (data && data.message) msg = data.message
      throw new Error(msg)
    }
    if (!data.success) {
      showLoginError(data.message || 'Đăng nhập thất bại.')
      return
    }

    // Chuyển sang form OTP
    savedAccount = account
    currentSection.value = 'otp'
  } catch (err) {
    showLoginError(err.message)
  } finally {
    // Dù thành công hay lỗi, đều tắt loading
    isLoading.value = false
  }
}

// Xử lý submit OTP
async function handleOtp() {
  clearOtpError()

  const { code } = otpForm.value
  if (!code) {
    showOtpError('Vui lòng nhập mã OTP.')
    return
  }
  if (!savedAccount) {
    showOtpError('Không tìm thấy tài khoản. Vui lòng đăng nhập lại.')
    return
  }

  // Bắt đầu loading cho OTP
  isOtpLoading.value = true

  try {
    const res = await fetch('https://anhkhoa.tryasp.net/api/Auth/otpVerified', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: savedAccount,
        otp: code,
        deviceInfo: navigator.userAgent,
        fcmToken: 'khongco'
      })
    })
    const data = await res.json().catch(() => null)
    // console.log()
    if (!res.ok) {
      let msg = 'Xác thực OTP thất bại.'
      if (data && data.message) msg = data.message
      throw new Error(msg)
    }
    if (!data.success) {
      showOtpError(data.message || 'Mã OTP không hợp lệ.')
      return
    }

    // Lưu token & chuyển hướng
    const token = data.token || data.data?.token
    if (token) localStorage.setItem('akbank_token', token)

    // console.log(roles)
    const roles = data.roles || data.data?.roles || []
    if (roles.includes('ADMIN')) {
      await router.push({ name: 'Admin' })
    } else {
      await router.push({ name: 'User' })
    }
  } catch (err) {
    showOtpError(err.message)
  } finally {
    // Dù thành công hay lỗi, đều tắt loading
    isOtpLoading.value = false
  }
}

// Quay về form login
function backToLogin() {
  clearOtpError()
  otpForm.value.code = ''
  currentSection.value = 'login'
}
</script>

<style scoped>
/* =========== GLOBAL CHO LOGIN PAGE =========== */
.login-page {
  background: linear-gradient(
    135deg,
    rgba(152, 194, 152, 0.9),
    rgba(46, 204, 113, 0.8)
  );
  background-size: cover;
  background-repeat: no-repeat;
}

/* Card border-radius cao hơn, shadow rõ nét */
.login-card {
  border-radius: 1rem; /* = rounded-3 */
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); /* = shadow-lg nhưng custom */
  max-width: 420px;
  width: 100%;
}

/* Header trong login-card */
.card-header {
  border-bottom: none;
}

/* Logo trong header */
.logo {
  max-width: 60px;
}

/* Input khi focus */
.form-control:focus {
  box-shadow: none;
  border-color: #006600;
}

/* Nút login / otp dùng màu chủ đạo */
.btn-login,
.btn-otp {
  background-color: #006600;
  border-color: #006600;
  font-weight: 600;
}

.btn-login:hover,
.btn-otp:hover {
  background-color: #005100;
  border-color: #005100;
}

/* Text nhỏ “Quên mật khẩu” */
a.text-success {
  font-size: 0.875rem;
}

/* Xóa margin default của body */
html,
body {
  margin: 0;
  padding: 0;
}
</style>