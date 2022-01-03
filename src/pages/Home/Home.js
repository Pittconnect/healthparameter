/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";
import { Link } from "react-router-dom";

import Route from "../../routes/state/types";
import IntroAnimation from "./images/intro-animation.png";
import IntroAnimation2 from "./images/intro-animation2.png";
import IntroAnimation3 from "./images/intro-animation3.png";
import ResponsiveIcon from "./images/icons/icons-96-blue/responsive.png";
import AnalysisIcon from "./images/icons/icons-96-blue/analysis.png";
import GridIcon from "./images/icons/icons-96-blue/grid.png";
import AboutCentered from "./images/desktop-frame-about-centered.png";
import About from "./images/desktop-frame-about.png";
import About2 from "./images/desktop-frame-about-2.png";
import About3 from "./images/desktop-frame-about-3.png";
import ClientsLogo1 from "./images/clients/clients-logo1.png";
import ClientsLogo2 from "./images/clients/clients-logo2.png";
import ClientsLogo3 from "./images/clients/clients-logo3.png";
import ClientsLogo4 from "./images/clients/clients-logo4.png";
import ClientsLogo5 from "./images/clients/clients-logo5.png";
import SecurityIcon from "./images/icons/icons-64-blue/security.png";
import CreditCardIcon from "./images/icons/icons-64-blue/credit-card.png";
import LocationIcon from "./images/icons/icons-64-blue/location.png";
import UsersIcon from "./images/icons/icons-64-blue/users.png";
import CalendarIcon from "./images/icons/icons-64-blue/calendar.png";
import DoctorIcon from "./images/icons/icons-64-blue/doctors.png";
import ReportsIcon from "./images/icons/icons-64-blue/reports.png";
import ChatIcon from "./images/icons/icons-64-blue/chat.png";
import LaboratoryIcon from "./images/icons/icons-64-blue/laboratory.png";
import SupportIcon from "./images/icons/icons-64-blue/support.png";
import FiltersIcon from "./images/icons/icons-64-blue/filters.png";
import MessagesSentIcon from "./images/icons/icons-64-blue/messages-sent.png";
import Avatar1 from "./images/avatar-1.jpg";
import Avatar2 from "./images/avatar-2.jpg";
import Avatar3 from "./images/avatar-3.jpg";
import FacebookIcon from "./images/social/white/facebook.png";
import LinkedinIcon from "./images/social/white/linkedin.png";
import TwitterIcon from "./images/social/white/twitter.png";

