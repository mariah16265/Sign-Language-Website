import jwt_decode from 'jwt-decode';

export const isTokenValid = () => {
  const token = localStorage.getItem('token');

  if (!token) return false;
  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000; // current time in seconds

    return decoded.exp > currentTime; // true if token still valid
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
  localStorage.removeItem('tokenExpiry');
  localStorage.removeItem('isNewUser');
};
