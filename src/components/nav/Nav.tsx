"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { NAV, subtitles } from "../../helper/data_help";
import Img_Helper from "../../helper/img_help";
import mecatronixConfig from "../../config/envConfig";
import Icons from "../../helper/icon_help";

const {
  FaRocket,
  FaShieldAlt,
  FaHeadset,
  FaArrowRight,
  FaPhone,
  FaWhatsapp,
} = Icons;

const MEGA_MENU_ID = "/mk";

const megaMenuItems = [
  {
    title: "Automation",
    icon: FaRocket,
    code: "01",
    desc: "Smart industrial automation",
    href: "/mk/automation",
  },
  {
    title: "Robotics",
    icon: FaShieldAlt,
    code: "02",
    desc: "Intelligent robotic systems",
    href: "/mk/robotics",
  },
  {
    title: "Smart IoT",
    icon: FaHeadset,
    code: "03",
    desc: "Connected IoT solutions",
    href: "/mk/iot",
  },
];

const Nav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { contact } = mecatronixConfig;

  const PRIMARY_PHONE =
    contact.primaryPhone || "+91000000000";

  const WHATSAPP_NUMBER =
    contact.whatsappNumber || PRIMARY_PHONE;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Subtitle rotation */
  useEffect(() => {
    if (!subtitles.length) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % subtitles.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, []);

  /* Scroll detection */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close menu after navigation */
  useEffect(() => {
    setMobileOpen(false);
    setHoveredNav(null);
  }, [pathname]);

  const handleLogoClick = useCallback(() => {
    router.push("/");
  }, [router]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className="
          fixed
          left-0
          top-0
          z-50
          w-full
          px-3
          pt-3
          sm:px-4
          lg:px-6
        "
      >
        {/* MAIN FLOATING GLASS NAVBAR */}
        <div
          className={`
            relative
            mx-auto
            max-w-[1420px]
            overflow-visible
            rounded-[20px]
            border
            transition-all
            duration-500

            ${
              isScrolled
                ? `
                  border-white/[0.10]
                  bg-black/70
                  shadow-[0_14px_50px_rgba(0,0,0,0.45)]
                  backdrop-blur-[24px]
                `
                : `
                  border-white/[0.08]
                  bg-black/40
                  shadow-[0_10px_35px_rgba(0,0,0,0.25)]
                  backdrop-blur-[18px]
                `
            }
          `}
        >
          {/* GLASS REFLECTION */}
          <div
            className="
              pointer-events-none
              absolute
              inset-x-4
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-white/40
              to-transparent
            "
          />

          {/* SOFT ORANGE LIGHT */}
          <div
            className="
              pointer-events-none
              absolute
              left-[18%]
              top-[-60px]
              h-[110px]
              w-[260px]
              rounded-full
              bg-orange-500/[0.08]
              blur-[60px]
            "
          />

          <div
            className="
              relative
              flex
              h-[62px]
              items-center
              justify-between
              px-3
              sm:px-4
              lg:px-5
            "
          >
            {/* ===================================
                LOGO
            ==================================== */}
            <button
              type="button"
              onClick={handleLogoClick}
              className="
                group
                flex
                shrink-0
                items-center
                gap-3
              "
              aria-label="Mecatronix home"
            >
              <div
                className="
                  relative
                  flex
                  h-[38px]
                  w-[38px]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[12px]
                  border
                  border-white/[0.10]
                  bg-white/[0.06]
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
                  backdrop-blur-xl
                  transition-all
                  duration-300

                  group-hover:border-orange-500/30
                  group-hover:bg-orange-500/[0.08]
                "
              >
                <Image
                  src={Img_Helper.mainlogo}
                  alt="Mecatronix"
                  width={292}
                  height={352}
                  sizes="30px"
                  className="
                    h-[27px]
                    w-[27px]
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
                    -left-[70%]
                    top-0
                    h-full
                    w-[40%]
                    skew-x-[-20deg]
                    bg-white/20
                    transition-all
                    duration-700
                    group-hover:left-[140%]
                  "
                />
              </div>

              <div className="hidden sm:block">
                <div
                  className="
                    text-[16px]
                    font-black
                    uppercase
                    leading-none
                    tracking-[0.02em]
                    text-white
                  "
                >
                  Meca
                  <span className="text-orange-500">
                    tronix
                  </span>
                </div>

                <div
                  className="
                    mt-[5px]
                    flex
                    max-w-[145px]
                    items-center
                    gap-1.5
                  "
                >
                  <span
                    className="
                      h-[5px]
                      w-[5px]
                      shrink-0
                      rounded-full
                      bg-orange-500
                      shadow-[0_0_7px_rgba(249,115,22,.9)]
                    "
                  />

                  <span
                    key={currentIndex}
                    className="
                      truncate
                      font-mono
                      text-[7px]
                      uppercase
                      tracking-[0.16em]
                      text-white/40
                      animate-in
                      fade-in
                      duration-500
                    "
                  >
                    {subtitles[currentIndex]}
                  </span>
                </div>
              </div>
            </button>

            {/* ===================================
                DESKTOP NAV
            ==================================== */}
            <nav
              className="
                hidden
                flex-1
                items-center
                justify-center
                gap-1
                px-4
                xl:flex
              "
            >
              {NAV.map((nav) => {
                const active = isActive(nav.id);
                const hasMegaMenu = nav.id === MEGA_MENU_ID;

                return (
                  <div
                    key={`${nav.id}-${nav.label}`}
                    className="
                      group/nav
                      relative
                      flex
                      h-[62px]
                      items-center
                    "
                    onMouseEnter={() => {
                      if (hasMegaMenu) {
                        setHoveredNav(nav.id);
                      }
                    }}
                    onMouseLeave={() => {
                      if (hasMegaMenu) {
                        setHoveredNav(null);
                      }
                    }}
                  >
                    <Link
                      href={nav.id}
                      className={`
                        relative
                        flex
                        h-[36px]
                        items-center
                        gap-1.5
                        rounded-[11px]
                        px-3.5
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.11em]
                        transition-all
                        duration-300

                        ${
                          active
                            ? `
                              border
                              border-orange-500/20
                              bg-orange-500/[0.09]
                              text-orange-400
                              shadow-[inset_0_1px_0_rgba(255,255,255,.05)]
                            `
                            : `
                              border
                              border-transparent
                              text-white/55
                              hover:border-white/[0.08]
                              hover:bg-white/[0.055]
                              hover:text-white
                            `
                        }
                      `}
                    >
                      {nav.label}

                      {hasMegaMenu && (
                        <span
                          className={`
                            ml-0.5
                            text-[7px]
                            transition-transform
                            duration-300

                            ${
                              hoveredNav === nav.id
                                ? "rotate-180 text-orange-400"
                                : "text-white/30"
                            }
                          `}
                        >
                          ▼
                        </span>
                      )}

                      {active && (
                        <span
                          className="
                            absolute
                            -bottom-[6px]
                            left-1/2
                            h-[3px]
                            w-[3px]
                            -translate-x-1/2
                            rounded-full
                            bg-orange-500
                            shadow-[0_0_8px_rgba(249,115,22,1)]
                          "
                        />
                      )}
                    </Link>

                    {/* ===================================
                        GLASS MEGA MENU
                    ==================================== */}
                    {hasMegaMenu &&
                      hoveredNav === nav.id && (
                        <div
                          className="
                            absolute
                            left-1/2
                            top-[54px]
                            w-[460px]
                            -translate-x-1/2
                            pt-4
                          "
                        >
                          <div
                            className="
                              relative
                              overflow-hidden
                              rounded-[22px]
                              border
                              border-white/[0.10]
                              bg-[#111111]/80
                              p-2
                              shadow-[0_30px_80px_rgba(0,0,0,.6)]
                              backdrop-blur-[30px]
                              animate-in
                              fade-in
                              slide-in-from-top-2
                              duration-300
                            "
                          >
                            {/* glass reflection */}
                            <div
                              className="
                                pointer-events-none
                                absolute
                                inset-x-5
                                top-0
                                h-px
                                bg-gradient-to-r
                                from-transparent
                                via-white/40
                                to-transparent
                              "
                            />

                            {/* glowing circle */}
                            <div
                              className="
                                pointer-events-none
                                absolute
                                right-[-50px]
                                top-[-60px]
                                h-[150px]
                                w-[150px]
                                rounded-full
                                bg-orange-500/10
                                blur-[55px]
                              "
                            />

                            <div className="relative px-3 pb-2 pt-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p
                                    className="
                                      text-[7px]
                                      font-semibold
                                      uppercase
                                      tracking-[0.22em]
                                      text-orange-400
                                    "
                                  >
                                    Mecatronix Ecosystem
                                  </p>

                                  <h3
                                    className="
                                      mt-1
                                      text-[13px]
                                      font-bold
                                      text-white
                                    "
                                  >
                                    Technology Solutions
                                  </h3>
                                </div>

                                <span
                                  className="
                                    rounded-full
                                    border
                                    border-emerald-500/20
                                    bg-emerald-500/[0.07]
                                    px-2.5
                                    py-1
                                    text-[7px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-emerald-400
                                  "
                                >
                                  Live
                                </span>
                              </div>
                            </div>

                            <div
                              className="
                                relative
                                grid
                                grid-cols-3
                                gap-2
                                p-2
                              "
                            >
                              {megaMenuItems.map((item) => (
                                <Link
                                  href={item.href}
                                  key={item.code}
                                  className="
                                    group/card
                                    relative
                                    overflow-hidden
                                    rounded-[16px]
                                    border
                                    border-white/[0.07]
                                    bg-white/[0.035]
                                    p-3.5
                                    shadow-[inset_0_1px_0_rgba(255,255,255,.04)]
                                    backdrop-blur-xl
                                    transition-all
                                    duration-300

                                    hover:-translate-y-[3px]
                                    hover:border-orange-500/25
                                    hover:bg-orange-500/[0.07]
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
                                    <div
                                      className="
                                        flex
                                        h-[34px]
                                        w-[34px]
                                        items-center
                                        justify-center
                                        rounded-[11px]
                                        border
                                        border-white/[0.08]
                                        bg-black/30
                                        text-white/40
                                        transition-all

                                        group-hover/card:border-orange-500/20
                                        group-hover/card:bg-orange-500/[0.08]
                                        group-hover/card:text-orange-400
                                      "
                                    >
                                      <item.icon size={14} />
                                    </div>

                                    <span
                                      className="
                                        font-mono
                                        text-[7px]
                                        text-white/20
                                      "
                                    >
                                      {item.code}
                                    </span>
                                  </div>

                                  <h4
                                    className="
                                      text-[10px]
                                      font-bold
                                      uppercase
                                      tracking-[0.08em]
                                      text-white
                                    "
                                  >
                                    {item.title}
                                  </h4>

                                  <p
                                    className="
                                      mt-1.5
                                      text-[8px]
                                      leading-[1.6]
                                      text-white/35
                                    "
                                  >
                                    {item.desc}
                                  </p>

                                  <div
                                    className="
                                      mt-3
                                      flex
                                      items-center
                                      gap-1.5
                                      text-[7px]
                                      font-bold
                                      uppercase
                                      tracking-wider
                                      text-orange-400/60
                                      transition-colors

                                      group-hover/card:text-orange-400
                                    "
                                  >
                                    Explore
                                    <FaArrowRight
                                      className="
                                        transition-transform
                                        group-hover/card:translate-x-1
                                      "
                                    />
                                  </div>
                                </Link>
                              ))}
                            </div>

                            <Link
                              href="/mk"
                              className="
                                group
                                relative
                                mx-2
                                mb-2
                                flex
                                items-center
                                justify-between
                                rounded-[15px]
                                border
                                border-white/[0.07]
                                bg-white/[0.035]
                                px-4
                                py-3
                                transition-all

                                hover:border-orange-500/25
                                hover:bg-orange-500/[0.06]
                              "
                            >
                              <div>
                                <p
                                  className="
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.12em]
                                    text-white
                                  "
                                >
                                  View complete solutions
                                </p>

                                <p
                                  className="
                                    mt-0.5
                                    text-[7px]
                                    text-white/30
                                  "
                                >
                                  Explore all Mecatronix technologies
                                </p>
                              </div>

                              <div
                                className="
                                  flex
                                  h-8
                                  w-8
                                  items-center
                                  justify-center
                                  rounded-[10px]
                                  bg-orange-500
                                  text-black
                                  transition-transform
                                  group-hover:translate-x-1
                                "
                              >
                                <FaArrowRight size={11} />
                              </div>
                            </Link>
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}
            </nav>

            {/* ===================================
                RIGHT SECTION
            ==================================== */}
            <div
              className="
                hidden
                shrink-0
                items-center
                gap-3
                md:flex
              "
            >
              <a
                href={`tel:${PRIMARY_PHONE}`}
                className="
                  hidden
                  rounded-[11px]
                  px-3
                  py-2
                  transition-all
                  hover:bg-white/[0.04]
                  2xl:block
                "
              >
                <span
                  className="
                    block
                    text-right
                    font-mono
                    text-[6px]
                    uppercase
                    tracking-[0.18em]
                    text-white/25
                  "
                >
                  Connect
                </span>

                <span
                  className="
                    mt-0.5
                    block
                    text-[10px]
                    font-semibold
                    text-white/70
                  "
                >
                  {PRIMARY_PHONE}
                </span>
              </a>

              <Link
                href="/openline"
                className="
                  group
                  relative
                  flex
                  h-[38px]
                  items-center
                  gap-2
                  overflow-hidden
                  rounded-[12px]
                  border
                  border-orange-400/30
                  bg-gradient-to-r
                  from-orange-500
                  to-orange-600
                  px-4
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-black
                  shadow-[0_8px_24px_rgba(249,115,22,.18)]
                  transition-all
                  duration-300

                  hover:-translate-y-[1px]
                  hover:shadow-[0_12px_30px_rgba(249,115,22,.25)]
                "
              >
                <span className="relative z-10">
                  Start Project
                </span>

                <FaArrowRight
                  size={9}
                  className="
                    relative
                    z-10
                    transition-transform
                    group-hover:translate-x-1
                  "
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    -left-[70%]
                    top-0
                    h-full
                    w-[45%]
                    skew-x-[-20deg]
                    bg-white/30
                    transition-all
                    duration-700
                    group-hover:left-[140%]
                  "
                />
              </Link>
            </div>

            {/* ===================================
                MOBILE BUTTON
            ==================================== */}
            <button
              type="button"
              onClick={() =>
                setMobileOpen((prev) => !prev)
              }
              className="
                flex
                h-[38px]
                w-[38px]
                items-center
                justify-center
                rounded-[12px]
                border
                border-white/[0.10]
                bg-white/[0.05]
                backdrop-blur-xl
                transition-all

                hover:border-orange-500/30
                hover:bg-orange-500/[0.07]

                xl:hidden
              "
              aria-label="Toggle navigation"
            >
              <div className="flex w-[16px] flex-col gap-[4px]">
                <span
                  className={`
                    block
                    h-[1.5px]
                    w-full
                    rounded-full
                    bg-white
                    transition-all
                    duration-300

                    ${
                      mobileOpen
                        ? "translate-y-[5.5px] rotate-45"
                        : ""
                    }
                  `}
                />

                <span
                  className={`
                    block
                    h-[1.5px]
                    w-full
                    rounded-full
                    bg-orange-500
                    transition-all
                    duration-300

                    ${mobileOpen ? "opacity-0" : ""}
                  `}
                />

                <span
                  className={`
                    block
                    h-[1.5px]
                    w-full
                    rounded-full
                    bg-white
                    transition-all
                    duration-300

                    ${
                      mobileOpen
                        ? "-translate-y-[5.5px] -rotate-45"
                        : ""
                    }
                  `}
                />
              </div>
            </button>
          </div>

          {/* ===================================
              MOBILE MENU
          ==================================== */}
          <div
            className={`
              overflow-hidden
              transition-all
              duration-500
              xl:hidden

              ${
                mobileOpen
                  ? `
                    max-h-[650px]
                    border-t
                    border-white/[0.07]
                    opacity-100
                  `
                  : `
                    max-h-0
                    border-transparent
                    opacity-0
                  `
              }
            `}
          >
            <div className="p-3">
              <div
                className="
                  rounded-[18px]
                  border
                  border-white/[0.07]
                  bg-white/[0.03]
                  p-2
                  backdrop-blur-xl
                "
              >
                {NAV.map((nav, index) => {
                  const active = isActive(nav.id);

                  return (
                    <Link
                      key={nav.id}
                      href={nav.id}
                      className={`
                        group
                        flex
                        items-center
                        justify-between
                        rounded-[12px]
                        px-3.5
                        py-3
                        transition-all

                        ${
                          active
                            ? `
                              bg-orange-500/[0.09]
                              text-orange-400
                            `
                            : `
                              text-white/55
                              hover:bg-white/[0.05]
                              hover:text-white
                            `
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="
                            font-mono
                            text-[7px]
                            text-white/20
                          "
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span
                          className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.11em]
                          "
                        >
                          {nav.label}
                        </span>
                      </div>

                      <FaArrowRight
                        size={9}
                        className="
                          opacity-30
                          transition-all
                          group-hover:translate-x-1
                          group-hover:opacity-100
                        "
                      />
                    </Link>
                  );
                })}
              </div>

              <div
                className="
                  mt-2
                  rounded-[18px]
                  border
                  border-white/[0.07]
                  bg-white/[0.03]
                  p-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-[7px]
                        uppercase
                        tracking-[0.15em]
                        text-white/25
                      "
                    >
                      Direct contact
                    </p>

                    <a
                      href={`tel:${PRIMARY_PHONE}`}
                      className="
                        mt-1
                        block
                        text-[11px]
                        font-bold
                        text-white
                      "
                    >
                      {PRIMARY_PHONE}
                    </a>
                  </div>

                  <span
                    className="
                      h-[7px]
                      w-[7px]
                      animate-pulse
                      rounded-full
                      bg-emerald-500
                      shadow-[0_0_8px_rgba(16,185,129,.8)]
                    "
                  />
                </div>

                {/* Quick contact */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${PRIMARY_PHONE}`}
                    className="flex h-[40px] items-center justify-center gap-2 rounded-[12px] border border-white/[0.08] bg-white/[0.04] text-[9px] font-bold uppercase tracking-[0.14em] text-white/80 transition-colors hover:border-orange-500/40 hover:text-orange-300"
                  >
                    <FaPhone size={11} /> Call
                  </a>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[40px] items-center justify-center gap-2 rounded-[12px] border border-white/[0.08] bg-white/[0.04] text-[9px] font-bold uppercase tracking-[0.14em] text-white/80 transition-colors hover:border-green-500/40 hover:text-green-400"
                  >
                    <FaWhatsapp size={12} /> WhatsApp
                  </a>
                </div>

                <Link
                  href="/openline"
                  className="
                    mt-2
                    flex
                    h-[40px]
                    w-full
                    items-center
                    justify-between
                    rounded-[12px]
                    bg-orange-500
                    px-4
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.14em]
                    text-black
                  "
                >
                  Start Project

                  <FaArrowRight size={10} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-[3px]
            xl:hidden
          "
          aria-label="Close navigation"
        />
      )}
    </>
  );
};

export default Nav;