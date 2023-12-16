import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { MdOutlineManageHistory } from "react-icons/md";
import { MdReviews, MdNotificationsActive } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineCreate } from "react-icons/md";
import { BiLogOutCircle } from "react-icons/bi";
import { BsShopWindow, BsCart4 } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import LeftMenu from "./LeftMenu";
import "./sidebar.css";
let Links = [
  {
    name: "Home",
    path: "/",
    icon: <AiFillHome />,
  },
  {
    name: "Dashboard",
    path: "/dashboard",

    icon: <BsShopWindow />,
  },

  {
    name: "create",
    path: "/create",
    icon: <MdOutlineCreate />,
  },
  {
    name: "Feedback",
    path: "/dashboard",
    icon: <MdReviews />,
  },

  {
    name: "Manage",
    path: "/Manage",
    icon: <MdOutlineManageHistory />,
  },
  {
    name: "My Preference",
    path: "/user",
    icon: <MdNotificationsActive />,
  },
];

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "140px",
      padding: "20px 15px",
      transition: {
        duration: 0.2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      <div className="sidebar-container">
        <motion.div
          animate={{
            width: isOpen ? "200px" : "45px",

            transition: {
              duration: 0.2,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar `}
        >
          <div className="top_section">
            <div className="bars">
              <FaBars onClick={toggle} />
            </div>
          </div>

          <section className="routes">
            {Links.map((Links, index) => {
              if (Links.subRoutes) {
                return (
                  <LeftMenu
                    setIsOpen={setIsOpen}
                    Links={Links}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              }

              return (
                <Link
                  to={Links.path}
                  key={index}
                  className="link"
                  activeClassName="active"
                >
                  <div className="icon">{Links.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        {Links.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </section>
        </motion.div>

        <container>{children}</container>
      </div>
    </>
  );
};

export default Sidebar;
