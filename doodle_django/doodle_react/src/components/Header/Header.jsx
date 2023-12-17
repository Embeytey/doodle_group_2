import React, { useRef, useEffect } from "react";
import "./header.css";
import { NavLink, Link } from "react-router-dom";
import Unical from "../images/logo.png";

const NAV__LINKS = [
  {
    display: "Home",
    url: "/",
  },
  {
    display: "login",
    url: "/login",
  },
  {
    display: "logout",
    url: "/logout",
  },
  {
    display: "Dashboard",
    url: "/dashboard",
  },
  {
    display: "Create",
    url: "/create",
  },
  // {
  //   display: "Contact",
  //   url: "/contact",
  // },
];

const user = JSON.parse(sessionStorage.getItem("user"));

const getUserInfo = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!!user) {
    return (
      <div>
        {user.username}
        {user.email}
      </div>
    );
  } else return <div></div>;
};

const Header = () => {
  const navigationbuttonhadler = () => {
    console.log("Market Clicked");
  };
  const headerRef = useRef(null);

  const menuRef = useRef(null);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList?.add("header__shrink", null);
      } else {
        headerRef.current.classList?.remove("header__shrink", null);
      }
    });

    return () => {
      window.removeEventListener("scroll", null);
    };
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("active__menu");

  return (
    <header className="header" ref={headerRef}>
      <div>
        <div className="navigation">
          <Link to="/" style={{ textDecoration: "none" }}>
            <div className="logo">
              <h2
                className=" d-flex gap-2 align-items-center "
                style={{ color: "inherit", textDecoration: "inherit" }}>
                <img className="image" src={Unical} alt="unical" />
                Doodle Meet
              </h2>
            </div>
          </Link>

          <div className="nav__menu" ref={menuRef} onClick={toggleMenu}>
            <ul className="nav__list">
              {NAV__LINKS.map((item, index) => (
                <li className="nav__item" key={index}>
                  <NavLink
                    to={item.url}
                    className={(navClass) =>
                      navClass.isActive ? "active" : ""
                    }>
                    {item.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav__right d-flex align-items-center gap-5 ">
            <span className="mobile__menu">
              <i className="ri-menu-line" onClick={toggleMenu}></i>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
