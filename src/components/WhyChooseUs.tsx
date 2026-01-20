import { Users, Phone, Monitor } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      icon: Users,
      title: "Des Employés formés",
      description: "Les employés de nos agences sont formés et expérimentés sur le terrain: pointues, et efficaces.",
    },
    {
      icon: Phone,
      title: "Chargé de clientèle dédié 6j/7",
      description: "Notre Service Client est disponible du Lundi au Samedi par email ou par téléphone.",
    },
    {
      icon: Monitor,
      title: "Réservation & gestion en ligne",
      description: "Réservation et gestion des prestations: tout se fait en ligne !",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
          Pourquoi réserver votre ménage chez<br />Agence Ménage ?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-section-teal rounded-xl flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
