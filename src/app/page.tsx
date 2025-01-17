import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import MainPage from '../components/MainPage'
export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <>
      <MainPage user={user} />
    </>
  );
}
