"use client";

import Avatar from "@/components/Avatar";
import Characteristic from "@/components/Characteristic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/graphql/apolloClient";
import {
  ADD_CHARACTERISTIC,
  DELETE_CHATBOT,
  UPDATE_CHATBOT,
} from "@/graphql/mutations/mutations";
import { GET_CHATBOT_BY_ID } from "@/graphql/queries/queries";
import { GetChatbotByIdResponse, GetChatbotByIdVariables } from "@/types/types";
import { useMutation, useQuery } from "@apollo/client";
import { Copy } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FormEvent, use, useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../loading";

export default function EditChatbot({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [url, setUrl] = useState<string>("");
  const [chatbotName, setChatbotName] = useState<string>("");
  const [newCharacteristic, setNewCharacteristic] = useState<string>("");

  const [deleteChatbot] = useMutation(DELETE_CHATBOT, {
    refetchQueries: ["GetChatbotById"],
    awaitRefetchQueries: true,
  });

  const [addCharacteristic] = useMutation(ADD_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
  });

  const [updateChatbot] = useMutation(UPDATE_CHATBOT, {
    refetchQueries: ["GetChatbotById"],
  });

  const { data, loading, error } = useQuery<
    GetChatbotByIdResponse,
    GetChatbotByIdVariables
  >(GET_CHATBOT_BY_ID, {
    variables: { id: Number(id) },
  });

  useEffect(() => {
    if (data) setChatbotName(data?.chatbots?.name);
  }, [data]);

  useEffect(() => {
    const url = `${BASE_URL}/chatbot/${id}`;
    setUrl(url);
  }, [id]);

  const handleAddCharacteristic = async (content: string) => {
    const promise = addCharacteristic({
      variables: {
        chatbotId: Number(id),
        content,
      },
    });

    toast.promise(promise, {
      loading: "Adding characteristic...",
      success: "Characteristic successfully added",
      error: "Failed to add characteristic",
    });
  };

  const handleUpdateChatbot = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const promise = updateChatbot({
      variables: {
        id: Number(id),
        name: chatbotName,
      },
    });

    toast.promise(promise, {
      loading: "Updating chatbot name...",
      success: "Chatbot name successfully updated",
      error: "Failed to update chatbot name",
    });
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this chatbot?"
    );
    if (!isConfirmed) return;

    const promise = deleteChatbot({ variables: { id } });
    toast.promise(promise, {
      loading: "Deleting chatbot...",
      success: "Chatbot successfully deleted",
      error: "Failed to delete chatbot",
    });
  };

  if (loading) return <Loading />;

  if (error) return <p>Error: {error?.message}</p>;

  if (!data?.chatbots) return redirect("/view-chatbots");

  return (
    <div className="px-0 md:p-10">
      <div
        className="md:sticky md:top-0 z-50 
      sm:max-w-sm ml-auto space-y-2 md:border
      p-5 rounded-b-lg md:rounded-lg
      bg-[#2991ee]"
      >
        <h2 className="text-white text-sm font-bold">Link to Chat</h2>
        <p className="text-sm italic text-white">
          Share this link with your customers to start conversations with your
          chatbot
        </p>
        <div className="flex items-center space-x-2">
          <Link href={url} className="w-full cursor-pointer hover:opacity-50">
            <Input
              value={url}
              readOnly
              className="cursor-pointer text-black bg-white"
            />
          </Link>
          <Button
            size="sm"
            className="px-3"
            onClick={() => {
              navigator.clipboard.writeText(url);
              toast.success("Copied to clipboard");
            }}
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <section className="relative mt-5 bg-white p-5 md:p-10 rounded-lg">
        <Button
          variant="destructive"
          className="absolute top-2 right-2 h-8 w-2"
          onClick={() => handleDelete()}
        >
          X
        </Button>

        <div className="flex space-x-4">
          <Avatar seed={chatbotName} />
          <form
            onSubmit={handleUpdateChatbot}
            className="flex flex-1 space-x-2 items-center"
          >
            <Input
              value={chatbotName}
              onChange={(e) => setChatbotName(e.target.value)}
              placeholder={chatbotName}
              className="w-full border-none 
              bg-transparent text-xl font-bold"
              required
            />
            <Button type="submit" disabled={!chatbotName}>
              Update
            </Button>
          </form>
        </div>
        <h2 className="text-xl font-bold mt-10">Here's what the AI knows...</h2>
        <p>
          Your chatbot is equipped with following info to assist you in your
          conversations with your customers and users
        </p>
        <div className="bg-gray-200 p-5 rounded-md mt-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCharacteristic(newCharacteristic);
              setNewCharacteristic("");
            }}
            className="flex space-x-2 mb-5"
          >
            <Input
              type="text"
              placeholder="Example: If customer asks for prices, provide pricing page: www.example.com.pricing"
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
              className="bg-white-transparent"
            />
            <Button type="submit" disabled={!newCharacteristic}>
              Add
            </Button>
          </form>
          <ul className="flex flex-wrap-reverse gap-5">
            {data?.chatbots?.chatbot_characteristics?.map((characteristic) => {
              return (
                <Characteristic
                  key={characteristic.id}
                  characteristic={characteristic}
                />
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
