import { Link } from 'react-router-dom';
import { Shield, Users, MapPin, Clock, CheckCircle, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { serviceCategories } from '@/data/mockData';
import heroImage from '@/assets/hero-workers.jpg';

const stats = [
  { label: 'Workers Deployed', value: '2,500+' },
  { label: 'Happy Clients', value: '500+' },
  { label: 'Cities Covered', value: '15+' },
  { label: 'Years Experience', value: '10+' },
];

const features = [
  { icon: Users, title: 'Verified Workforce', desc: 'All workers are background-verified with complete documentation' },
  { icon: Clock, title: 'Quick Deployment', desc: 'Workers deployed within 24-48 hours of confirmed request' },
  { icon: MapPin, title: 'GPS Tracked', desc: 'Real-time attendance and location tracking during duty hours' },
  { icon: CheckCircle, title: 'Quality Assured', desc: 'Regular training and performance monitoring of all staff' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-bold text-lg">Hanvika Manpower</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Services</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Why Us</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>
          <Link to="/login">
            <Button size="sm">Login / Register</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="gradient-hero">
          <div className="container mx-auto px-4 py-20 md:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent mb-6">
                  Trusted by 500+ businesses
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
                  Reliable <span className="text-accent">Manpower</span> Solutions for Your Business
                </h1>
                <p className="text-lg text-primary-foreground/70 mb-8 max-w-lg">
                  From security guards to skilled labour — verified, GPS-tracked, and deployed within 48 hours. Serving Telangana & Andhra Pradesh.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/login">
                    <Button size="lg" className="gradient-accent border-0 text-accent-foreground font-semibold shadow-lg">
                      Request Workers <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <a href="https://wa.me/919876543210?text=Hi%2C%20I%20need%20manpower%20services" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                      <Phone className="w-4 h-4 mr-2" /> WhatsApp Us
                    </Button>
                  </a>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:block">
                <img src={heroImage} alt="Hanvika Manpower Team" className="rounded-2xl shadow-2xl w-full object-cover max-h-[420px]" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container mx-auto px-4 -mt-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-card rounded-xl p-5 shadow-card text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our Services</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Comprehensive manpower solutions across multiple categories</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serviceCategories.map((cat, i) => (
              <motion.div key={cat.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link to="/login"
                  className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all block group">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground">{cat.workerCount} workers</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why Choose Hanvika?</h2>
            <p className="text-muted-foreground">Industry-leading manpower management with technology-driven operations</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="p-6 rounded-xl border border-border hover:border-primary/20 transition-colors">
                <f.icon className="w-8 h-8 text-accent mb-4" />
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="gradient-hero rounded-2xl p-10 md:p-16 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">Join 500+ businesses who trust Hanvika for their manpower needs.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/login">
                <Button size="lg" className="gradient-accent border-0 text-accent-foreground font-semibold">
                  Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="tel:+919876543210">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Call: +91 98765 43210
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <Shield className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-bold">Hanvika Manpower Supply Pvt. Ltd.</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 All rights reserved. Hyderabad, Telangana, India</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
