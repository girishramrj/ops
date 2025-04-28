import axios from 'axios';

const API_URL = 'http://localhost:5000';

// First, define the Address interface
export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

// Then update the Employee interface
export interface Employee {
  id?: number;
  name: string;
  email: string;
  position: string;
  phone: string;
  addresses: Address[];  // Changed from boolean to Address[]
}

const api = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/employees`);
    return response.data;
  },
  
  getById: async (id: number) => {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error('Invalid ID: must be a number');
    }
    const response = await axios.get(`${API_URL}/employees/${id}`);
    return response.data;
  },
  
  add: async (employee: Employee) => {
    // Remove any existing ID to let the server generate one
    const { ...employeeWithoutId } = employee;
    const response = await axios.post(`${API_URL}/employees`, employeeWithoutId);
    return response.data;
  },
  
  update: async (employee: Employee) => {
    if (!employee.id || typeof employee.id !== 'number' || isNaN(employee.id)) {
      throw new Error('Invalid ID: must be a number');
    }
    const response = await axios.put(`${API_URL}/employees/${employee.id}`, employee);
    return response.data;
  },
  
  delete: async (id: number) => {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error('Invalid ID: must be a number');
    }
    await axios.delete(`${API_URL}/employees/${id}`);
  }
};

export default api;