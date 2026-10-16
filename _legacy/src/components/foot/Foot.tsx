"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import Img_Helper from "../../helper/img_help";
import Icons from "../../helper/icon_help";
import { mecatronixConfig } from "../../config/envConfig";
import { NAV, subtitles } from "../../helper/data_help";
import { subscribeNewsletterAPI } from "../../api/api";
import { validateEmail } from "../../helper/res_help";

const Foot = () => {
  const router = useRouter();
  const pathname = usePathname();

  const {
    FaFacebookF,
    FaInstagram,
    FaWhatsapp,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaGithub,
    FaYoutube,
    FaArrowRight,
  } = Icons;

  const {
    app,
    contact,
    social,
    location: companyLocation,
  } = mecatronixConfig;

  const APP_SLOGAN =
    app?.slogan || "Engineering the Future of Automation";

  const PRIMARY_PHONE =
    contact?.primaryPhone || "+910000000000";

  const WHATSAPP_NUMBER =
    contact?.whatsappNumber || "+910000000000";

  const COMPANY_EMAIL =
    contact?.companyEmail || "connect@mecatronix.com";

  const locationlink =
    companyLocation?.googleMapsLink || "";

  const [currentIndex, setCurrentIndex] = useState(0);

  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const abortRef =
    useRef<AbortController | null>(null);

  const successTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const mountedRef = useRef(true);

  /* ==========================================
     SUBTITLE ROTATION
  ========================================== */

  useEffect(() => {
    if (!subtitles?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex(
        (prev) => (prev + 1) % subtitles.length,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* ==========================================
     SUBSCRIPTION
  ========================================== */

  const handleFooterSubscribe = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (loading) return;

      const trimmedEmail = email.trim();

      if (!validateEmail(trimmedEmail)) {
        setError("Invalid email address");
        return;
      }

      setLoading(true);
      setError("");

      abortRef.current?.abort();

      const controller = new AbortController();

      abortRef.current = controller;

      try {
        const result = await subscribeNewsletterAPI(
          {
            email: trimmedEmail,
          },
          {
            signal: controller.signal,
          },
        );

        if (!mountedRef.current) return;

        if (result?.success) {
          setIsSubscribed(true);
          setEmail("");

          successTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              setIsSubscribed(false);
            }
          }, 4000);
        } else {
          setError("Subscription failed. Try again.");
        }
      } catch (err: any) {
        if (
          err?.name !== "AbortError" &&
          err?.code !== "ERR_CANCELED"
        ) {
          if (mountedRef.current) {
            setError(
              "Something went wrong. Try again.",
            );
          }
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }

        abortRef.current = null;
      }
    },
    [email, loading],
  );

  /* ==========================================
     CLEANUP
  ========================================== */

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      abortRef.current?.abort();

      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  /* ==========================================
     SOCIAL LINKS
  ========================================== */

  const socialLinks = useMemo(
    () =>
      [
        {
          icon: FaFacebookF,
          href: social?.facebook,
          label: "Facebook",
        },
        {
          icon: FaInstagram,
          href: social?.instagram,
          label: "Instagram",
        },
        {
          icon: FaYoutube,
          href: social?.youtube,
          label: "YouTube",
        },
        {
          icon: FaWhatsapp,
          href: `https://wa.me/${WHATSAPP_NUMBER?.replace(
            "+",
            "",
          )}`,
          label: "WhatsApp",
        },
        {
          icon: FaGithub,
          href: social?.github,
          label: "GitHub",
        },
      ].filter((link) => link.href),

    [
      FaFacebookF,
      FaInstagram,
      FaYoutube,
      FaWhatsapp,
      FaGithub,
      social,
      WHATSAPP_NUMBER,
    ],
  );

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <footer
      className="
        relative
        overflow-hidden
        bg-[#050505]
        px-3
        pb-4
        pt-8
        text-white
        sm:px-4
        lg:px-6
      "
    >
      {/* ========================================
          BACKGROUND
      ======================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_20%_10%,rgba(249,115,22,0.08),transparent_25%),radial-gradient(circle_at_85%_85%,rgba(255,255,255,0.04),transparent_30%)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
          bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
          bg-[size:26px_26px]
        "
      />

      {/* ========================================
          MAIN GLASS FOOTER
      ======================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-[1420px]
          overflow-hidden
          rounded-[26px]
          border
          border-white/[0.08]
          bg-white/[0.035]
          shadow-[0_24px_90px_rgba(0,0,0,0.45)]
          backdrop-blur-[26px]
        "
      >
        {/* TOP GLASS REFLECTION */}

        <div
          className="
            pointer-events-none
            absolute
            left-[8%]
            right-[8%]
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/35
            to-transparent
          "
        />

        {/* ORANGE GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            left-[10%]
            top-[-140px]
            h-[250px]
            w-[350px]
            rounded-full
            bg-orange-500/[0.07]
            blur-[100px]
          "
        />

        {/* ========================================
            TOP AREA
        ======================================== */}

        <div
          className="
            grid
            gap-3
            p-4
            md:grid-cols-2
            lg:grid-cols-[1.25fr_.8fr_.95fr_1.15fr]
            lg:p-5
          "
        >
          {/* =====================================
              BRAND
          ===================================== */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[20px]
              border
              border-white/[0.07]
              bg-white/[0.025]
              p-5
              shadow-[inset_0_1px_0_rgba(255,255,255,.04)]
              transition-all
              duration-300
              hover:border-white/[0.12]
              hover:bg-white/[0.04]
            "
          >
            <button
              type="button"
              onClick={() => router.push("/")}
              className="
                group
                flex
                items-center
                gap-3
                text-left
              "
            >
              <div
                className="
                  relative
                  flex
                  h-[42px]
                  w-[42px]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[13px]
                  border
                  border-white/[0.09]
                  bg-white/[0.05]
                  transition-all
                  duration-300
                  group-hover:border-orange-500/30
                  group-hover:bg-orange-500/[0.07]
                "
              >
                <Image
                  src={Img_Helper.mainlogo}
                  alt="Mecatronix"
                  width={292}
                  height={352}
                  sizes="32px"
                  className="
                    h-[29px]
                    w-[29px]
                    object-contain
                    transition-transform
                    duration-500
                    group-hover:scale-110
                  "
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    -left-[80%]
                    top-0
                    h-full
                    w-[45%]
                    skew-x-[-25deg]
                    bg-white/20
                    transition-all
                    duration-700
                    group-hover:left-[140%]
                  "
                />
              </div>

              <div>
                <h2
                  className="
                    text-[17px]
                    font-black
                    uppercase
                    tracking-[0.03em]
                    text-white
                  "
                >
                  Meca
                  <span className="text-orange-500">
                    tronix
                  </span>
                </h2>

                <div
                  className="
                    mt-1
                    flex
                    items-center
                    gap-2
                  "
                >
                  <span className="relative flex h-[6px] w-[6px]">
                    <span
                      className="
                        absolute
                        inline-flex
                        h-full
                        w-full
                        animate-ping
                        rounded-full
                        bg-orange-500
                        opacity-50
                      "
                    />

                    <span
                      className="
                        relative
                        h-[6px]
                        w-[6px]
                        rounded-full
                        bg-orange-500
                        shadow-[0_0_8px_rgba(249,115,22,.9)]
                      "
                    />
                  </span>

                  <span
                    key={currentIndex}
                    className="
                      max-w-[170px]
                      truncate
                      font-mono
                      text-[7px]
                      uppercase
                      tracking-[0.17em]
                      text-white/35
                      animate-in
                      fade-in
                    "
                  >
                    {subtitles[currentIndex]}
                  </span>
                </div>
              </div>
            </button>

            <p
              className="
                mt-4
                max-w-[330px]
                text-[11px]
                leading-[1.7]
                text-white/40
              "
            >
              {APP_SLOGAN}. Building modern digital,
              automation and intelligent software solutions.
            </p>

            {/* SOCIAL */}

            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-2
              "
            >
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="
                    group
                    flex
                    h-[34px]
                    w-[34px]
                    items-center
                    justify-center
                    rounded-[10px]
                    border
                    border-white/[0.07]
                    bg-white/[0.035]
                    text-white/40
                    transition-all
                    duration-300

                    hover:-translate-y-[2px]
                    hover:border-orange-500/25
                    hover:bg-orange-500/[0.07]
                    hover:text-orange-400
                  "
                >
                  <link.icon className="text-[12px]" />
                </a>
              ))}
            </div>
          </div>

          {/* =====================================
              NAVIGATION
          ===================================== */}

          <div
            className="
              rounded-[20px]
              border
              border-white/[0.07]
              bg-white/[0.025]
              p-5
              shadow-[inset_0_1px_0_rgba(255,255,255,.04)]
            "
          >
            <div
              className="
                mb-4
                flex
                items-center
                justify-between
              "
            >
              <div>
                <span
                  className="
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-orange-400
                  "
                >
                  Navigation
                </span>

                <h3
                  className="
                    mt-1
                    text-[12px]
                    font-bold
                    text-white
                  "
                >
                  Quick Links
                </h3>
              </div>

              <span
                className="
                  rounded-full
                  border
                  border-white/[0.06]
                  bg-white/[0.035]
                  px-2
                  py-1
                  font-mono
                  text-[6px]
                  text-white/25
                "
              >
                MENU
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1">
              {NAV.map((link) => {
                const active = isActive(link.id);

                return (
                  <Link
                    key={link.id}
                    href={link.id}
                    className={`
                      group
                      flex
                      items-center
                      justify-between
                      rounded-[10px]
                      px-2.5
                      py-2
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                      transition-all
                      duration-300

                      ${
                        active
                          ? `
                            bg-orange-500/[0.08]
                            text-orange-400
                          `
                          : `
                            text-white/40
                            hover:bg-white/[0.04]
                            hover:text-white
                          `
                      }
                    `}
                  >
                    <span>
                      {link.id === "/"
                        ? "Home"
                        : link.label}
                    </span>

                    <FaArrowRight
                      className="
                        text-[7px]
                        opacity-0
                        transition-all
                        group-hover:translate-x-1
                        group-hover:opacity-100
                      "
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* =====================================
              CONTACT
          ===================================== */}

          <div
            className="
              rounded-[20px]
              border
              border-white/[0.07]
              bg-white/[0.025]
              p-5
              shadow-[inset_0_1px_0_rgba(255,255,255,.04)]
            "
          >
            <div className="mb-4">
              <span
                className="
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-orange-400
                "
              >
                Communication
              </span>

              <h3
                className="
                  mt-1
                  text-[12px]
                  font-bold
                  text-white
                "
              >
                Connect With Us
              </h3>
            </div>

            <div className="space-y-2">
              {/* LOCATION */}

              <a
                href={locationlink}
                target="_blank"
                rel="noreferrer"
                className="
                  group
                  flex
                  gap-3
                  rounded-[12px]
                  border
                  border-transparent
                  p-2.5
                  transition-all

                  hover:border-white/[0.06]
                  hover:bg-white/[0.035]
                "
              >
                <div
                  className="
                    flex
                    h-[30px]
                    w-[30px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[9px]
                    bg-orange-500/[0.07]
                    text-orange-400
                  "
                >
                  <FaMapMarkerAlt size={10} />
                </div>

                <div>
                  <span
                    className="
                      block
                      text-[7px]
                      uppercase
                      tracking-wider
                      text-white/20
                    "
                  >
                    Location
                  </span>

                  <span
                    className="
                      mt-0.5
                      block
                      line-clamp-2
                      text-[9px]
                      leading-[1.5]
                      text-white/50
                      transition-colors
                      group-hover:text-white
                    "
                  >
                    {companyLocation?.fullAddress ||
                      "India"}
                  </span>
                </div>
              </a>

              {/* PHONE */}

              <a
                href={`tel:${PRIMARY_PHONE}`}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  rounded-[12px]
                  border
                  border-transparent
                  p-2.5
                  transition-all

                  hover:border-white/[0.06]
                  hover:bg-white/[0.035]
                "
              >
                <div
                  className="
                    flex
                    h-[30px]
                    w-[30px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[9px]
                    bg-orange-500/[0.07]
                    text-orange-400
                  "
                >
                  <FaPhoneAlt size={10} />
                </div>

                <div>
                  <span
                    className="
                      block
                      text-[7px]
                      uppercase
                      tracking-wider
                      text-white/20
                    "
                  >
                    Phone
                  </span>

                  <span
                    className="
                      mt-0.5
                      block
                      text-[9px]
                      font-medium
                      text-white/50
                      transition-colors
                      group-hover:text-white
                    "
                  >
                    {PRIMARY_PHONE}
                  </span>
                </div>
              </a>

              {/* EMAIL */}

              <a
                href={`mailto:${COMPANY_EMAIL}`}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  rounded-[12px]
                  border
                  border-transparent
                  p-2.5
                  transition-all

                  hover:border-white/[0.06]
                  hover:bg-white/[0.035]
                "
              >
                <div
                  className="
                    flex
                    h-[30px]
                    w-[30px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[9px]
                    bg-orange-500/[0.07]
                    text-orange-400
                  "
                >
                  <FaEnvelope size={10} />
                </div>

                <div className="min-w-0">
                  <span
                    className="
                      block
                      text-[7px]
                      uppercase
                      tracking-wider
                      text-white/20
                    "
                  >
                    Email
                  </span>

                  <span
                    className="
                      mt-0.5
                      block
                      truncate
                      text-[9px]
                      font-medium
                      text-white/50
                      transition-colors
                      group-hover:text-white
                    "
                  >
                    {COMPANY_EMAIL}
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* =====================================
              NEWSLETTER
          ===================================== */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[20px]
              border
              border-white/[0.07]
              bg-gradient-to-br
              from-white/[0.04]
              to-orange-500/[0.025]
              p-5
              shadow-[inset_0_1px_0_rgba(255,255,255,.05)]
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-12
                -top-12
                h-32
                w-32
                rounded-full
                bg-orange-500/10
                blur-[50px]
              "
            />

            <div className="relative">
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-3
                "
              >
                <div>
                  <span
                    className="
                      text-[7px]
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-orange-400
                    "
                  >
                    Newsletter
                  </span>

                  <h3
                    className="
                      mt-1
                      text-[12px]
                      font-bold
                      text-white
                    "
                  >
                    Stay Connected
                  </h3>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-emerald-500/15
                    bg-emerald-500/[0.05]
                    px-2
                    py-1
                  "
                >
                  <span
                    className="
                      h-[5px]
                      w-[5px]
                      animate-pulse
                      rounded-full
                      bg-emerald-500
                    "
                  />

                  <span
                    className="
                      text-[6px]
                      uppercase
                      tracking-wider
                      text-emerald-400
                    "
                  >
                    Online
                  </span>
                </div>
              </div>

              <p
                className="
                  mt-3
                  text-[9px]
                  leading-[1.6]
                  text-white/35
                "
              >
                Get updates about new software,
                technology and Mecatronix solutions.
              </p>

              {isSubscribed ? (
                <div
                  className="
                    mt-4
                    flex
                    min-h-[42px]
                    items-center
                    rounded-[12px]
                    border
                    border-emerald-500/20
                    bg-emerald-500/[0.06]
                    px-3
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-emerald-400
                  "
                >
                  Subscription successful.
                </div>
              ) : (
                <form
                  onSubmit={handleFooterSubscribe}
                  className="mt-4"
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-[13px]
                      border
                      border-white/[0.08]
                      bg-black/25
                      p-1.5
                      transition-all

                      focus-within:border-orange-500/30
                      focus-within:bg-black/35
                    "
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);

                        if (error) {
                          setError("");
                        }
                      }}
                      placeholder="Your email address"
                      required
                      className="
                        min-w-0
                        flex-1
                        bg-transparent
                        px-2
                        text-[9px]
                        text-white
                        outline-none
                        placeholder:text-white/20
                      "
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="
                        group
                        flex
                        h-[31px]
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-[9px]
                        bg-orange-500
                        px-3
                        text-[7px]
                        font-black
                        uppercase
                        tracking-[0.1em]
                        text-black
                        transition-all

                        hover:bg-white
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {loading ? (
                        "..."
                      ) : (
                        <>
                          Join
                          <FaArrowRight
                            size={7}
                            className="
                              transition-transform
                              group-hover:translate-x-0.5
                            "
                          />
                        </>
                      )}
                    </button>
                  </div>

                  {error && (
                    <p
                      className="
                        mt-2
                        text-[7px]
                        font-medium
                        text-orange-400
                      "
                    >
                      {error}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ========================================
            BOTTOM BAR
        ======================================== */}

        <div
          className="
            mx-4
            flex
            flex-col
            gap-3
            border-t
            border-white/[0.06]
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            lg:mx-5
          "
        >
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-2
              gap-y-1
              text-[8px]
              text-white/25
            "
          >
            <span>
              © {new Date().getFullYear()}
            </span>

            <span className="text-white/10">•</span>

            <span
              className="
                font-semibold
                text-white/50
              "
            >
              Mecatronix Software Development
            </span>

            <span className="hidden text-white/10 sm:inline">
              •
            </span>

            <span className="hidden sm:inline">
              Coimbatore
            </span>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                flex
                items-center
                gap-1.5
                text-[7px]
                uppercase
                tracking-[0.12em]
                text-white/25
              "
            >
              <span
                className="
                  h-[5px]
                  w-[5px]
                  rounded-full
                  bg-emerald-500
                  shadow-[0_0_7px_rgba(16,185,129,.8)]
                "
              />

              Systems operational
            </span>

            <div
              className="
                h-3
                w-px
                bg-white/[0.08]
              "
            />

            <span
              className="
                font-mono
                text-[7px]
                uppercase
                tracking-[0.1em]
                text-white/20
              "
            >
              MECA © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Foot;