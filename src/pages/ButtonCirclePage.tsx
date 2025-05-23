
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ButtonTestSection from "./test/ButtonTestSection";

const ButtonCirclePage: React.FC = () => {
  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Button Circle Test</h1>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
      {/* Only show the Circle Button section */}
      <div className="space-y-8">
        <ButtonTestSection />
      </div>
    </div>
  );
};

export default ButtonCirclePage;
