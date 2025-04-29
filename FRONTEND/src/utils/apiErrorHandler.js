import { toast } from 'react-toastify';     //to display errors (since alert is causing redirect issues)
import { useNavigate } from 'react-router-dom';

//we use hooks like useApiErrorHandler, useCheckTokenValid to be able to use toast for error and for navigate

export const useApiErrorHandler = () => {
  const handleApiError = (error) => {
    const status = error?.response?.status;  // Check status first
    const message = error?.response?.data?.message || error.message;  // Use backend message if available

    console.log('🚫 Error:', message);
    if (status === 400) {
      toast.error(`${message || 'Bad Request'}`);
    } else if (status === 404) {
      toast.error(`${message || 'Resource not found.'}`);
    } else if (status === 500) {
      toast.error(`${message || 'Something went wrong. Please try again later.'}`);
    } else {
      toast.error(`An error occurred: ${message || 'Unknown error'}`);
    }
  };
  return { handleApiError };
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiry');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
  localStorage.removeItem('isNewUser');
};

export const useCheckTokenValid = () => {
  const navigate = useNavigate();
  const checkTokenValid = () => {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');
    
    //If there is no token/expiry OR if the token expiry is less than the current time-expired 
    if (!token || !expiry || Date.now() > (expiry)) {
      console.log('🚫 Error: Token missing or expired.');
      clearAuthData();
      toast.error('Session expired. Please log in again.');
      navigate('/login');  return false;
    }
    console.log('Token valid.');
    return true;
  };

  return { checkTokenValid };
};