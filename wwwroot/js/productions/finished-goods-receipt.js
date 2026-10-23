/**
 * PRODUCTIONS - FINISHED GOODS RECEIPT JS
 * Xử lý tương tác Nhập thành phẩm (Thêm/xóa dòng, tính tiền, tìm kiếm, lưu phiếu)
 */

document.addEventListener('DOMContentLoaded', () => {
  initFGRTable();
  initFGRFormActions();
  initFGRListSearch();
});

/**
 * Xử lý thêm, xóa dòng và tính toán số lượng nhập
 */
function initFGRTable() {
  const tableBody = document.getElementById('fgrTableBody');
  const btnAdd = document.getElementById('btnAddFGRRow');
  const btnClear = document.getElementById('btnClearFGRRows');
  const totalCount = document.getElementById('totalFGRCount');

  function updateTotals() {
    if (!tableBody) return;
    const rows = tableBody.querySelectorAll('tr');
    if (totalCount) totalCount.textContent = rows.length;
  }

  if (btnAdd && tableBody) {
    btnAdd.addEventListener('click', () => {
      const row = document.createElement('tr');
      row.className = 'page-fade-in';
      const idx = tableBody.querySelectorAll('tr').length + 1;
      row.innerHTML = `
        <td class="text-center">${idx}</td>
        <td><input type="text" class="form-input" value="SIRO" style="height:26px; font-size:12px; width:90px;"></td>
        <td><input type="text" class="form-input" value="Siro ho, bổ phế 100ml" style="height:26px; font-size:12px;"></td>
        <td>Chai</td>
        <td>Kho Thành phẩm</td>
        <td><input type="text" class="form-input" value="LOT20260122" style="height:26px; font-size:12px; width:100px;"></td>
        <td class="text-right">22/01/2026</td>
        <td class="text-right">22/01/2028</td>
        <td class="text-right">2.000</td>
        <td class="text-right"><input type="text" class="form-input text-right" value="1.965" style="height:26px; font-size:12px; font-weight:600; color:#2ea664;"></td>
        <td class="text-right"><input type="text" class="form-input text-right" value="35.000" style="height:26px; font-size:12px;"></td>
        <td class="text-right"><strong>68.775.000</strong></td>
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
      updateTotals();
    });
  }

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
            updateTotals();
          }, 200);
        }
      }
    });
  }

  if (btnClear && tableBody) {
    btnClear.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn xóa tất cả thành phẩm trong phiếu nhập kho?')) {
        tableBody.innerHTML = '';
        updateTotals();
      }
    });
  }
}

/**
 * Xử lý lưu, hủy form nhập thành phẩm
 */
function initFGRFormActions() {
  const btnCancel = document.getElementById('btnCancelFGR');
  const btnClose = document.getElementById('btnCloseFGR');
  const btnSave = document.getElementById('btnSaveFGR');
  const btnSaveAndNew = document.getElementById('btnSaveAndNewFGR');

  function returnToList() {
    window.location.href = 'FinishedGoodsReceiptList.html';
  }

  if (btnCancel) btnCancel.addEventListener('click', returnToList);
  if (btnClose) btnClose.addEventListener('click', returnToList);

  if (btnSave) {
    btnSave.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Đã lập Phiếu nhập kho thành phẩm thành công!');
      returnToList();
    });
  }

  if (btnSaveAndNew) {
    btnSaveAndNew.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Đã lưu thành công! Đang mở phiếu nhập thành phẩm mới...');
      location.reload();
    });
  }
}

/**
 * Tìm kiếm trên trang danh sách nhập thành phẩm
 */
function initFGRListSearch() {
  const searchInput = document.getElementById('fgrSearchInput');
  const tableRows = document.querySelectorAll('#fgrListBody tr');

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
