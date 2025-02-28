import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const user = useSelector(state => state.client.user);
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Hem user state'ini hem de token'ı kontrol et
  if ((!user || Object.keys(user).length === 0) && !token) {
    // Kullanıcı giriş yapmamışsa, login sayfasına yönlendir
    // state ile birlikte, böylece login sonrası geri dönebiliriz
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 