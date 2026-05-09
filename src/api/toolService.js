import axiosInstance from './axiosInstance';

const toolService = {
  // --- Quản lý Công cụ (Tools) ---
  getAllTools: () => {
    return axiosInstance.get('/tools');
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
  getAllBorrowings: () => {
    return axiosInstance.get('/tool-borrowings');
  },

  borrowTool: (borrowingData) => {
    return axiosInstance.post('/tool-borrowings/borrow', borrowingData);
  },

  returnTool: (id) => {
    return axiosInstance.post(`/tool-borrowings/return/${id}`);
  }
};

export default toolService;
