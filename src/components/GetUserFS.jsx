import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const GetUserFS = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return user;
};

export default GetUserFS;
