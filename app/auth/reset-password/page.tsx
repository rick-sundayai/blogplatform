import { Metadata } from 'next';
import AuthForm from '../../../components/auth/AuthForm';

export const metadata: Metadata = {
  title: 'Reset Password | Tech Trails & Tales',
  description: 'Set a new password for your account',
};

export default function ResetPasswordPage() {
  // No redirect here - users need to access this page even when logged in
  // because they arrive here from the password reset email link
  
  return <AuthForm type="resetPassword" />;
}
