import React, { useState } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Card, CardBody, Button, Label } from "@windmill/react-ui";

const Ads = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleImageUpload = () => {
    alert("Image uploaded successfully!");
  };

  return (
    <div>
      <PageTitle>Manage Ads</PageTitle>

      <Card className="shadow-md">
        <CardBody>
          <Label className="block text-sm">
            <span className="text-gray-700 dark:text-gray-400">Upload Ad Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full mt-1 text-sm form-input"
            />
          </Label>

          {selectedImage && (
            <div className="mt-4">
              <img
                src={selectedImage}
                alt="Selected Ad"
                className="w-full h-64 object-cover rounded-md"
              />
            </div>
          )}

          <Button className="mt-4" onClick={handleImageUpload}>
            Upload Ad
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Ads;
