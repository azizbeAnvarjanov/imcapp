import MainPage from "../components/MainPage";
import GetUserFc from "../components/GetUserFS";
import GetRoles from "../components/GetRoles";
export default async function Home() {
  const user = await GetUserFc();
  const role = await GetRoles();

  return (
    <>
      <MainPage user={user} role={role} />
    </>
  );
}
