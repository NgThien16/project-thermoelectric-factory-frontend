
import axiosInstance from '../../api/axiosInstance.js';

const toolService = {

  // =====================================================
  // QUẢN LÝ CÔNG CỤ DỤNG CỤ (TOOLS)
  // =====================================================

  // Lấy danh sách + search + pagination
  getAllTools: (
    name = '',
    type = '',
    code = '',
    page = 0,
    size = 5
  ) => {

    const params = {};

    // Search params
    if (name && name.trim() !== '') {
      params.name = name.trim();
    }

    if (type && type.trim() !== '') {
      params.type = type.trim();
    }

    if (code && code.trim() !== '') {
      params.code = code.trim();
    }

    // Pagination params
    params.page = page;
    params.size = size;

    console.log(
      '[DEBUG_LOG] Fetching tools with params:',
      params
    );

    return axiosInstance.get(
      '/tools',
      { params }
    );
  },

  // Lấy chi tiết tool theo ID
  getToolById: (id) => {
    return axiosInstance.get(`/tools/${id}`);
  },

  // Tạo mới tool
  createTool: (toolData) => {
    return axiosInstance.post(
      '/tools',
      toolData
    );
  },

  // Cập nhật tool
  updateTool: (id, toolData) => {
    return axiosInstance.put(
      `/tools/${id}`,
      toolData
    );
  },

  // Xóa tool
  deleteTool: (id) => {
    return axiosInstance.delete(
      `/tools/${id}`
    );
  },

  // Nhập thêm số lượng tool
  importTool: (code, quantity) => {

    const payload = {
      code,
      quantity
    };

    return axiosInstance.post(
      '/tools/import',
      payload
    );
  },

  // =====================================================
  // QUẢN LÝ MƯỢN / TRẢ CÔNG CỤ
  // =====================================================

  // Lấy danh sách phiếu mượn
  getAllBorrowings: (
    params = {}
  ) => {

    const queryParams = {};

    // Search theo mã tool
    if (
      params.toolId &&
      params.toolId.trim() !== ''
    ) {

      queryParams.toolCode =
        params.toolId.trim();
    }

    // Search theo nhân viên
    if (
      params.user &&
      params.user.trim() !== ''
    ) {

      queryParams.employeeSearch =
        params.user.trim();
    }

    // Search theo trạng thái
    if (
      params.status &&
      params.status.trim() !== ''
    ) {

      queryParams.status =
        params.status;
    }

    // Pagination
    queryParams.page =
      params.page || 0;

    queryParams.size =
      params.size || 5;

    console.log(
      '[DEBUG_LOG] Fetching borrowings with params:',
      queryParams
    );

    return axiosInstance.get(
      '/tool-borrowings',
      {
        params: queryParams
      }
    );
  },

  // Mượn nhiều tool cùng lúc
  borrowToolsBatch: (
    borrowingRequest
  ) => {

    return axiosInstance.post(
      '/tool-borrowings/batch',
      borrowingRequest
    );
  },

  // Mượn 1 tool
  borrowTool: (
    borrowingData
  ) => {

    return axiosInstance.post(
      '/tool-borrowings/borrow',
      borrowingData
    );
  },

  // Trả tool
  returnTool: (id) => {

    return axiosInstance.post(
      `/tool-borrowings/${id}/return`
);
},

// Xác nhận trả nhiều tool
confirmReturns: (ids) => {

  return axiosInstance.post(
      '/tool-borrowings/confirm-returns',
      ids
  );
},

    // Xác nhận mượn
    confirmBorrowing: (id) => {

  return axiosInstance.post(
      `/tool-borrowings/confirm-borrow/${id}`
  );
},

    // Cập nhật phiếu mượn
    updateBorrowing: (
    id,
    borrowingData
) => {

  return axiosInstance.put(
      `/tool-borrowings/${id}`,
      borrowingData
  );
}
};

export default toolService;
