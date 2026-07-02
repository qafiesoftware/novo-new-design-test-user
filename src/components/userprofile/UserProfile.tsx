"use client";
import FormMessage from "@/common/UI/FormMessage";
import React, { useEffect, useRef, useState } from "react";

import { Country } from "@/features/auth/register/types/register.types";
import {
  useGetKyc,
  useGetUserProfile,
  useSubmitEkyc,
  useUpdateUserPassword,
  useUpdateUserProfile,
} from "@/features/crm/user-profile/hooks/user-profile.hooks";
import {
  KycFormData,
  kycSchema,
  ProfileFormData,
  profileSchema,
  UpdatePasswordFormData,
  updatePasswordSchema,
} from "@/features/crm/user-profile/schemas/user-profile.schemas";
import { EyeCloseIcon } from "@/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { EyeIcon, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa6";
import verify from "../../../public/images/logo/verify.png";
import CountryDropdown from "../auth/countrydropdown/CountryDropdown";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import CustomDatePicker from "../ui/datePicker/CustomDatePicker";
import DocumentUpload from "./documents/DocumentUpload";
import DefaultAvatar from "../ui/avtar/DefaultAvatar";

const tabs = ["Profile", "Documents Verify", "Password Update"];

const documentTypes = [
  { value: "National ID Card", label: "National ID Card" },
  { value: "Passport", label: "Passport" },
  { value: "Driving License", label: "Driving License" },
  { value: "Bank Statement", label: "Bank Statement" },
  { value: "Utility Bill", label: "Utility Bill" },
];

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_MB = 2;

function calcProfileCompletion(data: {
  first_name?: string;
  last_name?: string;
  phone?: string;
  dob?: string;
  bio?: string;
  country?: string;
  user_img?: string;
  kycStatus?: string;
}): number {
  const fields = [
    !!data.first_name,
    !!data.last_name,
    !!data.phone,
    !!data.dob,
    !!data.country,
    !!data.user_img,
  ];

  const filled = fields.filter(Boolean).length;
  const profilePercent = Math.round((filled / fields.length) * 100);

  return data.kycStatus?.toLowerCase() === "approved" ? 100 : Math.min(profilePercent, 90);
}

