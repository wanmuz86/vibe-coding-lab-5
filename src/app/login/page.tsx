import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="page narrow stack">
      <div>
        <h1>Sign in</h1>
        <p className="muted">
          Use a development account. These passwords are not real credentials.
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
