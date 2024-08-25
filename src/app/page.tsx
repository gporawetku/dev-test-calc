"use client";

import Button from "@/components/button";
import Card from "@/components/card";
import IconField from "@/components/icon-field";
import InputField from "@/components/input-field";
import InputIcon from "@/components/input-icon";
import InputNumber from "@/components/input-number";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Tooltip } from "react-tooltip";
import * as z from "zod";

// Loan Amortization Formula https://www.calculator.net/amortization-calculator.html
const calcMonthlyInstallment = (
  price: number,
  yearInterestRate: number,
  year: number,
) => {
  // เงินต้น
  const P = price;
  // อัตราดอกเบี้ยต่อเดือน = อัตราดอกเบี้ยต่อปี / 12
  const r = Number(yearInterestRate / 100) / 12;
  // จำนวนงวด = ระยะเวลากู้ * 12
  const n = year * 12;
  // ค่างวดรายเดือน = ((จำนวนงวด * (( 1 + อัตราดอกเบี้ยต่อเดือน) ^ จำนวนงวด)) / (((1 + อัตราดอกเบี้ยต่อเดือน) ^ จำนวนงวด) - 1))
  const M = P * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  return M;
};
// รายได้ขั้นต่ำต่อเดือน = ( ราคาอสังหาฯ / 650000 ) * 10000
const calcMinMonthlyIncome = (price: number) => {
  return (price / 650000) * 10000;
};

const schema = z.object({
  price: z.string().min(1, { message: "กรุณากรอกราคาอสังหาฯ" }),
  yearInterestRate: z
    .string()
    .min(1, { message: "กรุณากรอกอัตราดอกเบี้ย" })
    .refine((value) => parseFloat(value) >= 2, {
      message: "อัตราดอกเบี้ยต้องอย่างน้อย 2%",
    }),
  year: z
    .string()
    .min(1, { message: "กรุณากรอกระยะเวลากู้" })
    .refine((value) => parseFloat(value) >= 3, {
      message: "ระยะเวลากู้ไม่น้อยกว่า 3 ปี",
    }),
});

