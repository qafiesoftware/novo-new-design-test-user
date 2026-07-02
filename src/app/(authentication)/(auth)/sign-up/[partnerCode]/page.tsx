import SignUpForm from "@/components/auth/SignUpForm";

export default async function PartnerSignUpPage({
  params,
}: {
  params: Promise<{ partnerCode: string }>;
}) {
  const { partnerCode } = await params;
  return <SignUpForm partnerCode={partnerCode} />;
}