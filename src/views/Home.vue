<!-- src/views/Home.vue -->
<template>
  <div>
    <!-- Hero Banner -->
    <header
      class="bg-dark position-relative text-white"
      style="min-height: 60vh; overflow: hidden;"
    >
      <img
        :src="bannerImg"
        alt="Banner AKBank"
        class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover opacity-50"
      />
      <div
        class="p-5 mt-5 container h-100 d-flex flex-column justify-content-center align-items-center text-center"
      >
        <h1 class="display-4 fw-bold">Chào mừng đến với AKBank</h1>
        <p class="lead">Giải pháp tài chính thông minh – Uy tín – An toàn</p>
      </div>
    </header>

    <!-- Section Giới thiệu -->
    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-5">Tại sao nên chọn AKBank</h2>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <img
                :src="img1"
                class="card-img-top"
                alt="Tín dụng nhanh"
              />
              <div class="card-body">
                <h5 class="card-title">Tín dụng nhanh</h5>
                <p class="card-text">
                  Hỗ trợ vay vốn chỉ trong 24 giờ với lãi suất cạnh tranh.
                </p>
              </div>
              <div class="card-footer bg-transparent border-top-0">
                <a href="#" class="btn btn-outline-success">Tìm hiểu thêm</a>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <img
                :src="img2"
                class="card-img-top"
                alt="Lưu trữ an toàn"
              />
              <div class="card-body">
                <h5 class="card-title">Lưu trữ an toàn</h5>
                <p class="card-text">
                  Bảo mật tối ưu với công nghệ mã hóa chuẩn quốc tế.
                </p>
              </div>
              <div class="card-footer bg-transparent border-top-0">
                <a href="#" class="btn btn-outline-success">Tìm hiểu thêm</a>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <img
                :src="img3"
                class="card-img-top"
                alt="Dịch vụ 24/7"
              />
              <div class="card-body">
                <h5 class="card-title">Dịch vụ 24/7</h5>
                <p class="card-text">
                  Tư vấn và hỗ trợ khách hàng mọi lúc mọi nơi.
                </p>
              </div>
              <div class="card-footer bg-transparent border-top-0">
                <a href="#" class="btn btn-outline-success">Tìm hiểu thêm</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Vì Home.vue nằm ở src/views/, để import ảnh từ src/assets/images, ta dùng đường dẫn tương đối:
import bannerImg from '../assets/images/banner.webp'
import img1 from '../assets/images/tindungnhanh.jpg'
import img2 from '../assets/images/luutruantoan.jpg'
import img3 from '../assets/images/247.webp'
</script>

<style scoped>
/* Các style riêng cho Home.vue (nếu cần) */
</style>
