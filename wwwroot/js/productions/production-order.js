/**
 * PRODUCTIONS - PRODUCTION ORDER JS
 * Xử lý tương tác form "Thêm Lệnh sản xuất"
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initTableActions();
  initFormButtons();
});

/**
 * Xử lý chuyển đổi các Tab (Chi tiết NVL, Công đoạn, Phụ phẩm, Đính kèm)
 */
function initTabs() {
  const tabs = document.querySelectorAll('.order-tab-link');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

/**
 * Xử lý thêm, xoá dòng trong bảng nguyên vật liệu
 */
function initTableActions() {
  const tableBody = document.getElementById('bomTableBody');
  const btnAddRow = document.getElementById('btnAddRow');
  const btnClearRows = document.getElementById('btnClearRows');
  const totalRowsCount = document.getElementById('totalRowsCount');

  // Hàm cập nhật STT và Tổng số dòng
  function updateRowNumbers() {
    if (!tableBody) return;
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((row, index) => {
      const sttCell = row.querySelector('.col-stt');
      if (sttCell) sttCell.textContent = index + 1;
    });

    if (totalRowsCount) {
      totalRowsCount.textContent = rows.length;
    }
  }

  // Thêm dòng mới
  if (btnAddRow && tableBody) {
    btnAddRow.addEventListener('click', () => {
      const newIndex = tableBody.querySelectorAll('tr').length + 1;
      const newRow = document.createElement('tr');
      newRow.className = 'page-fade-in';
      newRow.innerHTML = `
        <td class="text-center col-stt">${newIndex}</td>
        <td><input type="text" class="form-input" placeholder="Mã NVL..." style="height:26px; font-size:12px;"></td>
        <td><input type="text" class="form-input" placeholder="Tên nguyên vật liệu..." style="height:26px; font-size:12px;"></td>
        <td>Nguyên vật liệu</td>
        <td class="text-center"><input type="checkbox"></td>
        <td>-</td>
        <td>cái</td>
        <td class="text-center"><input type="checkbox"></td>
        <td class="text-right">1,0000</td>
        <td class="text-right">2,000</td>
        <td class="text-center">
          <div class="row-actions-cell">
            <button type="button" class="row-act-btn btn-delete-row" title="Xóa dòng">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      `;

      tableBody.appendChild(newRow);
      updateRowNumbers();
    });
  }

  // Xoá 1 dòng
  if (tableBody) {
    tableBody.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.btn-delete-row');
      if (deleteBtn) {
        const row = deleteBtn.closest('tr');
        if (row) {
          row.style.opacity = '0';
          row.style.transform = 'translateX(20px)';
          row.style.transition = 'all 0.2s ease';
          setTimeout(() => {
            row.remove();
            updateRowNumbers();
          }, 200);
        }
      }
    });
  }

  // Xoá hết dòng
  if (btnClearRows && tableBody) {
    btnClearRows.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn xóa hết các dòng nguyên vật liệu?')) {
        tableBody.innerHTML = '';
        updateRowNumbers();
      }
    });
  }
}

/**
 * Xử lý các nút Lưu / Hủy
 */
function initFormButtons() {
  const btnCancel = document.getElementById('btnCancelOrder');
  const btnClose = document.getElementById('btnCloseOrder');
  const btnSubmit = document.getElementById('btnSubmitOrder');

  function goBack() {
    // Trở về trang Tổng quan
    window.location.href = 'Index.html';
  }

  if (btnCancel) btnCancel.addEventListener('click', goBack);
  if (btnClose) btnClose.addEventListener('click', goBack);

  if (btnSubmit) {
    btnSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Đã lưu Lệnh sản xuất LSX0096 thành công!');
      goBack();
    });
  }
}
