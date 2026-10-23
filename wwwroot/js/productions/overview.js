/**
 * PRODUCTIONS - OVERVIEW JS
 * Khởi tạo dữ liệu biểu đồ, sự kiện lọc, refresh số liệu cho dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
  initBanner();
  initRefreshButtons();
  initCharts();
});

/**
 * Đóng banner chào mừng
 */
function initBanner() {
  const dismissBtn = document.getElementById('btnDismissBanner');
  const banner = document.getElementById('welcomeBanner');

  if (dismissBtn && banner) {
    dismissBtn.addEventListener('click', () => {
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        banner.classList.add('dismissed');
      }, 250);
    });
  }
}

/**
 * Sự kiện làm mới số liệu (Refresh)
 */
function initRefreshButtons() {
  const refreshBtns = document.querySelectorAll('.btn-refresh-stat');

  refreshBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.add('spinning');

      // Giả lập cập nhật thời gian thực
      setTimeout(() => {
        btn.classList.remove('spinning');
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const footerTime = btn.parentElement.querySelector('.stat-time-val');
        if (footerTime) {
          footerTime.textContent = `${hours}:${minutes}`;
        }
      }, 600);
    });
  });
}

/**
 * Khởi tạo biểu đồ (sử dụng Chart.js nếu có, hoặc Canvas Engine tích hợp)
 */
function initCharts() {
  renderTopProductsChart();
  renderOrderStatusChart();
}

/**
 * Biểu đồ 1: Top sản phẩm có sản lượng cao nhất (Cột dọc)
 */
function renderTopProductsChart() {
  const canvas = document.getElementById('topProductsChart');
  if (!canvas) return;

  const data = {
    labels: ['Khay c...', 'Sắc nô...', 'Thang...', 'Đỡ cổ...', 'Bộ DIY...'],
    values: [435, 202, 164, 145, 28]
  };

  // Nếu có Chart.js từ CDN
  if (typeof Chart !== 'undefined') {
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: '#34a853',
          hoverBackgroundColor: '#2b8a44',
          borderRadius: 2,
          barThickness: 48
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `Sản lượng: ${context.parsed.y.toLocaleString()} sp`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#64748b',
              font: { size: 12 }
            }
          },
          y: {
            min: 0,
            max: 450,
            ticks: {
              stepSize: 50,
              color: '#94a3b8',
              font: { size: 11 }
            },
            grid: {
              color: '#f1f5f9'
            }
          }
        }
      }
    });
  } else {
    // Fallback vẽ bằng Canvas thuần nếu không có mạng
    drawFallbackBarChart(canvas, data);
  }
}

/**
 * Biểu đồ 2: Lệnh sản xuất theo trạng thái (Donut Chart)
 */
function renderOrderStatusChart() {
  const canvas = document.getElementById('orderStatusChart');
  if (!canvas) return;

  const chartData = {
    labels: ['Chưa sản xuất', 'Đang sản xuất', 'Đã hoàn thành', 'Tạm dừng', 'Hủy bỏ'],
    values: [38, 20, 22, 12, 8],
    colors: ['#8f9bb3', '#34a853', '#3b82f6', '#f59e0b', '#e54848']
  };

  if (typeof Chart !== 'undefined') {
    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: chartData.labels,
        datasets: [{
          data: chartData.values,
          backgroundColor: chartData.colors,
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '66%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.label}: ${context.parsed}%`
            }
          }
        }
      }
    });
  } else {
    drawFallbackDonutChart(canvas, chartData);
  }
}

/* ==========================================================================
   CANVAS FALLBACK ENGINES (Đảm bảo luôn hiển thị đẹp khi offline)
   ========================================================================== */

function drawFallbackBarChart(canvas, data) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = (rect.width || 480) * dpr;
  canvas.height = (rect.height || 320) * dpr;
  ctx.scale(dpr, dpr);

  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  const paddingBottom = 40;
  const paddingLeft = 45;
  const paddingTop = 20;
  const paddingRight = 20;

  const chartHeight = height - paddingBottom - paddingTop;
  const chartWidth = width - paddingLeft - paddingRight;
  const maxVal = 450;

  // Lưới ngang
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#94a3b8';

  for (let val = 0; val <= maxVal; val += 50) {
    const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();
    ctx.fillText(String(val), 10, y + 4);
  }

  // Cột
  const barWidth = 46;
  const totalSlots = data.values.length;
  const slotWidth = chartWidth / totalSlots;

  data.values.forEach((val, idx) => {
    const barHeight = (val / maxVal) * chartHeight;
    const x = paddingLeft + idx * slotWidth + (slotWidth - barWidth) / 2;
    const y = paddingTop + chartHeight - barHeight;

    ctx.fillStyle = '#34a853';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Nhãn X
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.labels[idx], x + barWidth / 2, height - 15);
  });
}

function drawFallbackDonutChart(canvas, chartData) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = (rect.width || 240) * dpr;
  canvas.height = (rect.height || 240) * dpr;
  ctx.scale(dpr, dpr);

  const cx = (canvas.width / dpr) / 2;
  const cy = (canvas.height / dpr) / 2;
  const radius = Math.min(cx, cy) - 10;
  const innerRadius = radius * 0.66;

  const total = chartData.values.reduce((acc, v) => acc + v, 0);
  let startAngle = -Math.PI / 2;

  chartData.values.forEach((val, idx) => {
    const sliceAngle = (val / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.arc(cx, cy, innerRadius, endAngle, startAngle, true);
    ctx.closePath();

    ctx.fillStyle = chartData.colors[idx];
    ctx.fill();

    // Border ngăn cách
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    startAngle = endAngle;
  });
}
