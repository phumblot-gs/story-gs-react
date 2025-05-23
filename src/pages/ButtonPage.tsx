
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ButtonTestSection from "./test/ButtonTestSection";

const ButtonPage: React.FC = () => {
  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Button Test</h1>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
      <ButtonTestSection />
    </div>
  );
};

export default ButtonPage;
