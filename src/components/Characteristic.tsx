"use client";

import { REMOVE_CHARACTERISTIC } from "@/graphql/mutations/mutations";
import { ChatbotCharacteristic } from "@/types/types";
import { useMutation } from "@apollo/client";
import { CircleX } from "lucide-react";
import { toast } from "sonner";

export default function Characteristic({
  characteristic,
}: {
  characteristic: ChatbotCharacteristic;
}) {
  const [removeCharacteristic] = useMutation(REMOVE_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
  });

  const handleRemoveCharacteristic = async () => {
    try {
      await removeCharacteristic({
        variables: { characteristic_id: characteristic.id },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <li className="relative p-10 bg-white border rounded-md">
      {characteristic.content}
      <CircleX
        className="w-6 h-6 text-white fill-red-500
  absolute right-1 top-1 cursor-pointer hover:opacity-50"
        onClick={() => {
          const promise = handleRemoveCharacteristic();
          toast.promise(promise, {
            loading: "Removing characteristic...",
            success: "Characteristic removed",
            error: "Failed to remove characteristic",
          });
        }}
      />
    </li>
  );
}
