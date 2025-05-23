
import React from "react";
import { Button } from "@/components/ui/button";
import { useCustomTheme } from "@/contexts/ThemeContext";
import { Palette, RotateCcw } from "lucide-react";

const ThemeSwitcher: React.FC = () => {
  const { resetCustomization } = useCustomTheme();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span className="text-sm">Personnalisation du thème</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="h-8 w-8 p-0"
            size="small"
            onClick={() => resetCustomization()}
            title="Réinitialiser le thème"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
