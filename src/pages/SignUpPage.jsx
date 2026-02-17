import { Navigate } from 'react-router-dom'

const SignUpPage = () => {
  return <Navigate to="/auth?tab=signup" replace />
}

export default SignUpPage
