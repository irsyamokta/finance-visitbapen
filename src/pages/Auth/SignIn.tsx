import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Login"
        description="Masuk ke dashboard keuangan untuk mengelola keuanganmu. Akses mudah ke berbagai fitur melalui halaman login yang aman dan cepat."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
