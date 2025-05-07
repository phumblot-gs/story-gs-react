
import React from "react";
import { Button } from "@/components/ui/button";
import { useCustomTheme } from "@/contexts/ThemeContext";
import { Settings, Palette, RotateCcw } from "lucide-react";

const ThemeSwitcher: React.FC = () => {
  const { resetCustomization } = useCustomTheme();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span className="text-sm">Personnalisation du thème</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => resetCustomization()}
          title="Réinitialiser le thème"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.href = '/theme-customizer'}
          className="w-full flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          <span>Configurer</span>
        </Button>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
