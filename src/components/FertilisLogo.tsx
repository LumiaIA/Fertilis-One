import { Leaf } from "lucide-react";

const FertilisLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 text-white [&_h1]:text-white [&_p]:text-white/90 ${className}`}>
      <div className="relative">
        <div className="bg-gradient-primary p-3 rounded-xl shadow-glow">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-yellow rounded-full border-2 border-background"></div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Fertilis One
        </h1>
        <p className="text-sm text-white/90 font-medium">
          Sistema Inteligente Industrial
        </p>
      </div>
    </div>
  );
};

export default FertilisLogo;