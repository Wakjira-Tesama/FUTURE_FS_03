import { Instagram, Youtube, Twitter, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => (
  <footer id="contact" className="border-t border-border/30 py-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-10">
        <div>
          <a href="#" className="text-2xl font-black tracking-tight">
            <span className="gradient-text">APEX</span>
            <span className="text-foreground">FIT</span>
          </a>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            The smartest fitness platform. Train smarter, live stronger.
          </p>
          <div className="flex gap-3 mt-4">
            {[{ Icon: Instagram, url: "https://instagram.com" }, { Icon: Youtube, url: "https://youtube.com" }, { Icon: Twitter, url: "https://twitter.com" }].map(({ Icon, url }, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 glass-card flex items-center justify-center rounded-lg hover:border-primary/40 transition-colors">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[{ label: "Programs", href: "#programs" }, { label: "Pricing", href: "#pricing" }, { label: "Trainers", href: "#trainers" }, { label: "Testimonials", href: "#testimonials" }, { label: "Contact", href: "#contact" }].map((l) => (
              <li key={l.label}><a href={l.href} className="hover:text-foreground transition-colors">{l.label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-4">Programs</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {["Strength Training", "Cardio", "CrossFit", "Yoga", "Nutrition"].map((l) => (
              <li key={l}><a href="#programs" className="hover:text-foreground transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> 123 Fitness St, City</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /><a href="tel:+15551234567" className="hover:text-foreground transition-colors">+1 (555) 123-4567</a></li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /><a href="mailto:hello@apexfit.com" className="hover:text-foreground transition-colors">hello@apexfit.com</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/30 mt-12 pt-6 text-center text-xs text-muted-foreground">
        © 2026 ApexFit. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
