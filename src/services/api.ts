import axios, { AxiosError } from 'axios';

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
    // Generate a new unique ID for the employee
    const allEmployees = await api.getAll();
    const maxId = Math.max(0, ...allEmployees.map((emp: Employee) => emp.id || 0));
    const newId = maxId + 1;
    
    // Create a new employee object with the generated ID
    const employeeWithId = {
      ...employee,
      id: newId,
      // Ensure addresses have proper IDs
      addresses: employee.addresses.map((address, index) => ({
        ...address,
        id: address.id || index + 1
      }))
    };
    
    console.log('Sending to server:', JSON.stringify(employeeWithId, null, 2));
    
    try {
      const response = await axios.post(`${API_URL}/employees`, employeeWithId);
      return response.data;
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        console.error('Server response error:', (error as AxiosError).response?.data || error.message);
      } else {
        console.error('Server response error:', error);
      }
      throw error;
    }
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
