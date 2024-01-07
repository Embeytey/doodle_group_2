import React, { useRef, useEffect } from "react";
import "./header.css";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Unical from "../images/logo.png";

const NAV__LINKS = [
  {
    display: "login",
    url: "/login",
  },
  {
    display: "logout",
    url: "/logout",
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current?.classList.add("header__shrink");
      } else {
        headerRef.current?.classList.remove("header__shrink");
      }
    });

    return () => {
      window.removeEventListener("scroll", null);
    };
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("active__menu");

  const handleLogout = () => {
    // Clear session token
    sessionStorage.removeItem("token");

    // Redirect to home page
    navigate("/");
  };

  return (
    <header className="header" ref={headerRef}>
      <div>
        <div className="navigation">
          <Link to="/" style={{ textDecoration: "none" }}>
            <div className="logo">
              <h2
                className=" d-flex gap-2 align-items-center "
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
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
                    }
                    onClick={item.url === "/logout" ? handleLogout : null}
                  >
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
