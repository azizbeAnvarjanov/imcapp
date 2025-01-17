import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
export default withAuth({
  loginPage: "/api/auth/login",
  isReturnToCurrentPage: true,
  postLoginRedirectUrl: "/",
});

export const config = {
  matcher: ["/"],
};