const HomePage = () => {
  return (
    <>
      <header className="header">
        <div className="header__content header__content--fluid-width">
          <div className="header__logo-title">
            medi<span>kit</span>
          </div>
          <nav className="header__menu">
            <ul>
              <li>
                <a className="selected header-link" href="#intro">
                  HOME
                </a>
              </li>
              <li>
                <a href="dashboard.html" className="header-link">
                  DASHBOARD
                </a>
              </li>
              <li className="menu-item-has-children">
                <a href="#morefeatures" className="header-link">
                  FEATURES
                </a>
                <ul className="sub-menu">
                  <li>
                    <a href="#about" className="header-link">
                      OUR PRODUCTS
                    </a>
                  </li>
                  <li>
                    <a href="#about2" className="header-link">
                      HOW IT WORKS
                    </a>
                  </li>
                  <li>
                    <a href="#clients" className="header-link">
                      OUR CLIENTS
                    </a>
                  </li>
                  <li>
                    <a href="#testimonials" className="header-link">
                      TESTIMONIALS
                    </a>
                  </li>
                  <li>
                    <a href="#support" className="header-link">
                      SUPPORT
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#pricing" className="header-link">
                  PRICING
                </a>
              </li>
              <li
                className="header__btn header__btn--signup"
                data-openpopup="signuplogin"
                data-popup="signup"
              >
                <Link
                  to={{
                    pathname: Route.SIGNUP,
                    state: {
                      modal: {
                        isOpened: true,
                      },
                    },
                  }}
                >
                  GET STARTED
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="section section--intro" id="intro">
        <div className="section__content section__content--intro">
          <div className="intro">
            <div className="intro__content animated fadeInLeft">
              <h1 className="intro__title">
                <span>Know how your body responses</span> to change
              </h1>
              <div className="intro__subtitle">
                Using the latest technologies, that measure EKG we allow you to
                track how your body responses to change Click on Get Started .
              </div>
              <div className="intro__buttons intro__buttons--left">
                <a href="index.html" className="btn btn--lightblue-bg">
                  BUY NOW
                </a>
                <a href="#about" className="btn btn--pink-bg">
                  VIEW MORE
                </a>
              </div>
            </div>
            <div className="intro__animation">
              <img
                className="animation__image1 animated fadeInRight"
                src={IntroAnimation}
                alt=""
                title=""
              />
              <img
                className="animation__image2 animated fadeInUp"
                src={IntroAnimation2}
                alt=""
                title=""
              />
              <img
                className="animation__image3 animated fadeInDown"
                src={IntroAnimation3}
                alt=""
                title=""
              />
            </div>
          </div>
        </div>

        <svg
          className="svg-intro-bottom"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M95,0 Q90,90 0,100 L100,100 100,0 Z"
            fill="#f1f6fb"
            fillOpacity="1"
          />
        </svg>
      </section>

      <section className="section section--features" id="features">
        <div className="section__content section__content--fluid-width">
          <h2 className="section__title section__title--centered">
            Key features
          </h2>
          <div className="section__description section__description--centered">
            We believe we have created the most creative Medical UI Kit existing
            on the market this time. Dashboard pages with features that will
            convince you to use it for your Medical business.
          </div>
          <div className="grid grid--features">
            <div className="grid__row">
              <div className="grid__col grid__col--13 grid__col--margin">
                <div className="grid__icon">
                  <img src={ResponsiveIcon} alt="" title="" />
                </div>
                <h3 className="grid__title">
                  <span>Mobile</span> Ready
                </h3>
                <p className="grid__text">
                  Responsive code that makes your landing page look good on all
                  devices (desktops, tablets, and phones). Created with mobile
                  specialists.
                </p>
              </div>
              <div className="grid__col grid__col--13 grid__col--margin">
                <div className="grid__icon">
                  <img src={AnalysisIcon} alt="" title="" />
                </div>
                <h3 className="grid__title">
                  Unique Medical <span>Sections</span>
                </h3>
                <p className="grid__text">
                  A perfect structure created after we analized trends in
                  Medical applications. Analysis made to the most popular
                  Medical businesses.
                </p>
              </div>
              <div className="grid__col grid__col--13 grid__col--margin">
                <div className="grid__icon">
                  <img src={GridIcon} alt="" title="" />
                </div>
                <h3 className="grid__title">
                  Smart <span>BEM</span> Grid
                </h3>
                <p className="grid__text">
                  Blocks, Elements and Modifiers. A smart HTML/CSS structure
                  that can easely be reused. Layout driven by the purpose of
                  modularity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--about" id="about">
        <div
          className="
          section__content section__content--fluid-width section__content--about
        "
        >
          <h2 className="section__title section__title--centered">
            Created with medical specialists
          </h2>
          <div className="section__description section__description--centered">
            Chart reports about your medical activity. New registered patients,
            diseases reports, countdown to medical visit, confirm and cancel
            appointment.
          </div>
          <div className="grid">
            <div className="grid__row">
              <div className="grid__col">
                <div
                  className="grid__image grid__image--center animate"
                  data-animate="fadeIn"
                  data-duration="2.0s"
                  data-delay="0.1s"
                  data-offset="100"
                >
                  <img src={AboutCentered} alt="" title="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--about" id="about">
        <div
          className="
          section__content section__content--fluid-width section__content--about
        "
        >
          <div className="grid grid--about">
            <div className="grid__row">
              <div className="grid__col grid__col--25">
                <h3 className="grid__title">
                  Easy appointment scheduling with the
                  <span>&nbsp;intelligent BEM interface</span>
                </h3>
                <p className="grid__text">
                  Blocks, Elements and Modifiers. A smart HTML/CSS structure
                  that can easely be reused. Layout driven by the purpose of
                  modularity.
                </p>
                <ul className="grid__list">
                  <li>Simple and Smart HTML code</li>
                  <li>Works reintegrated in any part of the layout</li>
                  <li>Reuse the elements from one design to another</li>
                </ul>
              </div>
              <div className="grid__col grid__col--35">
                <div className="grid__image grid__image--right">
                  <img src={About} alt="" title="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--about">
        <div
          className="
          section__content section__content--fluid-width section__content--about
        "
        >
          <div className="grid grid--about">
            <div className="grid__row">
              <div className="grid__col grid__col--25 grid__col--floated-right">
                <h3 className="grid__title">
                  Add and manage doctors with the
                  <span>&nbsp;special designed</span> sections
                </h3>
                <p className="grid__text">
                  Responsive code that makes your landing page look good on all
                  devices (desktops, tablets, and phones). Created with mobile
                  specialists.
                </p>
                <ul className="grid__list">
                  <li>Responsive code</li>
                  <li>Look good on all devices</li>
                  <li>Created with mobile specialists</li>
                </ul>
              </div>
              <div className="grid__col grid__col--35">
                <div className="grid__image grid__image--left">
                  <img src={About2} alt="" title="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--about" id="about2">
        <div
          className="
          section__content section__content--fluid-width section__content--about
        "
        >
          <div className="grid grid--about">
            <div className="grid__row">
              <div className="grid__col grid__col--25">
                <h3 className="grid__title">
                  Instant messaging with <span>chat module integration</span>.
                </h3>
                <p className="grid__text">
                  Choose between multiple unique designs and easy integrate
                  elements from one design to another. Following the latest
                  design trends.
                </p>
                <ul className="grid__list">
                  <li>Elements from one design to another</li>
                  <li>Following the latest design trends</li>
                  <li>Reuse the elements from one design to another</li>
                </ul>
              </div>
              <div className="grid__col grid__col--35">
                <div className="grid__image grid__image--right">
                  <img src={About3} alt="" title="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--clients" id="clients">
        <div className="section__content section__content--fluid-width">
          <h2
            className="
            section__title section__title--smaller section__title--centered
          "
          >
            Successfully used by
          </h2>
          <div className="grid grid--clients">
            <div className="grid__row">
              <div className="grid__col grid__col--margin grid__col--15">
                <div className="grid__client-logo">
                  <a href="#">
                    <img src={ClientsLogo1} alt="" title="" />
                  </a>
                </div>
              </div>
              <div className="grid__col grid__col--margin grid__col--15">
                <div className="grid__client-logo">
                  <a href="#">
                    <img src={ClientsLogo2} alt="" title="" />
                  </a>
                </div>
              </div>
              <div className="grid__col grid__col--margin grid__col--15">
                <div className="grid__client-logo">
                  <a href="#">
                    <img src={ClientsLogo3} alt="" title="" />
                  </a>
                </div>
              </div>
              <div className="grid__col grid__col--margin grid__col--15">
                <div className="grid__client-logo">
                  <a href="#">
                    <img src={ClientsLogo4} alt="" title="" />
                  </a>
                </div>
              </div>
              <div className="grid__col grid__col--margin grid__col--15">
                <div className="grid__client-logo">
                  <a href="#">
                    <img src={ClientsLogo5} alt="" title="" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--more-features" id="morefeatures">
        <div className="section__content section__content--fluid-width">
          <h2 className="section__title section__title--centered">
            More features
          </h2>
          <div className="section__description section__description--centered">
            We believe we have created the most creative Medical UI Kit existing
            on the market this time. Dashboard pages with features that will
            convince you to use it for your Medical business.
          </div>
          <div className="grid grid--more-features">
            <div className="grid__row">
              <div className="grid__col grid__col--margin grid__col--13">
                <div className="grid__icon">
                  <img src={SecurityIcon} alt="" title="" />
                </div>
                <h3 className="grid__title">
                  <span>Reliable </span>and secure
                </h3>
              </div>

              <div className="grid__col grid__col--margin grid__col--13">
                <div className="grid__icon">
                  <img src={CreditCardIcon} alt="" title="" />
                </div>
                <h3 className="grid__title">
                  Secure <span>payment</span>
                </h3>
              </div>

              <div className="grid__col grid__col--margin grid__col--13">
                <div className="grid__icon">
                  <img src={LocationIcon} alt="" title="" />
                </div>
                <h3 className="grid__title">
                  Location <span>detection and maps</span>
                </h3>
              </div>
            </div>
            <div className="grid__row">
              <div className="grid__col grid__col--margin grid__col--13">
                <div className="grid__icon">
                  <img src={UsersIcon} alt="" title="" />
                </div>
                <h3 className="grid__title">
                  User <span>friendly interface</span>
                </h3>
              </div>

              <div className="grid__col grid__col--margin grid__col--13">
                <div className="grid__icon">
                  <img src={CalendarIcon} alt="" title="" />
                </div>
                <h3 className="grid__title">
                  Calendar <span>widget</span>
                </h3>
              </div>
              <div className="grid__col grid__col--margin grid__col--13">
                <div className="grid__icon">
                  <img src={DoctorIcon} alt="" title="" />
                </div>
                <h3 className="grid__title">
                  <span>Add manage </span>doctors and patients
                </h3>
              </div>
            </div>
            <div className="grid__row">
              <div className="grid__col grid__col--margin grid__col--13">
                <div className="grid__icon">
                  <img src={ReportsIcon} alt="" title="" />
                </div>
                <h3 className="grid__title">
                  Charts and <span>Reports</span>
                </h3>
              </div>

              <div className="grid__col grid__col--margin grid__col--13">
                <div className="grid__icon">
                  <img src={ChatIcon} alt="" title="" />
                </div>
                <h3 className="grid__title">
                  Chat and conversations <span>module</span>
                </h3>
              </div>

              <div className="grid__col grid__col--margin grid__col--13">
                <div className="grid__icon">
                  <img src={LaboratoryIcon} alt="" title="" />
                </div>
                <h3 className="grid__title">
                  Medical <span>widgets and modules</span>
                </h3>
              </div>
            </div>
            <div className="grid__row">
              <div className="grid__col grid__col--margin grid__col--13">
                <div className="grid__icon">
                  <img src={SupportIcon} alt="" title="" />
                </div>
                <h3 className="grid__title">
                  Online <span>support</span>
                </h3>
              </div>
              <div className="grid__col grid__col--margin grid__col--13">
                <div className="grid__icon">
                  <img src={FiltersIcon} alt="" title="" />
                </div>
                <h3 className="grid__title">
                  Options and settings <span>sidebar</span>
                </h3>
              </div>
              <div className="grid__col grid__col--margin grid__col--13">
                <div className="grid__icon">
                  <img src={MessagesSentIcon} alt="" title="" />
                </div>
                <h3 className="grid__title">
                  Fast messaging <span>support</span>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="pricing">
        <div
          className="
          section__content
          section__content--fluid-width
          section__content--padding
        "
        >
          <h2 className="section__title section__title--centered">
            Simple Pricing
          </h2>
          <div className="section__description section__description--centered">
            Exclusively on Themeforest Envato Market.
            <a
              href="https://themeforest.net/licenses/standard"
              target="_blank"
              rel="noopener noreferrer"
            >
              &nbsp;Read more&nbsp;
            </a>
            about Licenses.
          </div>

          <div className="pricing">
            <div className="pricing__plan">
              <h3 className="pricing__title">Regular Licence</h3>
              <div className="pricing__values">
                <div className="pricing__value gradient-lightblue gradient-text">
                  <span>$</span>14
                </div>
              </div>
              <ul className="pricing__list">
                <li>
                  <b>1</b> Number of end products
                </li>
                <li>Use in a single end product</li>
                <li>
                  Use in a free end product
                  <span>(more than one end user allowed)</span>
                </li>
                <li>One license per each customized end product</li>
                <li className="disabled">Use in an end product that's sold</li>
                <li className="disabled">Use in stock items/templates</li>
                <li className="pricing__more">
                  <a
                    href="https://themeforest.net/licenses/terms/regular"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    More about Regular Licence
                  </a>
                </li>
              </ul>

              <a className="pricing__signup" href="">
                BUY NOW
              </a>
            </div>
            <div className="pricing__plan pricing__plan--popular">
              <h3 className="pricing__title">Extended License</h3>
              <div className="pricing__values">
                <div className="pricing__value gradient-blue gradient-text">
                  <span>$</span>850
                </div>
              </div>
              <ul className="pricing__list">
                <li>
                  <b>1</b> Number of end products
                </li>
                <li>Use in a single end product</li>
                <li>
                  Use in a free end product
                  <span>(more than one end user allowed)</span>
                </li>
                <li className="disabled">
                  One license per each customized end product
                </li>
                <li>Use in an end product that's sold</li>
                <li className="disabled">Use in stock items/templates</li>
                <li className="pricing__more">
                  <a
                    href="https://themeforest.net/licenses/terms/extended"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    More about Extended Licence
                  </a>
                </li>
              </ul>
              <a className="pricing__signup" href="">
                BUY NOW
              </a>
            </div>
          </div>

          <div className="clear"></div>
        </div>
      </section>

      <section className="section section--testimonials" id="testimonials">
        <div
          className="
          section__content
          section__content--fluid-width
          section__content--padding
        "
        >
          <h2 className="section__title section__title--centered">
            What our clients say
          </h2>
          <div className="testimonials">
            <div className="testimonials__content swiper-wrapper">
              <div className="testimonials__slide swiper-slide">
                <div
                  className="testimonials__thumb"
                  data-swiper-parallax="-50%"
                >
                  <img src={Avatar1} alt="" title="" />
                </div>
                <div
                  className="testimonials__text"
                  data-swiper-parallax="-100%"
                >
                  <p>
                    "FANTASTIC Customer support! I love the theme and it's
                    perfect for what I'm wanting. I wanted to make an element
                    have a link that wasn't originally linked and have that
                    customization and they were super helpful in making that
                    possible!
                    <br />
                    Great theme and great customer support! "
                  </p>
                </div>
                <div className="testimonials__source">
                  medical solutions&nbsp;
                  <a href="https://themeforest.net/user/smarttemplates/reviews?page=2">
                    USA
                  </a>
                </div>
              </div>
              <div className="testimonials__slide swiper-slide">
                <div
                  className="testimonials__thumb"
                  data-swiper-parallax="-50%"
                >
                  <img src={Avatar2} alt="" title="" />
                </div>
                <div
                  className="testimonials__text"
                  data-swiper-parallax="-100%"
                >
                  <p>
                    "Can praise the after-sales service enough. Communication
                    and technical help was great. Thanks guys!"
                  </p>
                </div>
                <div className="testimonials__source">
                  williak1&nbsp;
                  <a href="https://themeforest.net/user/smarttemplates/reviews?page=2">
                    Australia
                  </a>
                </div>
              </div>
              <div className="testimonials__slide swiper-slide">
                <div
                  className="testimonials__thumb"
                  data-swiper-parallax="-50%"
                >
                  <img src={Avatar3} alt="" title="" />
                </div>
                <div
                  className="testimonials__text"
                  data-swiper-parallax="-100%"
                >
                  <p>
                    "Product is easily configurable and the Customer Support has
                    been outstanding.I couldn't be happier! "
                  </p>
                </div>
                <div className="testimonials__source">
                  dluczywo&nbsp;
                  <a href="https://themeforest.net/user/smarttemplates/reviews?page=2">
                    United Kingdom
                  </a>
                </div>
              </div>
            </div>

            <div className="testimonials__pagination swiper-pagination"></div>
          </div>
          <div className="clear"></div>
        </div>
      </section>

      <section className="section section--support" id="support">
        <div
          className="
          section__content
          section__content--fluid-width
          section__content--padding
        "
        >
          <div className="grid grid--support">
            <div className="grid__row">
              <div className="grid__col">
                <h3 className="grid__title">Get started for free today!</h3>
                <p className="grid__text">
                  Find out what MEDIKIT can do for your business
                </p>
              </div>
              <div className="grid__col">
                <a href="#" className="grid__more">
                  REQUEST A FREE DEMO
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer" id="footer">
        <div
          className="
          footer__content footer__content--fluid-width footer__content--padding
        "
        >
          <div className="grid grid--footer">
            <div className="grid__row">
              <div className="grid__col grid__col--margin grid__col--25">
                <h3 className="grid__title grid__title--footer-logo">
                  MEDIKIT
                </h3>
                <p className="grid__text grid__text--copyright">
                  Copyright &copy; 2018 SmartTemplate.net. <br />
                  All Rights Reserved.
                </p>
                <ul className="grid__list grid__list--sicons">
                  <li>
                    <a href="#">
                      <img src={TwitterIcon} alt="" title="" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src={FacebookIcon} alt="" title="" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src={LinkedinIcon} alt="" title="" />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="grid__col grid__col--margin grid__col--15">
                <h3 className="grid__title grid__title--footer">Company</h3>
                <ul className="grid__list grid__list--fmenu">
                  <li>
                    <a href="#">About</a>
                  </li>
                  <li>
                    <a href="#">Carrers</a>
                  </li>
                  <li>
                    <a href="#">Awards</a>
                  </li>
                  <li>
                    <a href="#">Users Program</a>
                  </li>
                  <li>
                    <a href="#">Locations</a>
                  </li>
                </ul>
              </div>
              <div className="grid__col grid__col--margin grid__col--15">
                <h3 className="grid__title grid__title--footer">Products</h3>
                <ul className="grid__list grid__list--fmenu">
                  <li>
                    <a href="#">Integrations</a>
                  </li>
                  <li>
                    <a href="#">API</a>
                  </li>
                  <li>
                    <a href="#">Pricing</a>
                  </li>
                  <li>
                    <a href="#">Documentation</a>
                  </li>
                  <li>
                    <a href="#">Release Notes</a>
                  </li>
                </ul>
              </div>
              <div className="grid__col grid__col--margin grid__col--15">
                <h3 className="grid__title grid__title--footer">Support</h3>
                <ul className="grid__list grid__list--fmenu">
                  <li>
                    <a href="#">Contact</a>
                  </li>
                  <li>
                    <a href="#">FAQ</a>
                  </li>
                  <li>
                    <a href="#">Press</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
