import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon } from "../icons";
import response from "../utils/demo/productData";
import { Card, CardBody, Badge, Button, Avatar } from "@windmill/react-ui";
import { genRating } from "../utils/genarateRating";

const exchangeRate = 57; // 1 USD = 57 ETB (adjust if needed)

const SingleProduct = () => {
  const { id } = useParams(); // Get Product ID from URL
  const location = useLocation(); // Get product data if passed via state

  // State to store the product details
  const [product, setProduct] = useState(null);

  useEffect(() => {
    console.log("Received Product ID:", id); 
    console.log("Received Product from State:", location.state?.product); 

    if (location.state?.product) {
      // If product data is passed, use it
      setProduct(location.state.product);
    } else {
      // Otherwise, try to find the product in the static data
      const foundProduct = response.find((item) => item._id === id);
      console.log("Product Found in Response:", foundProduct);
      setProduct(foundProduct || null);
    }
  }, [id, location.state]);

  if (!product) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold mt-10">
        Product Not Found
      </div>
    );
  }

  return (
    <div>
      <PageTitle>Product Details</PageTitle>

      {/* Breadcrumb Navigation - Fixed to be on one line */}
      <div className="flex items-center text-gray-800 dark:text-gray-300 space-x-2">
        <Link to="/app/dashboard" className="text-purple-600 flex items-center space-x-1">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <span>Dashboard</span>
        </Link>
        <span>{">"}</span>
        <Link to="/app/all-products" className="text-purple-600">All Products</Link>
        <span>{">"}</span>
        <p>{product?.name}</p>
      </div>

      {/* Product Overview */}
      <Card className="my-8 shadow-md">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Product Image */}
            <div>
              <img 
                src={product?.photo} 
                alt={product?.name} 
                className="w-full rounded-lg" 
              />
            </div>

            {/* Product Details */}
            <div className="mx-8 pt-5 md:pt-0">
              <h1 className="text-3xl mb-4 font-semibold text-gray-700 dark:text-gray-200">
                {product?.name}
              </h1>

              {/* Stock Status - Fixed to show correct stock quantity */}
              <Badge type={product?.stockQuantity > 0 ? "success" : "danger"} className="mb-2">
                {product?.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
              </Badge>

              <p className="mb-2 text-sm text-gray-800 dark:text-gray-300">
                {product?.shortDescription || "No short description available."}
              </p>
              <p className="mb-3 text-sm text-gray-800 dark:text-gray-300">
                {product?.featureDescription || "No feature description available."}
              </p>

              <p className="text-sm text-gray-900 dark:text-gray-400">Product Rating</p>
              <div>{genRating(product?.rating, product?.reviews?.length || 0, 6)}</div>

              {/* Convert Price to ETB */}
              <h4 className="mt-4 text-purple-600 text-2xl font-semibold">
                {product?.price ? `ETB ${(product.price)}` : "Price Not Available"}
              </h4>
              <p className="text-sm text-gray-900 dark:text-gray-400">
                Product Quantity: {product?.stockQuantity || 0}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Product Reviews & Description */}
      <Card className="my-8 shadow-md">
        <CardBody>
          <div className="flex items-center">
            <Button className="mx-5" layout="link">
              {`Reviews (${product?.reviews?.length || 0})`}
            </Button>
            <Button layout="link">Description</Button>
            <Button layout="link">FAQ</Button>
          </div>

          <hr className="mx-3 my-2 customeDivider" />

          <div className="mx-3 mt-4">
            <p className="text-5xl text-gray-700 dark:text-gray-200">
              {product?.rating?.toFixed(1) || "0.0"}
            </p>
            {genRating(product?.rating, product?.reviews?.length || 0, 6)}

            <div className="mt-4">
              {product?.reviews?.length > 0 ? (
                product.reviews.map((review, i) => (
                  <div className="flex py-3" key={i}>
                    <Avatar className="hidden mr-3 md:block" size="large" src={review.avatar_url} />
                    <div>
                      <p className="font-medium text-lg text-gray-800 dark:text-gray-300">
                        {review.username}
                      </p>
                      {genRating(review.rate, null, 4)}
                      <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                        {review.review}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews available.</p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SingleProduct;