export default function Home() {
  const [creditLimit, setCreditLimit] = useState<number>(0);
  const [minMonthlyIncome, setMinMonthlyIncome] = useState<number>(0);
  const [monthlyInstallment, setMonthlyInstallment] = useState<number>(0);

  const [isDisabled, setIsDisabled] = useState(true);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      price: "",
      yearInterestRate: "",
      year: "",
    },
  });

  const values = watch(["price", "yearInterestRate", "year"]);
  useEffect(() => {
    // ตรวจสอบ input ค่าว่าง จาก react hook form
    const hasValue = values.some(
      (value) => value !== undefined && value !== "",
    );
    // ตรวจสอบ validate จาก react hook form
    const hasErrors = Object.keys(errors).length > 0;
    setIsDisabled(!hasValue || hasErrors);
  }, [values, errors]);

  const onSubmit = (data: any) => {
    const parsedData = {
      price: parseFloat(data.price),
      yearInterestRate: parseFloat(data.yearInterestRate),
      year: parseFloat(data.year),
    };

    const { price, yearInterestRate, year } = parsedData;
    const minMonthlyIncome = calcMinMonthlyIncome(price);
    const monthlyInstallment = calcMonthlyInstallment(
      price,
      yearInterestRate,
      year,
    );

    setCreditLimit(price);
    setMinMonthlyIncome(minMonthlyIncome);
    setMonthlyInstallment(monthlyInstallment);
  };

  const handleRefresh = () => {
    reset();

    setCreditLimit(0);
    setMinMonthlyIncome(0);
    setMonthlyInstallment(0);
  };

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <Card className="relative flex max-w-[343px] flex-col gap-6 border-2 border-[#E82583] bg-[#FDE9F3] lg:max-w-[739px]">
          <div className="-pt-2 absolute -top-0 end-6 z-0 size-16 bg-[#E8248D] lg:size-24"></div>
          {/* Title */}
          <div className="flex flex-col gap-2 lg:gap-3">
            <div className="text-base font-semibold leading-7 lg:text-xl lg:leading-8">
              คำนวณสินเชื่ออสังหาฯ เบื้องต้น
            </div>
            {/* Description */}
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium leading-6 text-[#E82583] underline">
                ข้อเสนอสุดพิเศษสำหรับคุณ
              </span>
              <ChevronRightIcon className="size-5 text-[#E82583]" />
            </div>
          </div>
          {/* Info */}
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Input Field */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <Controller
                name="price"
                control={control}
                render={({
                  field: { ref, name, onChange, ...rest },
                  fieldState,
                }) => (
                  <InputField name={name} label="ราคาอสังหาฯ" errors={errors}>
                    <IconField invalid={!!fieldState.error}>
                      <InputIcon invalid={!!fieldState.error}>บาท</InputIcon>
                      <InputNumber
                        id={name}
                        name={name}
                        onValueChange={(values) => onChange(values.value)}
                        thousandSeparator=","
                        maxLength={14}
                        decimalScale={0}
                        placeholder="0"
                        isAllowed={(values) => {
                          const { floatValue, formattedValue } = values;
                          // เช็คว่า floatValue ไม่ใช่ undefined หรือมากกว่า 0
                          const isValidValue =
                            floatValue === undefined || floatValue > 0;
                          // เช็คว่าไม่มี 0 ตัวแรกในฟิลด์
                          const noLeadingZero =
                            formattedValue === "" ||
                            !/^0\d/.test(formattedValue);

                          return isValidValue && noLeadingZero;
                        }}
                        {...rest}
                      />
                    </IconField>
                  </InputField>
                )}
              />
              <div className="flex gap-4">
                <Controller
                  name="yearInterestRate"
                  control={control}
                  rules={{ required: true }}
                  render={({
                    field: { name, onChange, ref, ...rest },
                    fieldState,
                  }) => (
                    <InputField
                      name={name}
                      label="อัตราดอกเบี้ย"
                      errors={errors}
                    >
                      <IconField invalid={!!fieldState.error}>
                        <InputIcon invalid={!!fieldState.error}>%</InputIcon>
                        <InputNumber
                          id={name}
                          name={name}
                          onValueChange={(values) => onChange(values.value)}
                          decimalScale={2}
                          placeholder="0"
                          isAllowed={(values) => {
                            const { floatValue, formattedValue } = values;
                            // เช็คว่า floatValue ไม่ใช่ undefined หรือมากกว่า 0 และน้อยกว่าหรือเท่ากับ 99.99
                            const isValidValue =
                              floatValue === undefined ||
                              (floatValue > 0 && floatValue <= 99.99);
                            // เช็คว่าไม่มี 0 ตัวแรกในฟิลด์
                            const noLeadingZero =
                              formattedValue === "" ||
                              !/^0\d/.test(formattedValue);

                            return isValidValue && noLeadingZero;
                          }}
                          {...rest}
                        />
                      </IconField>
                    </InputField>
                  )}
                />
                <Controller
                  name="year"
                  control={control}
                  rules={{ required: true }}
                  render={({
                    field: { name, onChange, ref, ...rest },
                    fieldState,
                  }) => (
                    <InputField name={name} label="ระยะเวลากู้" errors={errors}>
                      <IconField invalid={!!fieldState.error}>
                        <InputIcon invalid={!!fieldState.error}>ปี</InputIcon>
                        <InputNumber
                          id={name}
                          name={name}
                          onValueChange={(values) => onChange(values.value)}
                          placeholder="0"
                          isAllowed={(values) => {
                            const { floatValue, formattedValue } = values;
                            // เช็คว่า floatValue ไม่ใช่ undefined หรือมากกว่า 0 และน้อยกว่าหรือเท่ากับ 99
                            const isValidValue =
                              floatValue === undefined ||
                              (floatValue > 0 && floatValue <= 99);
                            // เช็คว่าไม่มี 0 ตัวแรกในฟิลด์
                            const noLeadingZero =
                              formattedValue === "" ||
                              !/^0\d/.test(formattedValue);

                            return isValidValue && noLeadingZero;
                          }}
                          {...rest}
                        />
                      </IconField>
                    </InputField>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="transparent"
                  className="text-[#E82583]"
                  onClick={handleRefresh}
                  type="button"
                >
                  <span>
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="path-1-outside-1_287_321"
                        maskUnits="userSpaceOnUse"
                        x="1.52593"
                        y="1.33923"
                        width="17.1464"
                        height="17.1464"
                        fill="black"
                      >
                        <rect
                          fill="white"
                          x="1.52593"
                          y="1.33923"
                          width="17.1464"
                          height="17.1464"
                        />
                        <path d="M8.90959 4.99487C6.14537 5.73554 4.50496 8.57683 5.24563 11.341C5.98629 14.1052 8.82758 15.7457 11.5918 15.005C12.9741 14.6346 14.0747 13.7398 14.7381 12.5907C14.8682 12.3654 15.1563 12.2882 15.3816 12.4183C15.6069 12.5484 15.6841 12.8365 15.554 13.0618C14.7708 14.4184 13.4689 15.4774 11.8356 15.915C8.56884 16.7904 5.21096 14.8517 4.33561 11.5849C3.46028 8.31808 5.39895 4.96019 8.66576 4.08486C10.299 3.64722 11.956 3.91338 13.3126 4.69663M13.3126 4.69663C13.6429 4.88732 14.1684 5.22068 14.6037 5.50114C14.823 5.64245 15.0222 5.77214 15.1666 5.8665C15.2388 5.91368 15.2973 5.95206 15.3379 5.97866L15.4008 6.02008L14.8826 6.80684L14.8207 6.76616C14.7807 6.73988 14.7227 6.70189 14.6512 6.65511C14.508 6.56155 14.3106 6.43304 14.0934 6.29312C13.6558 6.01115 13.1489 5.69001 12.8415 5.51253C11.6925 4.8491 10.2918 4.6245 8.90959 4.99487M15.5351 6.67282C15.3919 6.89003 15.0997 6.95003 14.8826 6.80684L15.4008 6.02008C15.618 6.16326 15.6783 6.45563 15.5351 6.67282Z" />
                      </mask>
                      <path
                        d="M8.90959 4.99487C6.14537 5.73554 4.50496 8.57683 5.24563 11.341C5.98629 14.1052 8.82758 15.7457 11.5918 15.005C12.9741 14.6346 14.0747 13.7398 14.7381 12.5907C14.8682 12.3654 15.1563 12.2882 15.3816 12.4183C15.6069 12.5484 15.6841 12.8365 15.554 13.0618C14.7708 14.4184 13.4689 15.4774 11.8356 15.915C8.56884 16.7904 5.21096 14.8517 4.33561 11.5849C3.46028 8.31808 5.39895 4.96019 8.66576 4.08486C10.299 3.64722 11.956 3.91338 13.3126 4.69663M13.3126 4.69663C13.6429 4.88732 14.1684 5.22068 14.6037 5.50114C14.823 5.64245 15.0222 5.77214 15.1666 5.8665C15.2388 5.91368 15.2973 5.95206 15.3379 5.97866L15.4008 6.02008L14.8826 6.80684L14.8207 6.76616C14.7807 6.73988 14.7227 6.70189 14.6512 6.65511C14.508 6.56155 14.3106 6.43304 14.0934 6.29312C13.6558 6.01115 13.1489 5.69001 12.8415 5.51253C11.6925 4.8491 10.2918 4.6245 8.90959 4.99487M15.5351 6.67282C15.3919 6.89003 15.0997 6.95003 14.8826 6.80684L15.4008 6.02008C15.618 6.16326 15.6783 6.45563 15.5351 6.67282Z"
                        fill="#E82583"
                      />
                      <path
                        d="M15.192 5.88256L14.6738 6.66932L15.0913 6.94436L15.6096 6.1576L15.192 5.88256ZM14.7381 12.5907L14.3051 12.3407L14.3051 12.3408L14.7381 12.5907ZM13.3126 4.69663L13.0626 5.12964L13.0626 5.12965L13.3126 4.69663ZM14.6037 5.50114L14.3329 5.92146L14.3329 5.92147L14.6037 5.50114ZM15.1666 5.8665L14.893 6.28501L14.8931 6.28505L15.1666 5.8665ZM15.3379 5.97866L15.6128 5.56102L15.6121 5.56059L15.3379 5.97866ZM15.4008 6.02008L15.6759 5.6026L15.6757 5.60244L15.4008 6.02008ZM14.8826 6.80684L15.1578 6.3894L15.1572 6.38903L14.8826 6.80684ZM14.8207 6.76616L15.0953 6.34835L15.0952 6.34824L14.8207 6.76616ZM14.6512 6.65511L14.9249 6.23668L14.9247 6.23656L14.6512 6.65511ZM14.0934 6.29312L14.3642 5.87281L14.3642 5.8728L14.0934 6.29312ZM12.8415 5.51253L12.5915 5.94554L12.5915 5.94554L12.8415 5.51253ZM15.5351 6.67282L15.1177 6.39763L15.1176 6.39764L15.5351 6.67282ZM8.78018 4.51191C5.74923 5.32405 3.95052 8.4395 4.76266 11.4705L5.72859 11.2116C5.05939 8.71415 6.54152 6.14703 9.039 5.47783L8.78018 4.51191ZM4.76266 11.4705C5.5748 14.5014 8.69026 16.3001 11.7212 15.488L11.4624 14.5221C8.96491 15.1913 6.39778 13.7091 5.72859 11.2116L4.76266 11.4705ZM11.7212 15.488C13.2367 15.0819 14.4441 14.1 15.1711 12.8407L14.3051 12.3408C13.7053 13.3796 12.7114 14.1874 11.4624 14.5221L11.7212 15.488ZM15.1711 12.8407C15.1631 12.8546 15.1454 12.8593 15.1316 12.8513L15.6316 11.9853C15.1671 11.7172 14.5732 11.8763 14.3051 12.3407L15.1711 12.8407ZM15.1316 12.8513C15.1178 12.8433 15.113 12.8257 15.121 12.8118L15.987 13.3118C16.2552 12.8474 16.0961 12.2535 15.6316 11.9853L15.1316 12.8513ZM15.121 12.8118C14.4013 14.0583 13.2063 15.0301 11.7062 15.4321L11.9651 16.398C13.7316 15.9246 15.1402 14.7786 15.987 13.3118L15.121 12.8118ZM11.7062 15.4321C8.70616 16.2359 5.62245 14.4556 4.81858 11.4555L3.85265 11.7143C4.79947 15.2479 8.43152 17.3448 11.9651 16.398L11.7062 15.4321ZM4.81858 11.4555C4.01471 8.45541 5.7951 5.37169 8.79517 4.56782L8.53635 3.60189C5.00281 4.5487 2.90584 8.18076 3.85265 11.7143L4.81858 11.4555ZM8.79517 4.56782C10.2952 4.16589 11.8161 4.40998 13.0626 5.12964L13.5626 4.26362C12.0958 3.41679 10.3029 3.12855 8.53635 3.60189L8.79517 4.56782ZM13.0626 5.12965C13.3807 5.31332 13.8963 5.6402 14.3329 5.92146L14.8745 5.08083C14.4404 4.80115 13.905 4.46132 13.5626 4.26361L13.0626 5.12965ZM14.3329 5.92147C14.5511 6.06203 14.7493 6.19109 14.893 6.28501L15.4402 5.44798C15.2952 5.35319 15.095 5.22288 14.8745 5.08082L14.3329 5.92147ZM14.8931 6.28505C14.9649 6.332 15.0232 6.3702 15.0636 6.39673L15.6121 5.56059C15.5715 5.53391 15.5127 5.49536 15.4401 5.44794L14.8931 6.28505ZM15.0629 6.39629L15.1259 6.43771L15.6757 5.60244L15.6128 5.56102L15.0629 6.39629ZM15.1572 6.38903L15.0953 6.34835L14.546 7.18396L14.6079 7.22464L15.1572 6.38903ZM15.0952 6.34824C15.0548 6.32174 14.9966 6.28356 14.9249 6.23668L14.3775 7.07353C14.4488 7.12021 14.5065 7.15802 14.5462 7.18407L15.0952 6.34824ZM14.9247 6.23656C14.7809 6.14257 14.5825 6.01345 14.3642 5.87281L13.8226 6.71343C14.0386 6.85262 14.2352 6.98053 14.3776 7.07365L14.9247 6.23656ZM14.3642 5.8728C13.9278 5.59164 13.411 5.26402 13.0915 5.07952L12.5915 5.94554C12.8867 6.11601 13.3837 6.43066 13.8226 6.71344L14.3642 5.8728ZM13.0915 5.07952C11.8323 4.35248 10.2956 4.10584 8.78018 4.51191L9.039 5.47783C10.2881 5.14315 11.5527 5.34573 12.5915 5.94554L13.0915 5.07952ZM15.1176 6.39764C15.1265 6.38427 15.1444 6.38058 15.1578 6.3894L14.6073 7.22427C15.0551 7.51948 15.6574 7.39579 15.9526 6.94801L15.1176 6.39764ZM15.1256 6.43756C15.1126 6.42899 15.1086 6.41134 15.1177 6.39763L15.9526 6.94802C16.248 6.49991 16.1234 5.89753 15.6759 5.6026L15.1256 6.43756Z"
                        fill="#E82583"
                        mask="url(#path-1-outside-1_287_321)"
                      />
                      <path
                        d="M15.1068 3.49698C15.0037 3.11232 14.6083 2.88405 14.2237 2.98712C13.839 3.09019 13.6107 3.48557 13.7138 3.87023L14.2587 5.90378L12.2251 6.44867C11.8405 6.55174 11.6122 6.94712 11.7153 7.33178C11.8184 7.71644 12.2137 7.94471 12.5984 7.84165L15.3284 7.11013C15.7131 7.00707 15.9414 6.61168 15.8383 6.22702L15.1068 3.49698Z"
                        fill="#E82583"
                        stroke="#E82583"
                        strokeWidth="0.5"
                      />
                    </svg>
                  </span>
                  ล้างข้อมูล
                </Button>
                <Button
                  type="submit"
                  label="คำนวณสินเชื่อ"
                  disabled={isDisabled}
                />
              </div>
            </form>
            {/* Loan Summary */}
            <div className="flex flex-col gap-1">
              {/* Title */}
              <div className="flex items-center gap-1">
                <div className="flex gap-1 text-sm font-medium leading-6 text-[#0C0C0C]">
                  ผลคำนวณเงินกู้
                  <span className="hidden lg:block">(กรณีกู้ได้ 100%)</span>
                </div>
                <InformationCircleIcon
                  className="size-6 text-[#252525] lg:size-5"
                  data-tooltip-id="loan-calc-details"
                />
                <Tooltip
                  id="loan-calc-details"
                  place="bottom"
                  className="!rounded-md !bg-[#252525] !px-[10px] !py-3 !text-xs !font-normal !leading-5"
                  opacity="unset"
                >
                  <p>
                    ตัวเลขที่แสดงจะเป็นตัวเลขเฉพาะการกู้ <br />
                    โดยวิธีคำนวณง่ายๆ เงินเดือน 10,000 บาท <br />
                    จะกู้ได้ประมาณ 650,000 บาท
                  </p>
                </Tooltip>
              </div>
              {/* Info Chart */}
              <Card className="flex flex-col gap-2 text-nowrap rounded-2xl pt-5 lg:min-w-[434px] lg:gap-3 lg:p-6">
                {/* Info */}
                <div className="flex flex-col gap-2 lg:gap-3">
                  {/* Loan */}
                  <div className="flex flex-col justify-between gap-2 lg:flex-row">
                    <div className="text-sm font-medium leading-6 text-[#545454] lg:pb-[2px] lg:pt-[14px] lg:text-base lg:leading-7">
                      วงเงินกู้
                    </div>
                    <div className="flex gap-2 lg:gap-4">
                      <div className="text-center text-[28px] font-semibold leading-[43px] text-[#252525] lg:text-[32px] lg:leading-[44px]">
                        {Number(
                          Number(creditLimit).toFixed(0),
                        ).toLocaleString()}
                      </div>
                      <div className="pb-1 pt-[15px] lg:pb-[2px] lg:pt-[14px]">
                        <span className="text-center text-sm font-normal leading-6 text-[#545454] lg:text-base lg:leading-7">
                          บาท
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Income */}
                  <div className="flex flex-col justify-between gap-2 lg:flex-row">
                    <div className="text-sm font-medium leading-6 text-[#545454] lg:pb-[2px] lg:pt-[14px] lg:text-base lg:leading-7">
                      รายได้ขั้นต่ำต่อเดือน
                    </div>
                    <div className="flex gap-2 lg:gap-4">
                      <div className="text-center text-[28px] font-semibold leading-[43px] text-[#252525]">
                        {Number(
                          Number(minMonthlyIncome).toFixed(0),
                        ).toLocaleString()}
                      </div>
                      <div className="pb-1 pt-[15px] lg:pb-[2px] lg:pt-[14px]">
                        <span className="text-center text-sm font-normal leading-6 text-[#545454] lg:text-base lg:leading-7">
                          บาท
                        </span>
                      </div>
                    </div>
                  </div>
                  <hr />
                  {/* Monthy */}
                  <div className="flex flex-col justify-between gap-2 lg:flex-row">
                    <div className="text-sm font-medium leading-6 text-[#545454] lg:pb-[2px] lg:pt-[14px] lg:text-base lg:leading-7">
                      ยอดผ่อนต่อเดือน
                    </div>
                    <div className="flex gap-2 lg:gap-4">
                      <div className="inline-block bg-gradient-to-r from-[#24CE75] to-[#169BFD] bg-clip-text">
                        <div className="text-center text-[28px] font-semibold leading-[43px] text-transparent">
                          {Number(
                            Number(monthlyInstallment).toFixed(0),
                          ).toLocaleString()}
                        </div>
                      </div>
                      <div className="pb-1 pt-[15px] lg:pb-[2px] lg:pt-[14px]">
                        <span className="text-center text-sm font-normal leading-6 text-[#545454] lg:text-base lg:leading-7">
                          บาท
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
