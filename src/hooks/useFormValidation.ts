import { useState } from 'react';

// data type for formData

export interface FormData {
  name: string;
  email: string;
  employeeId: string;
  joiningDate: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  employeeId?: string;
  joiningDate?: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  employeeId: '',
  joiningDate: '',
};

export const useFormValidation = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':{
        if (value.length < 4 || !/^[A-Za-z\s]+$/.test(value)) {
          return 'Name must be at least 4 characters long and only contain letters and spaces.';
        }
        break;
      }
      case 'email':{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Email must be a valid email address.';
        }
        break;
      }
      case 'employeeId':{
        if (!/^\d{6}$/.test(value)) {
          return 'Employee ID must be exactly 6 digits.';
        }
        break;
      }
      case 'joiningDate':{
        if (!value) {
          return 'Joining Date is required.';
        }
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate > today) {
          return 'Joining Date cannot be in the future.';
        }
        break;
      }
      default:
        break;
    }
    return '';
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      employeeId: true,
      joiningDate: true,
    });

    return isValid;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
  };

  const isFormValid =
    Object.keys(formData).every(key => {
      const value = formData[key as keyof FormData];
      return value && !validateField(key, value);
    });
    
// return state and setter function 
  return {
    formData,
    errors,
    touched,
    handleInputChange,
    handleBlur,
    validateForm,
    resetForm,
    isFormValid,
  };
};
