import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon, AddIcon, PublishIcon, StoreIcon } from "../icons";
import { Card, CardBody, Label, Input, Button } from "@windmill/react-ui";

const FormTitle = ({ children }) => (
  <h2 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">{children}</h2>
);

const AddCategory = () => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Store the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", imageFile); // Append image file

    try {
      const response = await axios.post("http://localhost:5000/api/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert(response.data.message);
      setName(""); // Clear input
      setImageFile(null);
    } catch (error) {
      alert(error.response?.data?.message || "Error adding category");
    }
  };

  return (
    <div>
      <PageTitle>Add New Category</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">Dashboard</NavLink>
        </div>
        {">"}
        <p className="mx-2">Add New Category</p>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="w-full mt-8 grid gap-4 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardBody>
              <FormTitle>Category Image</FormTitle>
              <input
                type="file"
                accept="image/*"
                className="mb-4 text-gray-800 dark:text-gray-300"
                onChange={handleImageChange}
              />

              <FormTitle>Category Name</FormTitle>
              <Label>
                <Input
                  className="mb-4"
                  placeholder="Type category name here"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Label>

              <div className="w-full">
                <Button type="submit" size="large" iconLeft={AddIcon}>
                  Add Category
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="h-48">
            <CardBody>
              <div className="flex mb-8">
                <Button type="submit" layout="primary" className="mr-3" iconLeft={PublishIcon}>
                  Publish
                </Button>
                <Button layout="link" iconLeft={StoreIcon}>
                  Save as Draft
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
