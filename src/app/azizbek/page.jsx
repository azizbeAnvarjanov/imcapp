import GetUserFc from "../../components/GetUserFS";
import GetRoles from "../../components/GetRoles";
import checkUserInDatabase from "../../components/checkUserInDatabase";
export default async function Home() {
  const user = await GetUserFc();
  const role = await GetRoles();
  checkUserInDatabase(user, role);

  return (
    <>
      <h1>Azizbek</h1>
    </>
  );
}
