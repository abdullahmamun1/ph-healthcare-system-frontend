"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { useEffect, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useVerifyAccount, useVerifyDoctorAccount } from "@/hooks";
import { toast } from "../ui/toast";

const RESEND_COOLDOWN = 120;

export default function VerifyAccountForm({
  mode = "patient",
}: {
  mode: "doctor" | "patient";
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [OTP, setOTP] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const email = searchParams.get("email") || "";

  const { mutate: verifyPatient } = useVerifyAccount();
  const { mutate: verifyDoctor } = useVerifyDoctorAccount();

  const verify = mode === "doctor" ? verifyDoctor : verifyPatient;

  useEffect(() => {
    if (!email) {
      router.push("/");
    }
  }, [email, router]);

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleOTP = () => {
    if (OTP.length !== 6) {
      setIsInvalid(true);
      return;
    }

    const verifyData = {
      email,
      otp: OTP,
    };

    verify(verifyData, {
      onSuccess: (res) => {
        if (!res.success) {
          toast.add({
            title: "Server Failure",
            description: "Something went wrong! Please Try Again.",
            type: "error",
          });
        }

        if (mode === "doctor") {
          toast.add({
            title: "Verification Successful!",
            description:
              "An Admin will approve your account. This may take time. Please check your email in few days.",
            type: "success",
          });
          router.push("/");
          return;
        }
        toast.add({
          title: "Verification Successful!",
          description: "Welcome onboard",
          type: "success",
        });
        router.push("/");
      },
      onError: (err) => {
        toast.add({
          title: "Verification Failure",
          description: err.message || "Something went wrong! Please Try Again.",
          type: "error",
        });
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Account</CardTitle>
        <CardDescription>
          Please Provide the OTP we send you in your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="otp-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOTP();
          }}
        >
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor="otp">OTP</FieldLabel>
            <InputOTP
              maxLength={6}
              autoComplete="off"
              onChange={(value) => {
                setOTP(value);
                if (isInvalid) {
                  setIsInvalid(false);
                }
              }}
              name="otp"
              value={OTP}
              id="otp"
              pattern={REGEXP_ONLY_DIGITS}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  className="border-gray-400 bg-white text-black"
                  index={0}
                />
                <InputOTPSlot
                  className="border-gray-400 bg-white text-black"
                  index={1}
                />
                <InputOTPSlot
                  className="border-gray-400 bg-white text-black"
                  index={2}
                />
                <InputOTPSlot
                  className="border-gray-400 bg-white text-black"
                  index={3}
                />
                <InputOTPSlot
                  className="border-gray-400 bg-white text-black"
                  index={4}
                />
                <InputOTPSlot
                  className="border-gray-400 bg-white text-black"
                  index={5}
                />
              </InputOTPGroup>
            </InputOTP>
            {isInvalid && (
              <FieldError
                errors={[{ message: "Invalid OTP. Please try again." }]}
              />
            )}
          </Field>
          <FieldDescription>Resend in {resendTimer}</FieldDescription>
        </form>
      </CardContent>
      <CardFooter>
        <Button disabled={resendTimer > 0}>Resend</Button>
        <Button type="submit" form="otp-form">
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
