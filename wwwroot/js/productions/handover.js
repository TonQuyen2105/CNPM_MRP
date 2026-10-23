/**
 * PRODUCTIONS - HANDOVER JS
 * Xử lý tương tác Phiếu Bàn giao bán thành phẩm & Danh sách Bàn giao
 */

document.addEventListener('DOMContentLoaded', () => {
  initHandoverDetailTable();
  initHandoverFormActions();
  initHandoverListSearch();
});

/**
 * Xử lý thêm, xóa dòng và tính toán chênh lệch trong Bảng Chi tiết bàn giao
 */
function initHandoverDetailTable() {
  const tableBody = document.getElementById('handoverTableBody');
  const btnAdd = document.getElementById('btnAddHandoverRow');
  const btnClear = document.getElementById('btnClearHandoverRows');
  const totalCount = document.getElementById('totalHandoverCount');

  function updateCount() {
    if (!tableBody) return;
    const rows = tableBody.querySelectorAll('tr');
    if (totalCount) totalCount.textContent = rows.length;
  }

  // Thêm dòng mới
  if (btnAdd && tableBody) {
    btnAdd.addEventListener('click', () => {
      const row = document.createElement('tr');
      row.className = 'page-fade-in';
      const rowIdx = tableBody.querySelectorAll('tr').length + 1;
      row.innerHTML = `
        <td class="text-center">${rowIdx}</td>
        <td><input type="text" class="form-input" value="SIRO" style="height:26px; font-size:12px; width:90px;"></td>
        <td><input type="text" class="form-input" value="Siro ho, bổ phế" style="height:26px; font-size:12px;"></td>
        <td>ml</td>
        <td><a href="#" class="ref-link">DH00082</a></td>
        <td><input type="text" class="form-input" value="RNWYS1W5..." style="height:26px; font-size:12px; width:110px;"></td>
        <td class="text-right"><input type="text" class="form-input text-right val-max" value="1.980,000" style="height:26px; font-size:12px;"></td>
        <td class="text-right"><input type="text" class="form-input text-right val-send" value="1.980,000" style="height:26px; font-size:12px; font-weight:600;"></td>
        <td class="text-right"><input type="text" class="form-input text-right val-recv" value="1.780,000" style="height:26px; font-size:12px; font-weight:600;"></td>
        <td class="text-right"><strong class="val-diff" style="color:#e54848;">200,000</strong></td>
        <td><input type="text" class="form-input" value="không đạt chất lượng" style="height:26px; font-size:12px;"></td>
        <td class="text-center"><input type="checkbox" style="accent-color:var(--color-primary); cursor:pointer;"></td>
        <td class="text-center">
          <button type="button" class="row-act-btn btn-delete-row" title="Xóa dòng" style="border:none; background:transparent;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
      updateCount();
    });
  }

  // Xóa từng dòng
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
            updateCount();
          }, 200);
        }
      }
    });

    // Tự động tính chênh lệch khi sửa SL bàn giao hoặc SL nhận
    tableBody.addEventListener('input', (e) => {
      const row = e.target.closest('tr');
      if (!row) return;

      const inputSend = row.querySelector('.val-send');
      const inputRecv = row.querySelector('.val-recv');
      const diffDisplay = row.querySelector('.val-diff');

      if (inputSend && inputRecv && diffDisplay) {
        const send = parseFloat(inputSend.value.replace(/\./g, '').replace(',', '.')) || 0;
        const recv = parseFloat(inputRecv.value.replace(/\./g, '').replace(',', '.')) || 0;
        const diff = send - recv;
        diffDisplay.textContent = diff.toLocaleString('vi-VN', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
        diffDisplay.style.color = diff !== 0 ? '#e54848' : '#2ea664';
      }
    });
  }

  // Xóa tất cả dòng
  if (btnClear && tableBody) {
    btnClear.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn xóa hết tất cả dòng chi tiết bàn giao?')) {
        tableBody.innerHTML = '';
        updateCount();
      }
    });
  }
}

/**
 * Xử lý các nút điều hướng và lưu trên form
 */
function initHandoverFormActions() {
  const btnCancel = document.getElementById('btnCancelHandover');
  const btnClose = document.getElementById('btnCloseHandover');
  const btnSave = document.getElementById('btnSaveHandover');
  const btnSaveAndNew = document.getElementById('btnSaveAndNewHandover');

  function returnToList() {
    window.location.href = 'HandoverList.html';
  }

  if (btnCancel) btnCancel.addEventListener('click', returnToList);
  if (btnClose) btnClose.addEventListener('click', returnToList);

  if (btnSave) {
    btnSave.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Đã lưu Phiếu bàn giao bán thành phẩm BG00006 thành công!');
      returnToList();
    });
  }

  if (btnSaveAndNew) {
    btnSaveAndNew.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Đã lưu thành công! Đang mở phiếu bàn giao mới...');
      location.reload();
    });
  }
}

/**
 * Tìm kiếm trên trang danh sách phiếu bàn giao
 */
function initHandoverListSearch() {
  const searchInput = document.getElementById('handoverSearchInput');
  const tableRows = document.querySelectorAll('#handoverListBody tr');

  if (searchInput && tableRows.length) {
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase().trim();
      tableRows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(keyword) ? '' : 'none';
      });
    });
  }
}
