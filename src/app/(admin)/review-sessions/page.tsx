import { auth } from "@clerk/nextjs/server";

export default async function ViewSessions() {
  const { userId } = await auth();
  return (
    <div>
      <h1>ViewSessions</h1>
    </div>
  );
}
