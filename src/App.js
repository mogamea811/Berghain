import React, { useState } from "react";
import AddActivityForm from "./components/AddActivityForm.tsx";
import ActivityUploader from "./components/ActivityUploaderFromFile.tsx";
import ImageSelector from "./components/ImageSelector.tsx";
import ImageFinder from "./components/GetImagesFromGyg.tsx";
import ActivityPatcher from "./components/ActivityPatcher.tsx";
import ActivityFinder from "./components/GetImagesFromGyg.tsx";

function App() {
  const [activeComponent, setActiveComponent] = useState("uploader");
const batchData = [
  {
    "activityId": "68432e675c694d22887d41e5", // Fondation Louis Vuitton
    "field": "subcategory",
    "value": "museum"
  },
  {
    "activityId": "68432e675c694d22887d41e6", // The Centre Pompidou
    "field": "subcategory",
    "value": "museum"
  },
  {
    "activityId": "68432e675c694d22887d41e7", // Parc zoologique de Paris
    "field": "subcategory",
    "value": "zoo"
  },
  {
    "activityId": "68432e675c694d22887d41e8", // Musée Marmottan Monet
    "field": "subcategory",
    "value": "museum"
  },
  {
    "activityId": "68432e675c694d22887d41e9", // Gallery of Evolution
    "field": "subcategory",
    "value": "museum"
  },
  {
    "activityId": "68432e675c694d22887d41ea", // Aquarium de Paris
    "field": "subcategory",
    "value": "aquarium"
  },
  {
    "activityId": "68432e675c694d22887d41eb", // Château de Fontainebleau
    "field": "subcategory",
    "value": "Castle "
  },
  {
    "activityId": "68432e675c694d22887d41ec", // Musée Banksy - Paris
    "field": "subcategory",
    "value": "museum"
  }
]
  const renderComponent = () => {
    switch (activeComponent) {
      case "uploader":
        return <ActivityUploader />;
      case "selector":
        return <ImageSelector />;
      case "finder":
        return <ImageFinder />;
      case "patcher":
        return (
          <ActivityPatcher
            mode="batch"
            batchData={batchData}
          />
        );
      case"gygImage":
      return <ActivityFinder></ActivityFinder>
      default:
        return <ActivityUploader />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Internal Admin Tool</h1>

      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeComponent === "uploader"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveComponent("uploader")}
        >
          Activity Uploader
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeComponent === "finder"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveComponent("gygImage")}
        >
          Activity Finder
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeComponent === "selector"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveComponent("selector")}
        >
          Image Selector
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeComponent === "finder"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveComponent("finder")}
        >
          Image Finder
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeComponent === "patcher"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveComponent("patcher")}
        >
          Activity Patcher
        </button>
      </div>

      <div className="mt-4">{renderComponent()}</div>
    </div>
  );
}

export default App;
