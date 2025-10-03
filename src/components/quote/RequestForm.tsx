"use client";

import { QuoteRequest, QuoteRequestSchema } from "@/domain/quote";
import { User } from "@/domain/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {
  onSubmit: SubmitHandler<QuoteRequest>;
  user?: User;
};

export default function RequestForm({ onSubmit, user }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteRequest>({
    resolver: zodResolver(QuoteRequestSchema),
    defaultValues: {
      monthlyConsumptionKwh: 0,
      systemSizeKw: 0,
      downPayment: 0,
    },
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(async (data) => await onSubmit(data))}
        className="w-full my-10 flex flex-col gap-8"
      >
        <div>
          <label
            htmlFor="fullName"
            className="ml-3 mb-1 text-xs uppercase font-bold tracking-wider text-gray-500 block"
          >
            Full Name
          </label>
          <input
            id="fullName"
            value={user?.name}
            className="w-full border-2 rounded-lg px-3 py-2 border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed"
            readOnly={Boolean(user?.name)}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="ml-3 mb-1 text-xs uppercase font-bold tracking-wider text-gray-500 block"
          >
            Email
          </label>
          <input
            id="email"
            value={user?.email}
            className="w-full border-2 rounded-lg px-3 py-2 border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed"
            readOnly={Boolean(user?.email)}
          />
        </div>
        <div>
          <label
            htmlFor="address"
            className="ml-3 mb-1 text-xs uppercase font-bold tracking-wider text-gray-500 block"
          >
            Address
          </label>
          <input
            id="address"
            {...register("address")}
            className={`w-full border-2 rounded-lg px-3 py-2 ${
              errors.address ? "border-red-700" : "border-gray-300"
            }`}
          />
          {errors.address && (
            <p className="px-3 text-sm mt-1 text-red-700">
              {errors.address.message}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-4 items-end">
            <div className="flex-1">
              <label
                htmlFor="monthlyConsumptionKwh"
                className="ml-3 mb-1 text-xs uppercase font-bold tracking-wider text-gray-500 block"
              >
                Monthly Consumption (kWh)
              </label>
              <input
                id="monthlyConsumptionKwh"
                type="number"
                {...register("monthlyConsumptionKwh", { valueAsNumber: true })}
                className={`w-full border-2 rounded-lg px-3 py-2 ${
                  errors.monthlyConsumptionKwh
                    ? "border-red-700"
                    : "border-gray-300"
                }`}
              />
            </div>

            <div className="flex-1">
              <label
                htmlFor="systemSizeKw"
                className="ml-3 mb-1 text-xs uppercase font-bold tracking-wider text-gray-500 block"
              >
                System Size (kW)
              </label>
              <input
                id="systemSizeKw"
                type="number"
                {...register("systemSizeKw", { valueAsNumber: true })}
                className={`w-full border-2 rounded-lg px-3 py-2 ${
                  errors.systemSizeKw ? "border-red-700" : "border-gray-300"
                }`}
              />
            </div>

            <div className="flex-1">
              <label
                htmlFor="downPayment"
                className="ml-3 mb-1 text-xs uppercase font-bold tracking-wider text-gray-500 block"
              >
                Down Payment (Euro)
              </label>
              <input
                id="downPayment"
                type="number"
                {...register("downPayment", { valueAsNumber: true })}
                className={`w-full border-2 rounded-lg px-3 py-2 ${
                  errors.downPayment ? "border-red-700" : "border-gray-300"
                }`}
              />
            </div>
          </div>
          {(errors.monthlyConsumptionKwh ||
            errors.systemSizeKw ||
            errors.downPayment) && (
            <p className="mt-2 ml-3 text-sm text-red-700 flex flex-col gap-1">
              {errors.monthlyConsumptionKwh && (
                <span className="block">
                  Monthly Consumption: {errors.monthlyConsumptionKwh.message}
                </span>
              )}
              {errors.systemSizeKw && (
                <span className="block">
                  System Size: {errors.systemSizeKw.message}
                </span>
              )}
              {errors.downPayment && (
                <span className="block">
                  Down Payment: {errors.downPayment.message}
                </span>
              )}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-[#0EAD69] text-white rounded-lg mt-8 px-4 py-2 hover:bg-[#0C975B] transition"
        >
          Get pre-qualification
        </button>
      </form>
    </>
  );
}
