import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Mail } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-16 px-4 bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-3">
          Besoin d'aide pour trouver le bon service ?
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-8">
          Notre équipe est à votre écoute pour vous accompagner.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://www.agencemenage.ma/contact" target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" className="rounded-full" size="lg">
              <Phone className="w-4 h-4 mr-2" />
              Nous contacter
            </Button>
          </a>
          <a href="https://www.agencemenage.ma/contact" target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" className="rounded-full" size="lg">
              <MessageCircle className="w-4 h-4 mr-2" />
              Être rappelé
            </Button>
          </a>
          <a href="https://www.agencemenage.ma/contact" target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" className="rounded-full" size="lg">
              <Mail className="w-4 h-4 mr-2" />
              Envoyer une demande
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
