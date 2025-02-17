import React from "react";
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
} from "@windmill/react-ui";

const FormTitle = ({ children }) => {
  return (
    <h2 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
      {children}
    </h2>
  );
};

const AddCategory = () => {
  return (
    <div>
      <PageTitle>Add New Category</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Add New Category</p>
      </div>

      <div className="w-full mt-8 grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardBody>
            <FormTitle>Category Image</FormTitle>
            <input type="file" className="mb-4 text-gray-800 dark:text-gray-300" />

            <FormTitle>Category Name</FormTitle>
            <Label>
              <Input className="mb-4" placeholder="Type category name here" />
            </Label>

            <div className="w-full">
              <Button size="large" iconLeft={AddIcon}>
                Add Category
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
    </div>
  );
};

export default AddCategory;
