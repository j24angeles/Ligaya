import React, { useState, useEffect } from 'react';
import Footer from '../common/Footer';

const Devs = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const devTeam = [
    {
      id: 1,
      name: "Joaquin Angeles",
      role: "Full Stack Developer",
      image: "/assets/dev1.png",
      bio: "Student developer passionate about building scalable web applications and exploring new technologies.",
      skills: ["React", "Kotlin", "ASP .NET", "MySQL", "PHP", "HTML/CSS"],
      github: "https://github.com/joaquindev",
      linkedin: "https://linkedin.com/in/joaquindev",
      facebook: "https://facebook.com/joaquindev",
      instagram: "https://instagram.com/joaquindev"
    },
    {
      id: 2,
      name: "Lyanna Cristobal",
      role: "Full Stack Developer",
      image: "/assets/dev2.png",
      bio: "Student developer focused on creating intuitive user interfaces and robust backend solutions.",
      skills: ["React", "Kotlin", "ASP .NET", "MySQL", "PHP", "HTML/CSS"],
      github: "https://github.com/lyannac",
      linkedin: "https://linkedin.com/in/lyannac",
      facebook: "https://facebook.com/lyannac",
      instagram: "https://instagram.com/lyannac"
    }
  ];

  // Social media icon components
  const GithubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );

  const LinkedinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
    </svg>
  );

  const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
    </svg>
  );

  const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );

  // Reusable social icon component
  const SocialIcon = ({ type, url }) => {
    let Icon;
    
    switch(type) {
      case 'github':
        Icon = GithubIcon;
        break;
      case 'linkedin':
        Icon = LinkedinIcon;
        break;
      case 'facebook':
        Icon = FacebookIcon;
        break;
      case 'instagram':
        Icon = InstagramIcon;
        break;
      default:
        Icon = GithubIcon;
    }
    
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:scale-110 transform transition-all duration-300 bg-neutral/10 hover:bg-secondary/80 text-neutral hover:text-primary p-2 rounded-full"
        aria-label={`${type} profile`}
      >
        <Icon />
      </a>
    );
  };

  // Fade-in animation class based on loading state
  const fadeIn = isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section - Compact */}
      <div className="bg-gradient-to-b from-primary/90 to-primary py-12">
        <div className="container mx-auto px-4">
          <div className={`transition-all duration-1000 ${fadeIn}`}>
            <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 text-neutral">
              The Team <span className="text-secondary">Behind</span> The Code
            </h1>
            <p className="text-xl text-center text-neutral/80 max-w-3xl mx-auto">
              Meet the student developers bringing our digital solutions to life.
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Team Section - Takes up most of the viewport */}
      <section className="flex-grow py-12 flex items-center justify-center bg-primary">
        <div className="container mx-auto px-4">
          {/* Section heading */}
          <div className={`mb-12 transition-all duration-1000 delay-200 ${fadeIn}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral">
              Meet Our Developers
            </h2>
            <div className="flex items-center justify-center mt-4">
              <span className="h-1 w-24 bg-secondary mx-2 rounded-full"></span>
            </div>
          </div>
          
          {/* Developer cards - centered */}
          <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
            {devTeam.map((dev, index) => (
              <div 
                key={dev.id}
                className={`group rounded-xl bg-accent shadow-lg hover:shadow-xl transition-all duration-500 w-full md:w-2/5 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  {/* Profile picture */}
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={dev.image} 
                      alt={dev.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = `/api/placeholder/300/300`;
                      }}
                    />
                  </div>
                  
                  {/* Role overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 to-transparent p-4">
                    <p className="text-secondary font-medium">{dev.role}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Name and bio */}
                  <h3 className="text-xl font-bold text-neutral mb-2">{dev.name}</h3>
                  <p className="text-neutral/70 text-sm mb-4">{dev.bio}</p>
                  
                  {/* Skills - showing all skills */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {dev.skills.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-primary/60 text-neutral/90 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Social links */}
                  <div className="flex gap-3 justify-center mt-4 pt-4 border-t border-neutral/10">
                    <SocialIcon type="github" url={dev.github} />
                    <SocialIcon type="linkedin" url={dev.linkedin} />
                    <SocialIcon type="facebook" url={dev.facebook} />
                    <SocialIcon type="instagram" url={dev.instagram} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Devs;