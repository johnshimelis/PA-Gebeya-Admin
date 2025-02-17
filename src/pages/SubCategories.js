import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon, AddIcon, PublishIcon, StoreIcon } from "../icons";
import {
  Card,
  CardBody,
  Label,
  Input,
  Button,
  Select,
} from "@windmill/react-ui";

const FormTitle = ({ children }) => (
  <h2 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
    {children}
  </h2>
);

const SubCategories = () => {
  const [subCategoryName, setSubCategoryName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  // Example categories - Replace this with dynamic data from your API
  const categories = ["Electronics", "Fashion", "Home Appliances", "Books"];

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (API call, state update, etc.)
    console.log("SubCategory Name:", subCategoryName);
    console.log("Category:", category);
    console.log("Image:", image);
  };

  return (
    <div>
      <PageTitle>Add New Subcategory</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Add New Subcategory</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="w-full mt-8 grid gap-4 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardBody>
              <FormTitle>Subcategory Image</FormTitle>
              <input type="file" className="mb-4 text-gray-800 dark:text-gray-300" onChange={handleImageChange} />

              <FormTitle>Subcategory Name</FormTitle>
              <Label>
                <Input
                  className="mb-4"
                  placeholder="Type subcategory name here"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                />
              </Label>

              <FormTitle>Parent Category</FormTitle>
              <Label>
                <Select className="mb-4" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </Label>

              <div className="w-full">
                <Button size="large" iconLeft={AddIcon} type="submit">
                  Add Subcategory
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="h-48">
            <CardBody>
              <div className="flex mb-8">
                <Button layout="primary" className="mr-3" iconLeft={PublishIcon}>
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

export default SubCategories;
