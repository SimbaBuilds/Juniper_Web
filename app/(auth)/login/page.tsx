import { LoginForm } from '@/app/components/auth/login-form'

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-center text-3xl font-bold text-foreground mb-8">
        Sign in to your account
      </h2>
      <LoginForm />
    </div>
  )
}