import axiosInstance from '../../api/axiosInstance.js';

const toolService = {
  // --- Quản lý Công cụ (Tools) ---
  getAllTools: (name = '', type = '', code = '') => {
    const params = {};
    if (name) params.name = name;
    if (type) params.type = type;
    if (code) params.code = code;
    
    console.log('[DEBUG_LOG] Fetching tools with params:', params);
    return axiosInstance.get('/tools', { params });
  },

  getToolById: (id) => {
    return axiosInstance.get(`/tools/${id}`);
  },

  createTool: (toolData) => {
    return axiosInstance.post('/tools', toolData);
  },

  updateTool: (id, toolData) => {
    return axiosInstance.put(`/tools/${id}`, toolData);
  },

  deleteTool: (id) => {
    return axiosInstance.delete(`/tools/${id}`);
  },

  importTool: (code, quantity) => {
    return axiosInstance.post('/tools/import', { code, quantity });
  },

  // --- Quản lý Mượn/Trả (Tool Borrowings) ---
  getAllBorrowings: (params = {}) => {
    const queryParams = {};
    if (params.toolId && params.toolId.trim() !== '') queryParams.toolCode = params.toolId.trim();
    if (params.user && params.user.trim() !== '') queryParams.employeeSearch = params.user.trim();
    if (params.status && params.status.trim() !== '') queryParams.status = params.status;
    
    console.log('[DEBUG_LOG] Fetching borrowings with params:', queryParams);
    return axiosInstance.get('/tool-borrowings', { params: queryParams });
  },

  borrowToolsBatch: (borrowingRequest) => {
    return axiosInstance.post('/tool-borrowings/batch', borrowingRequest);
  },

  borrowTool: (borrowingData) => {
    return axiosInstance.post('/tool-borrowings/borrow', borrowingData);
  },

  returnTool: (id) => {
    return axiosInstance.post(`/tool-borrowings/return/${id}`);
  },

  confirmReturns: (ids) => {
    return axiosInstance.post('/tool-borrowings/confirm-returns', ids);
  },

  confirmBorrowing: (id) => {
    return axiosInstance.post(`/tool-borrowings/confirm/${id}`);
  },

  updateBorrowing: (id, borrowingData) => {
    return axiosInstance.put(`/tool-borrowings/${id}`, borrowingData);
  }
};

export default toolService;
