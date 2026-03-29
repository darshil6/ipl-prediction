
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MatchSchedule from '@/components/MatchSchedule';
import PointsTable from '@/components/PointsTable';
import Categories from '@/components/Categories';
import ContactUs from '@/components/ContactUs';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      <HeroSection/>
      <MatchSchedule/>
      <PointsTable/>
      <Categories/>
      <ContactUs/>
      <Footer/>
    </div>
  );
};

export default Index;
