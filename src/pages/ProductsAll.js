import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Link, NavLink, useHistory } from "react-router-dom";
import {
  EditIcon,
  EyeIcon,
  GridViewIcon,
  HomeIcon,
  ListViewIcon,
  TrashIcon,
} from "../icons";
import {
  Card,
  CardBody,
  Label,
  Select,
  Button,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import response from "../utils/demo/productData";
import Icon from "../components/Icon";
import { genRating } from "../utils/genarateRating";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from "react-responsive-carousel"; // Import Carousel component

// Function to generate yellow stars based on rating
const renderRatingStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={i} className="text-yellow-400">&#9733;</span>); // Full star
  }

  if (hasHalfStar) {
    stars.push(<span key="half" className="text-yellow-400">&#9734;</span>); // Half star
  }

  return stars;
};

const ProductsAll = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditProduct, setSelectedEditProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeleteProduct, setSelectedDeleteProduct] = useState(null);
  const history = useHistory();

  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  // Fetch products and categories
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(`https://pa-gebeya-backend.onrender.com/api/products/`);
        const products = await res.json();
        setData(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const res = await fetch(`https://pa-gebeya-backend.onrender.com/api/categories`);
        const categories = await res.json();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchProducts();
    fetchCategories();
  }, []);

  // Handle sorting
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Handle category filter
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle search by product name
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter and sort data
  const filteredData = data
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) =>
      selectedCategory ? product.category._id === selectedCategory : true
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

  const totalResults = filteredData.length;

  // Pagination change control
  const onPageChange = (p) => {
    setPage(p);
  };

  // Open edit modal
  const openEditModal = (product) => {
    if (product && product._id) {
      setSelectedEditProduct({
        ...product,
        qty: product.stockQuantity,
      });
      setIsEditModalOpen(true);
    } else {
      console.error("Product ID is undefined!", product);
    }
  };

  // Handle edit changes
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo" && files && files[0]) {
      const file = files[0];
      setSelectedEditProduct((prev) => ({
        ...prev,
        photo: URL.createObjectURL(file),
        image: file,
      }));
    } else {
      const updatedValue = name === "qty" || name === "discount" ? parseFloat(value) : value;
      setSelectedEditProduct((prev) => ({
        ...prev,
        [name]: updatedValue,
        status: name === "qty" ? (updatedValue > 0 ? "In Stock" : "Out of Stock") : prev.status,
        hasDiscount: name === "discount" ? updatedValue > 0 : prev.hasDiscount,
      }));
    }
  };

  // Save product changes
  const saveProductChanges = async (productId, updatedData) => {
    if (!productId) {
      console.error("Product ID is undefined!");
      return;
    }

    const formData = new FormData();
    formData.append("name", updatedData.name);
    formData.append("price", updatedData.price);
    formData.append("stockQuantity", updatedData.qty);
    formData.append("shortDescription", updatedData.shortDescription);
    formData.append("discount", updatedData.discount);
    formData.append("hasDiscount", updatedData.hasDiscount ? "true" : "false");

    if (updatedData.image instanceof File) {
      formData.append("image", updatedData.image);
    }

    try {
      const response = await fetch(`https://pa-gebeya-backend.onrender.com/api/products/${productId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const { product: updatedProduct } = await response.json();
      setData((prevData) =>
        prevData.map((product) =>
          product._id === productId
            ? {
                ...product,
                ...updatedProduct,
                photo: updatedProduct.photo,
              }
            : product
        )
      );

      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    if (!productId) {
      console.error("Product ID is undefined!");
      return;
    }

    try {
      const response = await fetch(`https://pa-gebeya-backend.onrender.com/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setData((prevData) => prevData.filter((product) => product._id !== productId));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Open delete modal
  const openModal = (productId) => {
    const product = data.find((product) => product._id === productId);
    if (!product) {
      console.error("Product not found!");
      return;
    }

    setSelectedDeleteProduct(product);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Toggle view between grid and list
  const handleChangeView = () => {
    setView(view === "list" ? "grid" : "list");
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
      <PageTitle>All Products</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">All Products</p>
      </div>

      {/* Sort, Filter, and Search */}
      <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All Products
              </p>

              <Label className="mx-3">
                <Select className="py-3" onChange={handleSortChange}>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </Select>
              </Label>

              <Label className="mx-3">
                <Select className="py-3" onChange={handleCategoryChange}>
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Label>

              <Label className="mx-3">
                <input
                  type="text"
                  placeholder="Search by product name"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="py-3 px-4 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                />
              </Label>

              <Label className="mr-8">
                <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                  <input
                    className="py-3 pr-5 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                    placeholder="Number of Results"
                    value={resultsPerPage}
                    onChange={(e) => setResultsPerPage(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center mr-3 pointer-events-none">
                    Results on {`${view}`}
                  </div>
                </div>
              </Label>
            </div>
            <div className="">
              <Button
                icon={view === "list" ? ListViewIcon : GridViewIcon}
                className="p-2"
                aria-label="Edit"
                onClick={handleChangeView}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="max-h-[90vh] overflow-y-auto bg-white shadow-lg rounded-lg p-6 w-[800px]"
      >
        <ModalHeader>Edit Product</ModalHeader>
        <ModalBody>
          {selectedEditProduct && (
            <div className="grid grid-cols-2 gap-4">
              <Label>
                <span>Product Name</span>
                <input
                  name="name"
                  value={selectedEditProduct.name || ""}
                  onChange={handleEditChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </Label>

              <Label>
                <span>Price</span>
                <input
                  name="price"
                  type="text"
                  value={selectedEditProduct.price || ""}
                  onChange={handleEditChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </Label>

              <Label>
                <span>Quantity (QTY)</span>
                <input
                  name="qty"
                  type="number"
                  value={selectedEditProduct.qty !== undefined ? selectedEditProduct.qty : ""}
                  onChange={handleEditChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </Label>

              <Label>
                <span>Status</span>
                <select
                  name="status"
                  value={selectedEditProduct.qty > 0 ? "In Stock" : "Out of Stock"}
                  className="w-full mt-1 p-2 border rounded"
                  disabled
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </Label>

              <div className="col-span-2">
                <Label>
                  <span>Short Description</span>
                  <textarea
                    name="shortDescription"
                    value={selectedEditProduct.shortDescription || ""}
                    onChange={handleEditChange}
                    className="w-full mt-1 p-2 border rounded"
                    rows="3"
                  />
                </Label>
              </div>

              <div className="col-span-2">
                <Label>
                  <span>Discount</span>
                  <div className="flex items-center space-x-2">
                    <input
                      name="discount"
                      type="number"
                      value={selectedEditProduct.discount || ""}
                      onChange={handleEditChange}
                      className="w-1/2 mt-1 p-2 border rounded"
                    />
                    {selectedEditProduct.hasDiscount && selectedEditProduct.discount > 0 && (
                      <span className="text-green-500">Discount Applied</span>
                    )}
                  </div>
                </Label>
              </div>

              <div className="col-span-2">
                <Label>
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    name="photo"
                    onChange={handleEditChange}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </Label>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              if (selectedEditProduct) {
                saveProductChanges(selectedEditProduct._id, selectedEditProduct);
              }
            }}
            icon={EditIcon}
            aria-label="Save changes"
          >
            Save Changes
          </Button>
          <Button
            onClick={() => setIsEditModalOpen(false)}
            aria-label="Cancel"
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Product Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Delete Product</ModalHeader>
        <ModalBody>
          Are you sure you want to delete{" "}
          {selectedDeleteProduct && `"${selectedDeleteProduct.name}"`}?
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={() => deleteProduct(selectedDeleteProduct._id)}>Delete</Button>
        </ModalFooter>
      </Modal>

      {/* Product Views */}
      {view === "list" ? (
        <>
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock Quantity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData
                  .slice((page - 1) * resultsPerPage, page * resultsPerPage)
                  .map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <Carousel showThumbs={false} showStatus={false} dynamicHeight>
                          {product.images && product.images.length > 0 ? (
                            product.images.map((image, index) => (
                              <div key={index}>
                                <img src={image} alt={`Product ${index}`} />
                              </div>
                            ))
                          ) : (
                            <div>
                              <img src="../icons/megaphone.png" alt="Placeholder" />
                            </div>
                          )}
                        </Carousel>
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.stockQuantity}</TableCell>
                      <TableCell>
                        <Badge type={product.stockQuantity > 0 ? "success" : "danger"}>
                          {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {renderRatingStars(product.rating)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link
                            to={{
                              pathname: `/app/product/${product._id}`,
                              state: { product },
                            }}
                          >
                            <Button
                              icon={EyeIcon}
                              className="mr-3 p-2"
                              aria-label="Preview"
                              size="small"
                            />
                          </Link>
                          <Button
                            icon={EditIcon}
                            onClick={() => openEditModal(product)}
                            className="p-2"
                            size="small"
                          />
                          <Button
                            icon={TrashIcon}
                            onClick={() => openModal(product._id)}
                            className="p-2"
                            size="small"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                onChange={onPageChange}
              />
            </TableFooter>
          </TableContainer>
        </>
      ) : (
        <>
          {/* Grid View */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
            {filteredData
              .slice((page - 1) * resultsPerPage, page * resultsPerPage)
              .map((product) => {
                const hasDiscount = product.discount && product.discount > 0;
                const discountAmount = hasDiscount ? (product.price * product.discount) / 100 : 0;
                const finalPrice = product.price - discountAmount;

                const formatPrice = (price) => parseFloat(price.toFixed(2)).toString();

                return (
                  <div className="" key={product._id}>
                    <Card>
                      {/* TikTok Icon for Video Link */}
                      {product.videoLink && (
                        <div className="absolute top-2 right-2">
                          <img
                            src="../icons/tiktok.png"
                            alt="TikTok"
                            className="w-6 h-6"
                          />
                        </div>
                      )}
                      <Carousel showThumbs={false} showStatus={false} dynamicHeight>
                        {product.images && product.images.length > 0 ? (
                          product.images.map((image, index) => (
                            <div key={index}>
                              <img src={image} alt={`Product ${index}`} />
                            </div>
                          ))
                        ) : (
                          <div>
                            <img src="../icons/megaphone.png" alt="Placeholder" />
                          </div>
                        )}
                      </Carousel>
                      <CardBody>
                        <p className="font-semibold truncate text-gray-600 dark:text-gray-300 mb-1">
                          {product.name}
                        </p>
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="text-purple-500 font-bold text-lg">
                            ${formatPrice(finalPrice)}
                          </p>
                          {hasDiscount && (
                            <>
                              <p className="text-gray-500 line-through text-sm">
                                ${formatPrice(product.price)}
                              </p>
                              <p className="text-green-500 text-sm">{product.discount}% OFF</p>
                            </>
                          )}
                        </div>
                        <Badge type={product.stockQuantity > 0 ? "success" : "danger"}>
                          {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                        <p className="mb-8 text-gray-600 dark:text-gray-400">
                          {product.shortDescription}
                        </p>
                        <div className="mt-4">
                          {renderRatingStars(product.rating)}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Link
                              to={{
                                pathname: `/app/product/${product._id}`,
                                state: { product },
                              }}
                            >
                              <Button
                                icon={EyeIcon}
                                className="mr-3"
                                aria-label="Preview"
                                size="small"
                              />
                            </Link>
                          </div>
                          <div>
                            <Button
                              icon={EditIcon}
                              className="mr-3"
                              layout="outline"
                              aria-label="Edit"
                              onClick={() => openEditModal(product)}
                              size="small"
                            />
                            <Button
                              icon={TrashIcon}
                              layout="outline"
                              onClick={() => openModal(product._id)}
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                );
              })}
          </div>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </>
      )}
    </div>
  );
};

export default ProductsAll;