// COMPONENT
const UserProfile = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState("Profile");
  const [CurrentshowPassword, setCurrentShowPassword] = useState(false);
  const [NewshowPassword, setNewShowPassword] = useState(false);
  const [ConfirmshowPassword, setConfirmShowPassword] = useState(false);

  const [userChangedDate, setUserChangedDate] = useState(false);

  // KYC file state
  const [fileFront, setFileFront] = useState<File | null>(null);
  const [fileBack, setFileBack] = useState<File | null>(null);
  const [fileFront2, setFileFront2] = useState<File | null>(null);
  const [fileBack2, setFileBack2] = useState<File | null>(null);
  const [kycSlotError, setKycSlotError] = useState<string>("");

  // Profile image
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { kycData, kycStatus, isLoading: kycLoading } = useGetKyc();
  const { mutate: submitKyc, isPending, message: kycMessage } = useSubmitEkyc();
  const { profileData, isLoading: profileLoading } = useGetUserProfile();

  const status = kycData?.[0]?.kyc_status || "";
  const kyc = kycData?.[0];

  const statusClasses = {
    approved: "text-green-500",
    pending: "text-yellow-500",
    rejected: "text-red-500",
  } as const;

  type Status = keyof typeof statusClasses;

  const {
    mutate: updatePassword,
    isPending: passwordUpdating,
    message: passwordMessage,
  } = useUpdateUserPassword();

  const {
    mutate: updateProfile,
    isPending: profileUpdating,
    message: profileMessage,
  } = useUpdateUserProfile();

  // Profile Zod Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmitForm,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
    setValue: setProfileValue,
    watch: watchProfile,
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      bio: "",
      dob: "",
      country: "",
    },
  });

  // KYC Zod Form
  const {
    setValue: setKycValue,
    handleSubmit: handleKycSubmitForm,
    formState: { errors: kycErrors },
    watch: watchKyc,
  } = useForm<KycFormData>({
    resolver: zodResolver(kycSchema),
    defaultValues: { doc_type: "", doc_type2: "" },
  });

  // Password Zod Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  // Watched values
  const watchedDocType = watchKyc("doc_type");
  const watchedDocType2 = watchKyc("doc_type2");
  const watchedProfile = watchProfile();

  const profileHasChanges = isProfileDirty || profileImage !== null || userChangedDate;

  // Profile Completion
  const completionPercent = kycLoading
    ? 0
    : calcProfileCompletion({
        first_name: watchedProfile.first_name,
        last_name: watchedProfile.last_name,
        phone: watchedProfile.phone,
        dob: watchedProfile.dob,
        country: watchedProfile.country,
        user_img: profilePreview,
        kycStatus: status,
      });

  // Populate profile form from API

  useEffect(() => {
    if (profileData) {
      resetProfile({
        first_name: profileData.first_name ?? "",
        last_name: profileData.last_name ?? "",
        phone: profileData.user_mobile ?? "",
        bio: profileData.user_bio || "",
        dob: profileData.birthdate ?? "",
        country: profileData.user_country ?? "",
      });

      setProfilePreview(profileData.user_img ?? "");

      if (profileData.birthdate && profileData.birthdate.trim() !== "") {
        const parts = profileData.birthdate.split("-").map(Number);
        if (parts.length === 3 && parts.every((n) => !isNaN(n) && n > 0)) {
          const [dd, mm, yyyy] = parts;
          const parsed = new Date(yyyy, mm - 1, dd);
          if (!isNaN(parsed.getTime())) {
            setStartDate(parsed);
          }
        }
      }

      if (profileData.user_country) {
        setSelectedCountry({
          country_code: profileData.user_country,
          country_name: profileData.contryname ?? profileData.user_country,
        } as Country);
      }
    }
    setUserChangedDate(false);
  }, [profileData, resetProfile]);

  useEffect(() => {
    if (startDate) {
      const yyyy = startDate.getFullYear();
      const mm = String(startDate.getMonth() + 1).padStart(2, "0");
      const dd = String(startDate.getDate()).padStart(2, "0");
      setProfileValue("dob", `${yyyy}-${mm}-${dd}`, {
        shouldValidate: true,
        shouldDirty: userChangedDate,
      });
    }
  }, [startDate, setProfileValue, userChangedDate]);

  const firstKyc = kycData?.[0];

  useEffect(() => {
    if (firstKyc) {
      setKycValue("doc_type", firstKyc.doc_type ?? "");
      setKycValue("doc_type2", firstKyc.address_doc_type ?? "");
    }
  }, [firstKyc, setKycValue]);

  const kycHasChanges =
    watchedDocType !== (firstKyc?.doc_type ?? "") ||
    watchedDocType2 !== (firstKyc?.address_doc_type ?? "") ||
    fileFront !== null ||
    fileBack !== null ||
    fileFront2 !== null ||
    fileBack2 !== null;

  // Profile Image Upload
  const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Only JPG, PNG, or WEBP images are allowed.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setImageError(`Image must be under ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    setImageError("");
    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setProfileValue("country", country.country_code ?? "", { shouldValidate: true });
  };

  // Profile Submit
  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfile({
      first_name: data.first_name,
      last_name: data.last_name,
      dob: data.dob,
      bio: data.bio ?? "",
      mobileno: data.phone,
      user_img: profileImage ?? undefined,
    });
  };

  // KYC Submit
  const onKycSubmit = (data: KycFormData) => {
    // const isFirstTime = !kyc; // pehli baar KYC submit

    const poiFrontOk = !!fileFront || !!kyc?.identity_front_photo;
    const poiBackOk = !!fileBack || !!kyc?.identity_back_photo;
    const poaFrontOk = !!fileFront2 || !!kyc?.address_photo;
    const poaBackOk = !!fileBack2 || !!kyc?.address_photo_back;

    // first time, 4 files mandatory
    // edit
    if (!poiFrontOk || !poiBackOk || !poaFrontOk || !poaBackOk) {
      const missing: string[] = [];
      if (!poiFrontOk) missing.push("POI Front");
      if (!poiBackOk) missing.push("POI Back");
      if (!poaFrontOk) missing.push("POA Front");
      if (!poaBackOk) missing.push("POA Back");
      setKycSlotError(`Please upload: ${missing.join(", ")}`);
      return;
    }

    setKycSlotError("");
    submitKyc({
      doc_type: data.doc_type,
      doc_number: "",
      doc_type2: data.doc_type2,
      doc_number2: "",
      doc_front: fileFront ?? undefined,
      doc_back: fileBack ?? undefined,
      doc_front2: fileFront2 ?? undefined,
      doc_back2: fileBack2 ?? undefined,
    });
  };

  // Password Submit
  const handlePasswordSubmit = (data: UpdatePasswordFormData) => {
    updatePassword(
      {
        current_password: data.current_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      },
      { onSuccess: () => reset() }
    );
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
  };

  // Derived display values from profileData
  const displayName = profileData
    ? `${profileData.first_name ?? ""} ${profileData.last_name ?? ""}`.trim() || "—"
    : "—";

  const displayJoined = profileData?.user_reg_date
    ? new Date(profileData.user_reg_date).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : null;

  const displayCountry = profileData?.contryname ?? null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800">
      {/* Banner */}
      <div className="relative h-44 rounded-b-md bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 sm:h-28">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div className="relative h-24 w-24 overflow-visible rounded-full border-4 border-white shadow-lg sm:h-28 sm:w-28 dark:border-slate-900">
            {profilePreview ? (
              <Image
                src={profilePreview}
                alt="Profile Img"
                fill
                className="h-full w-full rounded-full object-cover"
                onError={() => setProfilePreview("")}
              />
            ) : (
              <DefaultAvatar />
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-0 bottom-0 z-50 rounded-full bg-white p-1 shadow-md transition hover:scale-105"
            >
              <FaCamera className="text-gray-700" size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleProfileImage}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-16 mb-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{displayName}</h1>
            {kycStatus?.toLowerCase() === "approved" && (
              <Image
                src={verify}
                alt="Verified badge"
                className="relative h-5 w-5 object-contain"
              />
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Trader
            {displayJoined ? ` • Joined ${displayJoined}` : ""}
            {displayCountry ? ` • ${displayCountry}` : ""}
          </p>
          {imageError && <p className="mt-1 text-xs text-red-500">{imageError}</p>}
        </div>

        {/* Tabs */}
        <div className="mt-8 flex justify-center space-x-6 border-b border-gray-200 dark:border-gray-700">
          {/* {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium transition-all sm:text-base ${
                activeTab === tab
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))} */}
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium transition-all sm:text-base ${
                activeTab === tab
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {/* ── Profile Tab */}
            {activeTab === "Profile" && (
              <motion.div
                key="profile"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid gap-8 lg:grid-cols-3"
              >
                {/* Left Info Card */}
                <div className="space-y-5 rounded-2xl bg-white p-6 shadow dark:bg-slate-800">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Profile Completion
                    </h3>
                    <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:text-gray-300">
                      <div
                        className="h-2 rounded-full bg-[#465FFF] transition-all duration-700"
                        style={{ width: kycLoading ? "0%" : `${completionPercent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {kycLoading ? "Calculating..." : `${completionPercent}% completed`}
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-200">
                      Contact Info
                    </h4>

                    <div className="space-y-2">
                      <p className="text-md flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Phone size={18} strokeWidth={2.5} className="shrink-0" />
                        <span>{profileData?.user_reg_code ?? "—"}</span>
                      </p>

                      <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Mail size={18} strokeWidth={2.5} className="shrink-0" />
                        <span>{profileData?.user_mobile ?? "—"}</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-200">Bio</h4>
                    <p className="text-md text-gray-500">
                      {profileData?.user_bio || "No bio added yet."}
                    </p>
                  </div>
                </div>

                {/* Right Side — Personal Details Form */}
                <div className="space-y-6 rounded-2xl bg-white p-6 shadow lg:col-span-2 dark:bg-slate-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Personal Details
                  </h3>

                  {profileMessage && <FormMessage message={profileMessage} />}

                  {profileLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#465FFF] border-t-transparent" />
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-5 sm:grid-cols-2">
                        {/* First Name */}
                        <div>
                          <label className="text-sm text-gray-500">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...registerProfile("first_name")}
                            type="text"
                            placeholder="Enter first name"
                            maxLength={50}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-300 dark:border-gray-700 dark:bg-slate-700 dark:text-gray-100"
                          />
                          {profileErrors.first_name && (
                            <p className="mt-0.5 text-xs text-red-500">
                              {profileErrors.first_name.message}
                            </p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div>
                          <label className="text-sm text-gray-500">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...registerProfile("last_name")}
                            type="text"
                            placeholder="Enter last name"
                            maxLength={50}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-300 dark:border-gray-700 dark:bg-slate-700 dark:text-gray-100"
                          />
                          {profileErrors.last_name && (
                            <p className="mt-0.5 text-xs text-red-500">
                              {profileErrors.last_name.message}
                            </p>
                          )}
                        </div>

                        {/* Country */}
                        <div>
                          <label className="text-sm text-gray-500">Country</label>
                          <CountryDropdown value={selectedCountry} onChange={handleCountryChange} />
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label className="text-md text-gray-500">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...registerProfile("phone")}
                            type="tel"
                            placeholder="Enter 10-digit number"
                            maxLength={12}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-300 dark:border-gray-700 dark:bg-slate-700 dark:text-gray-100"
                          />
                          {profileErrors.phone && (
                            <p className="mt-0.5 text-xs text-red-500">
                              {profileErrors.phone.message}
                            </p>
                          )}
                        </div>

                        {/* Date of Birth */}
                        <div>
                          <label className="text-md text-gray-500">
                            Date of Birth <span className="text-red-500">*</span>
                          </label>
                          <CustomDatePicker
                            selected={startDate ?? undefined}
                            onChange={(date) => {
                              setStartDate(date);
                              setUserChangedDate(true);
                            }}
                            maxDate={new Date()}
                            placeholder="Select your date of birth"
                          />
                          {profileErrors.dob && (
                            <p className="mt-0.5 text-xs text-red-500">
                              {profileErrors.dob.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bio — Optional field, no asterisk */}
                      <div>
                        <label className="text-md text-gray-500 dark:text-gray-400">
                          Bio{" "}
                          <span className="text-md text-gray-400">
                            ({watchedProfile.bio?.length ?? 0}/300)
                          </span>
                        </label>
                        <textarea
                          {...registerProfile("bio")}
                          placeholder="Write something about yourself... (optional)"
                          maxLength={300}
                          className="mt-1 w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-300 dark:border-gray-700 dark:bg-slate-700 dark:text-gray-100"
                          rows={3}
                        />
                        {profileErrors.bio && (
                          <p className="mt-0.5 text-xs text-red-500">{profileErrors.bio.message}</p>
                        )}
                      </div>

                      <div className="text-right">
                        <button
                          type="button"
                          onClick={handleProfileSubmitForm(onProfileSubmit)}
                          disabled={profileUpdating || !profileHasChanges}
                          className="rounded-lg bg-[#465FFF] px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {profileUpdating ? "Saving..." : "Save Changes"}
                        </button>
                      </div>

                      {/* {profileMessage && <FormMessage message={profileMessage} />} */}
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Documents Verify Tab */}
            {activeTab === "Documents Verify" && (
              <motion.div
                key="documents"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8 rounded-2xl bg-white p-6 shadow dark:bg-slate-800"
              >
                <div className="flex items-start justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      KYC Documents Verification
                    </h3>
                    {/* Updated hint to reflect 10MB limit */}
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Please upload your KYC documents. Supported formats: PDF, JPG, JPEG, PNG. Max
                      10MB per file.
                    </p>
                  </div>

                  {/* {kycData && (
                    <p className="text-sm font-medium whitespace-nowrap">
                      Status:{" "}
                      <span
                        className={statusClasses[status.toLowerCase() as Status] ?? "text-gray-500"}
                      >
                        {status}
                      </span>
                    </p>
                  )} */}
                  {kycData ? (
                    status ? (
                      <p className="text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                        Status:{" "}
                        <span
                          className={
                            statusClasses[status.toLowerCase() as Status] ??
                            "text-gray-500 dark:text-gray-400"
                          }
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </p>
                    ) : (
                      <p className="text-sm font-medium whitespace-nowrap text-gray-400 dark:text-slate-500">
                        No submission yet
                      </p>
                    )
                  ) : null}
                </div>

                {kycLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#465FFF] border-t-transparent" />
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 xl:gap-12">
                    {/* LEFT — POI */}
                    <div className="space-y-5">
                      <label className="font-semibold text-gray-800 dark:text-gray-200">
                        Proof of Identity (POI) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={watchedDocType}
                        onChange={(e) =>
                          setKycValue("doc_type", e.target.value, { shouldValidate: true })
                        }
                        className="w-full rounded-md border bg-gray-50 p-2 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="">Select document type</option>
                        {documentTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {kycErrors.doc_type && (
                        <p className="text-xs text-red-500">{kycErrors.doc_type.message}</p>
                      )}
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <DocumentUpload
                          title="POI Front"
                          preview={kyc?.identity_front_photo}
                          onChange={(file) => setFileFront(file)}
                          // pass maxSizeMB so DocumentUpload can enforce 10MB
                          maxSizeMB={10}
                          // PDF allowed
                          acceptPdf
                        />
                        <DocumentUpload
                          title="POI Back"
                          preview={kyc?.identity_back_photo}
                          onChange={(file) => setFileBack(file)}
                          maxSizeMB={10}
                          acceptPdf
                        />
                      </div>
                    </div>

                    {/* RIGHT — POA */}
                    <div className="space-y-5">
                      <label className="font-semibold text-gray-800 dark:text-gray-200">
                        Proof of Address (POA) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={watchedDocType2}
                        onChange={(e) =>
                          setKycValue("doc_type2", e.target.value, { shouldValidate: true })
                        }
                        className="w-full rounded-md border bg-gray-50 p-2 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="">Select document type</option>
                        {documentTypes
                          .filter((t) => t.value !== watchedDocType)
                          .map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                      </select>
                      {kycErrors.doc_type2 && (
                        <p className="text-xs text-red-500">{kycErrors.doc_type2.message}</p>
                      )}

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <DocumentUpload
                          title="POA Front"
                          preview={kyc?.address_photo}
                          onChange={(file) => setFileFront2(file)}
                          maxSizeMB={10}
                          acceptPdf
                        />
                        <DocumentUpload
                          title="POA Back"
                          preview={kyc?.address_photo_back}
                          onChange={(file) => setFileBack2(file)}
                          maxSizeMB={10}
                          acceptPdf
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* FIX 2: slot validation error */}
                {kycSlotError && <p className="text-sm text-red-500">{kycSlotError}</p>}

                {/* message */}
                {kycMessage && <FormMessage message={kycMessage} />}

                <div className="flex flex-col justify-end gap-4 pt-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleKycSubmitForm(onKycSubmit)}
                    disabled={isPending || !kycHasChanges}
                    className="rounded-lg bg-[#465FFF] px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? "Submitting..." : "Submit for Verification"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Password Update Tab */}
            {activeTab === "Password Update" && (
              <motion.div
                key="password"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs md:p-8 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="border-b border-gray-200 pb-2 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Update Password
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    For security reasons, please enter your current password to continue.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Current Password */}
                  <div className="space-y-1">
                    <Label>Current Password</Label>
                    <div className="relative">
                      <Input
                        {...register("current_password")}
                        placeholder="Enter current password"
                        type={CurrentshowPassword ? "text" : "password"}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pr-12 focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:bg-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setCurrentShowPassword(!CurrentshowPassword)}
                        className="absolute top-1/2 right-4 -translate-y-1/2"
                      >
                        {CurrentshowPassword ? <EyeIcon /> : <EyeCloseIcon />}
                      </button>
                    </div>
                    {errors.current_password && (
                      <p className="text-sm text-red-500">{errors.current_password.message}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-1">
                    <Label className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
                      New Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        {...register("new_password")}
                        placeholder="Enter new password"
                        type={NewshowPassword ? "text" : "password"}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pr-12 focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:bg-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setNewShowPassword(!NewshowPassword)}
                        className="absolute inset-y-0 right-4 flex items-center opacity-70 hover:opacity-100 dark:text-white"
                      >
                        {NewshowPassword ? <EyeIcon /> : <EyeCloseIcon />}
                      </button>
                    </div>
                    {errors.new_password && (
                      <p className="text-sm text-red-500">{errors.new_password.message}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Use 8+ characters with a mix of letters, numbers & symbols
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <Label className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        {...register("confirm_password")}
                        placeholder="Re-enter new password"
                        type={ConfirmshowPassword ? "text" : "password"}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pr-12 focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:bg-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setConfirmShowPassword(!ConfirmshowPassword)}
                        className="absolute inset-y-0 right-4 flex items-center opacity-70 hover:opacity-100 dark:text-white"
                      >
                        {ConfirmshowPassword ? <EyeIcon /> : <EyeCloseIcon />}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="text-sm text-red-500">{errors.confirm_password.message}</p>
                    )}
                    <br />
                    {passwordMessage && <FormMessage message={passwordMessage} />}
                  </div>
                </div>

                <div className="pt-4 text-right">
                  <button
                    type="button"
                    onClick={handleSubmit(handlePasswordSubmit)}
                    disabled={passwordUpdating}
                    className="w-full rounded-lg bg-[#465FFF] px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
                  >
                    {passwordUpdating ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
