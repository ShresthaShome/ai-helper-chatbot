import Avatar from "@/components/Avatar";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div
      className="flex py-10 md:py-0 flex-col flex-1 justify-center
    items-center bg-[#6485fe]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col items-center justify-center">
          <div className="rounded-full bg-white p-5">
            <Avatar
              seed="Ullas Boss AI support chatbot"
              className="h-60 w-60  sm:size-40 md:size-52"
            />
          </div>

          <div className="text-center">
            <h1 className="text-4xl">Assistly</h1>
            <h2 className="text-base font-light sm:text-sm sm:mt-1">
              Your Cumtomizable AI Chat Agent
            </h2>
            <h3 className="my-5 font-bold -mb-3">Sign In to get started</h3>
          </div>
        </div>

        <SignIn routing="hash" fallbackRedirectUrl="/" />
      </div>
    </div>
  );
}
