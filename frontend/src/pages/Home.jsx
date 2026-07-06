import Hero from "../components/Hero/Hero";
import Stats from "../components/Stats/Stats";
import Features from "../components/Features/Features";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import Testimonials from "../components/Testimonials/Testimonials";
import CTA from "../components/CTA/CTA";
import Footer from "../components/Footer/Footer";
import { useNotifications } from "../context/NotificationContext";
import "./Home.css";

function Home() {
  const { unreadCount } = useNotifications();

  return (
    <>
      {/* Home Notification Banner */}
      {unreadCount > 0 && (
        <div className="home-notification-banner">
          <div className="banner-content">
            <span className="banner-icon">🔔</span>
            <span className="banner-text">
              You have <strong>{unreadCount}</strong> new notification{unreadCount > 1 ? 's' : ''}!
            </span>
            <a href="/contact" className="banner-link">
              View All → 
            </a>
            <button 
              className="banner-close"
              onClick={(e) => {
                e.target.closest('.home-notification-banner').style.display = 'none';
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}

export default Home;