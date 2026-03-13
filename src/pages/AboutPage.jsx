import React from 'react';
import { Link } from 'react-router-dom';
import LandingFooter from '../components/Landing/LandingFooter';

// Icons
import { ReactComponent as SustainabilityIcon } from '../assets/icons/sustainibility.svg';
import { ReactComponent as InnovationIcon } from '../assets/icons/Innovation.svg';
import { ReactComponent as ExcellenceIcon } from '../assets/icons/Excellence.svg';

// Images
import aboutUsHero from '../assets/images/aboutUsHero.jpg';
import legacyImg from '../assets/images/Legacy.jpg';
import swissPrecisionImg from '../assets/images/swissprecision.jpg';
import materialImg from '../assets/images/material.jpg';
import artisanalFinishImg from '../assets/images/ArtisanalFinish.png';
import visionsImg from '../assets/images/visions.jpg';
import defineStyleImg from '../assets/images/definestyle.jpg';

const AboutPage = () => {
  const coreValues = [
    {
      id: 'sustainability',
      title: "Sustainability",
      desc: "Committed to ethical sourcing and reducing our environmental footprint through conscious production.",
      icon: <SustainabilityIcon className="w-full h-full" />,
    },
    {
      id: 'innovation',
      title: "Innovation",
      desc: "Merging traditional techniques with modern technology to create products that are ahead of their time.",
      icon: <InnovationIcon className="w-full h-full" />,
    },
    {
      id: 'excellence',
      title: "Excellence",
      desc: "An uncompromising standard of quality that ensures every customer experience is truly exceptional.",
      icon: <ExcellenceIcon className="w-full h-full" />,
    }
  ];

  return (
    <div className="bg-white selection:bg-[#44D88E] selection:text-black font-['Inter',_sans-serif]">
      {/* ── Hero Section ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={aboutUsHero}
            alt="Luxury Interior"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <span className="inline-block px-5 py-2 mb-8 text-[11px] font-medium uppercase tracking-[0.5em] text-[#44D88E] border border-[#44D88E]/30 rounded-full backdrop-blur-xl bg-black/20">
            The Art of Elegance
          </span>
          <h1 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-10">
            Our Legacy <br />
            <span className="font-['Dancing_Script',_cursive] lowercase text-[#44D88E] capitalize tracking-normal ml-4 drop-shadow-2xl">Reimagined</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-light max-w-2xl mx-auto tracking-[0.05em] leading-relaxed">
            Defining the pinnacle of modern luxury living through century-old craftsmanship
            and forward-thinking design.
          </p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-5 h-5 text-[#44D88E]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7-7-7m14-8l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Our Story Section ── */}
      <section className="py-32 px-6 max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="absolute -inset-6 bg-[#44D88E]/5 rounded-[3rem] -rotate-1"></div>
            <img
              src={legacyImg}
              alt="Brand Heritage"
              className="relative rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] z-10 w-full object-cover aspect-[4/5]"
            />
          </div>

          <div className="space-y-10 lg:pl-12">
            <div className="inline-flex items-center gap-4">
              <span className="w-16 h-[1.5px] bg-[#44D88E]"></span>
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#44D88E]">Our Story</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-medium uppercase tracking-tight text-black leading-[1.1]">
              A century of <span className="italic font-light">uncompromising</span> excellence
            </h2>
            <div className="space-y-8 text-gray-500 font-normal leading-relaxed text-xl">
              <p>
                Born from a passion for design and innovation, Glamora was created to bring thoughtfully crafted products to modern lifestyles. What started as a small vision soon grew into a brand focused on quality, style, and everyday elegance.
              </p>
              <p>
                Every product we offer reflects our commitment to excellence—blending timeless design principles with the energy of contemporary living, while staying rooted in the spirit of Indian creativity and craftsmanship.
              </p>
            </div>
            <button className="group relative overflow-hidden bg-[#44D88E] text-black font-bold uppercase tracking-[0.2em] text-[11px] px-10 py-5 rounded-full hover:shadow-[0_20px_40px_-10px_rgba(68,216,142,0.4)] transition-all duration-500">
              <span className="relative z-10">Discover Our History</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </div>
        </div>
      </section>

      {/* ── Craftsmanship Section ── */}
      <section className="bg-black py-32 px-6 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#44D88E]">Mastery in Detail</span>
              <h2 className="text-4xl md:text-7xl font-light uppercase text-white tracking-tight">Meticulous <br /><span className="font-black italic">Craftsmanship</span></h2>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#44D88E]">The Glamora Standard</span>
              <div className="w-24 h-[1px] bg-[#44D88E]"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Premium Materials",
                desc: "Sourced from the most sustainable tanneries and weavers globally.",
                img: materialImg,
                label: "Material"
              },
              {
                title: "Swiss Precision",
                desc: "Engineering excellence in every mechanical component and movement.",
                img: swissPrecisionImg,
                label: "Precision"
              },
              {
                title: "Artisanal Finish",
                desc: "Hand-polished details that create a unique soul for every single item.",
                img: artisanalFinishImg,
                label: "Finishing"
              }
            ].map((item, i) => (
              <div key={i} className="group relative rounded-3xl overflow-hidden bg-[#0A0A0A]">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 p-10 space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#44D88E]">{item.label}</span>
                  <h3 className="text-2xl font-medium text-white uppercase tracking-tight">{item.title}</h3>
                  <p className="text-gray-400 text-sm font-light leading-relaxed max-w-[240px]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values Section ── */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-24 space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#44D88E]">Foundations of Luxury</span>
            <h2 className="text-4xl md:text-6xl font-light uppercase tracking-tight text-black">Our Core <span className="font-black">Values</span></h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {coreValues.map((value) => (
              <div
                key={value.id}
                className="p-16 rounded-[3rem] transition-all duration-700 group border h-full flex flex-col items-center text-center bg-white border-gray-100 hover:bg-[#44D88E] hover:border-[#44D88E] hover:shadow-[0_40px_80px_-20px_rgba(68,216,142,0.3)]"
              >
                <div className="w-20 h-20 mb-10 transition-all duration-500 text-[#44D88E] group-hover:text-white group-hover:scale-110">
                  {value.icon}
                </div>
                <h3 className="text-3xl font-medium uppercase tracking-tight mb-6 text-black">
                  {value.title}
                </h3>
                <p className="text-lg leading-relaxed font-light transition-colors duration-500 text-gray-400 group-hover:text-black/70">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visionaries Section ── */}
      <section className="py-32 px-6 bg-gray-50 overflow-hidden">
        <div className="max-w-[1440px] mx-auto space-y-24">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-24">
            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#0f172a] mb-2">The Visionaries</h2>
              </div>

              <blockquote className="text-base md:text-lg font-light leading-relaxed text-gray-500 italic tracking-tight italic">
                "Luxury is not just about what you own, but how it makes you feel. We created Glamora to be an extension of one's personal identity and values."
              </blockquote>

              <div className="pt-4 space-y-1">
                <p className="font-bold text-xl text-[#44D88E]">Kalyani & Madhavi Mehta</p>
                <p className="text-sm text-gray-400 font-medium">Co-Founders & Creative Directors</p>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-10 bg-[#44D88E]/10 rounded-full blur-[100px] z-0"></div>
              <div className="relative rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-30px_rgba(0,0,0,0.3)] z-10">
                <img
                  src={visionsImg}
                  alt="Kalyani & Madhavi Mehta"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative h-[70vh] flex items-center justify-center text-center px-6 mx-6 mb-16 rounded-[4rem] overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img
            src={defineStyleImg}
            alt="Luxury Lifestyle"
            className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 space-y-12">
          <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
            Ready to define <br />
            <span className="text-[#44D88E]">your style?</span>
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-xl font-light tracking-wide leading-relaxed">
            Explore our latest seasonal collections and experience the true meaning of Glamora heritage.
          </p>
          <Link
            to="/homepage"
            className="inline-block px-14 py-6 bg-[#44D88E] text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-full hover:bg-white hover:text-black hover:scale-105 transition-all duration-500 shadow-2xl"
          >
            Explore Collections
          </Link>
        </div>
      </section>

      <LandingFooter />

      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
