import { QueryKeys, restFetcher } from "@/queryClient";
import { Test } from "@/types/test";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Main() {
  const { data } = useQuery<Test>([QueryKeys.TEST], () =>
    restFetcher({ method: "GET", path: "test" }),
  );
  return (
    <div className="min-h-screen flex justify-center items-center">
      <h1 className="text-3xl font-bold text-blue-600">{data}</h1>
    </div>
  );
}
