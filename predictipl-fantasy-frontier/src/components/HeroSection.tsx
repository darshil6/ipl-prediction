
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  return (
    <div className="relative h-[80vh] w-full overflow-hidden mt-16">
      {/* Background image with lazy loading */}
      <div className="absolute inset-0 bg-ipl-blue/20 z-0">
        <img
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
          alt="Cricket Stadium"
          className={`object-cover w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          onLoad={() => setIsLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 text-white p-8 md:p-16 z-10">
        <div
          className={`max-w-4xl transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
        >
          <span className="inline-block bg-ipl-orange px-3 py-1 text-sm font-medium rounded-full mb-4 animate-pulse-subtle">
            IPL 2026 Predictions
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance leading-tight">
            Predict, Play & Win with <span className="text-ipl-orange">PredictIPL</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mb-8 text-balance">
            Use advanced AI predictions to forecast match outcomes, create your fantasy team, and compete with cricket fans around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => navigate('/winnings')} className="bg-ipl-orange hover:bg-ipl-orange/90 text-white py-3 px-8 rounded-full font-medium transition-all hover:shadow-lg hover:scale-105">
              Start Predicting
            </button>
            {/* <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white py-3 px-8 rounded-full font-medium transition-all hover:shadow-lg">
              Learn More
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
