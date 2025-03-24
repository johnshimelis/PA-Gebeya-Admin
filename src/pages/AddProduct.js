import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon, AddIcon } from "../icons";
import {
  Card,
  CardBody,
  Label,
  Input,
  Textarea,
  Button,
  Select,
} from "@windmill/react-ui";
import ReactSwitch from "react-switch"; // For the toggle button

const FormTitle = ({ children }) => (
  <h2 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
    {children}
  </h2>
);

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    stockQuantity: "",
    images: [], // Array to store multiple images
    discount: "", // New discount field
    videoLink: "", // New field for video link
    rating: "", // New field for star rating
  });
  const [isDiscountEnabled, setIsDiscountEnabled] = useState(false); // State for toggle button

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://pa-gebeya-backend.onrender.com/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "images") {
      // Handle multiple file uploads
      setProduct({ ...product, images: Array.from(e.target.files) });
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("shortDescription", product.shortDescription);
    formData.append("fullDescription", product.fullDescription);
    formData.append("category", product.category);
    formData.append("stockQuantity", product.stockQuantity);
    formData.append("videoLink", product.videoLink); // Append video link
    formData.append("rating", product.rating); // Append star rating

    // Append multiple images
    product.images.forEach((image) => {
      formData.append("images", image);
    });

    // Check if discount is enabled
    if (isDiscountEnabled) {
      formData.append("discount", product.discount); // Append discount percentage
      formData.append("hasDiscount", true); // Set hasDiscount to true
    } else {
      formData.append("discount", 0); // Ensure discount is 0 if not enabled
      formData.append("hasDiscount", false); // Set hasDiscount to false
    }

    try {
      const response = await fetch("https://pa-gebeya-backend.onrender.com/api/products/", {
        method: "POST",
        body: formData, // Send FormData with files and fields
      });

      if (response.ok) {
        alert("Product added successfully!");
        setProduct({
          name: "",
          price: "",
          shortDescription: "",
          fullDescription: "",
          category: "",
          stockQuantity: "",
          images: [], // Reset images array
          discount: "", // Reset discount field
          videoLink: "", // Reset video link
          rating: "", // Reset rating
        });
        setIsDiscountEnabled(false); // Reset the discount toggle to false
      } else {
        alert("Error adding product.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <PageTitle>Add New Product</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Add new Product</p>
      </div>

      <div className="w-full mt-8 grid gap-4 grid-col md:grid-cols-3">
        <Card className="row-span-2 md:col-span-2">
          <CardBody>
            <FormTitle>Product Name</FormTitle>
            <Label>
              <Input
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Type product name here"
              />
            </Label>

            <FormTitle>Product Price</FormTitle>
            <Label>
              <Input
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
                placeholder="Enter product price here"
              />
            </Label>

            <FormTitle>Short Description</FormTitle>
            <Label>
              <Textarea
                name="shortDescription"
                value={product.shortDescription}
                onChange={handleChange}
                placeholder="Enter short description"
              />
            </Label>

            <FormTitle>Full Description</FormTitle>
            <Label>
              <Textarea
                name="fullDescription"
                value={product.fullDescription}
                onChange={handleChange}
                placeholder="Enter full description"
              />
            </Label>

            <FormTitle>Category</FormTitle>
            <Label>
              <Select
                name="category"
                value={product.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </Label>

            <FormTitle>Stock Quantity</FormTitle>
            <Label>
              <Input
                name="stockQuantity"
                type="number"
                value={product.stockQuantity}
                onChange={handleChange}
                placeholder="Enter stock quantity"
              />
            </Label>

            <FormTitle>Product Images</FormTitle>
            <Label>
              <Input
                name="images"
                type="file"
                onChange={handleChange}
                multiple // Allow multiple file uploads
              />
            </Label>

            <FormTitle>Video Link</FormTitle>
            <Label>
              <Input
                name="videoLink"
                value={product.videoLink}
                onChange={handleChange}
                placeholder="Enter video link (e.g., YouTube URL)"
              />
            </Label>

            <FormTitle>Rating</FormTitle>
            <Label>
              <Input
                name="rating"
                type="number"
                value={product.rating}
                onChange={handleChange}
                placeholder="Enter star rating (0-5)"
                min="0"
                max="5"
                step="0.1"
              />
            </Label>

            {/* Toggle to enable discount input */}
            <FormTitle>Enable Discount</FormTitle>
            <Label>
              <ReactSwitch
                checked={isDiscountEnabled}
                onChange={() => setIsDiscountEnabled(!isDiscountEnabled)}
              />
            </Label>

            {/* Discount input (conditionally rendered) */}
            {isDiscountEnabled && (
              <>
                <FormTitle>Enter Discount</FormTitle>
                <Label>
                  <Input
                    name="discount"
                    type="number"
                    value={product.discount}
                    onChange={handleChange}
                    placeholder="Enter discount percentage"
                  />
                </Label>
              </>
            )}

            <Button size="large" iconLeft={AddIcon} onClick={handleSubmit}>
              Add Product
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;