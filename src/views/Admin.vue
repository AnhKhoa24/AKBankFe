<!-- src/views/Admin.vue -->
<template>
  <div>
    <!-- Nội dung chính trang quản trị -->
    <main class="container my-5">
      <h1 class="mb-4 text-center">Thống kê giao dịch 7 ngày gần nhất</h1>

      <!-- Biểu đồ 7 ngày -->
      <div class="card shadow-sm mb-4">
        <div class="card-body position-relative" style="min-height: 350px;">
          <!-- Hiển thị spinner khi đang load biểu đồ -->
          <div v-if="loadingWeekly" class="d-flex justify-content-center align-items-center w-100 h-100">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <!-- Canvas chỉ hiển thị khi loadWeekly == false -->
          <canvas ref="weeklyCanvas" id="weeklyChart" height="200"></canvas>
        </div>
      </div>

      <!-- Bảng giao dịch -->
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Danh sách giao dịch</h5>
          <div class="table-responsive position-relative" style="min-height: 200px;">
            <!-- Spinner khi đang load bảng -->
            <div v-if="loadingTransactions" class="d-flex justify-content-center align-items-center w-100 h-100">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <!-- Table chỉ hiện khi load xong -->
            <table v-show="!loadingTransactions" id="transactionTable" class="table table-bordered table-striped mb-0">
              <thead class="table-dark">
                <tr>
                  <th>STT</th>
                  <th>FromAccount</th>
                  <th>ToAccount</th>
                  <th>Số tiền (đ)</th>
                  <th>Message</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(tx, index) in transactions" :key="tx.id || index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ tx.fromAccountNumber }}</td>
                  <td>{{ tx.toAccountNumber }}</td>
                  <td>{{ formatAmount(tx.amount) }}</td>
                  <td>{{ tx.message }}</td>
                  <td>{{ formatTimestamp(tx.timestamp) }}</td>
                </tr>
                <tr v-if="transactions.length === 0 && !loadingTransactions">
                  <td colspan="6" class="text-center py-3">Chưa có giao dịch nào</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Bạn có thể thêm các thành phần quản trị khác ở đây ... -->
    </main>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import Chart from 'chart.js/auto'

// State và biến reactive
const weeklyCanvas = ref(null)
const loadingWeekly = ref(true)
const loadingTransactions = ref(true)
const transactions = ref([])

const router = useRouter()

// Hàm định dạng số tiền (thêm dấu ngăn hàng nghìn)
function formatAmount(val) {
  if (val == null) return ''
  return val.toLocaleString('vi-VN')
}

// Hàm định dạng timestamp (giả sử server trả ISO string)
function formatTimestamp(ts) {
  if (!ts) return ''
  const dt = new Date(ts)
  const yyyy = dt.getFullYear()
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  const dd = String(dt.getDate()).padStart(2, '0')
  const hh = String(dt.getHours()).padStart(2, '0')
  const mi = String(dt.getMinutes()).padStart(2, '0')
  const ss = String(dt.getSeconds()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
}

// Hàm logout
function logout() {
  localStorage.removeItem('akbank_token')
  router.push({ name: 'Login' })
}

async function fetchWeeklyData() {
  loadingWeekly.value = true
  try {
    const res = await fetch('https://anhkhoa.tryasp.net/api/ThongKe/weekly', {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
    if (!res.ok) {
      throw new Error('Không lấy được dữ liệu thống kê. Status: ' + res.status)
    }
    const data = await res.json()
    // Chuẩn bị labels và data
    const labels = data.map((item) => {
      const dt = new Date(item.date)
      const day = String(dt.getDate()).padStart(2, '0')
      const month = String(dt.getMonth() + 1).padStart(2, '0')
      return `${day}/${month}`
    })
    const counts = data.map((item) => item.count)

    // Khởi tạo hoặc cập nhật chart
    const ctx = weeklyCanvas.value.getContext('2d')
    if (window.weeklyChartInstance) {
      window.weeklyChartInstance.destroy()
    }
    window.weeklyChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Số giao dịch',
            data: counts,
            backgroundColor: 'rgba(0, 123, 255, 0.6)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Ngày'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Số giao dịch'
            },
            ticks: {
              precision: 0
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.parsed.y} giao dịch`
            }
          }
        }
      }
    })

  } catch (err) {
    console.error(err)
  } finally {
    loadingWeekly.value = false
  }
}

async function fetchTransactions() {
  loadingTransactions.value = true
  try {
    const res = await fetch('https://anhkhoa.tryasp.net/api/ThongKe/datathongke', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: '' // Theo ví dụ bạn gửi body rỗng
    })
    if (!res.ok) {
      throw new Error('Không lấy được dữ liệu giao dịch. Status: ' + res.status)
    }
    const data = await res.json()
    // Server trả về mảng transaction
    transactions.value = data
  } catch (err) {
    console.error(err)
  } finally {
    loadingTransactions.value = false
  }
}

// Khi component mount, gọi API
onMounted(async () => {
  await Promise.all([fetchWeeklyData(), fetchTransactions()])
})
</script>

<style scoped>
/* Bỏ margin/padding mặc định */
html,
body {
  margin: 0;
  padding: 0;
}

/* Cho biểu đồ xuyên suốt chiều ngang */
#weeklyChart {
  width: 100%;
}
/* Style cho header sticky khi scroll, tương tự trước */
#header.scrolled {
  background-color: rgba(0, 0, 0, 0.85) !important;
  transition: background-color 0.3s ease;
}
</style>
