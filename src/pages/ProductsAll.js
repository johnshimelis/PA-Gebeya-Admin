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





const ProductsAll = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [selectedEditProduct, setSelectedEditProduct] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedDeleteProduct, setSelectedDeleteProduct] = useState(null);
const history = useHistory();

  const [view, setView] = useState("grid");

  // Table and grid data handlling
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  // pagination setup
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const totalResults = response.length;

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }
  function openEditModal(product) {
    console.log("Editing product:", product);
    if (product && product._id) {  // Changed `id` to `_id`
      setSelectedEditProduct({
        ...product,
        qty: product.stockQuantity, // Ensure stockQuantity is mapped to qty
      });
      setIsEditModalOpen(true);
    } else {
      console.error("Product ID is undefined!", product);
    }
  }
  
  
  
  function handleEditChange(e) {
    const { name, value } = e.target;
    const updatedValue = name === "qty" || name === "discount" ? parseFloat(value) : value;
  
    setSelectedEditProduct((prev) => {
      const newQty = name === "qty" ? updatedValue : prev.qty;
      const newDiscount = name === "discount" ? updatedValue : prev.discount;
  
      return {
        ...prev,
        [name]: updatedValue,
        status: newQty > 0 ? "In Stock" : "Out of Stock", // Live update status
        hasDiscount: newDiscount > 0, // Mark discount as applied if greater than 0
      };
    });
  
    // Also update the `data` state live for the frontend to reflect changes immediately
    setData((prevData) =>
      prevData.map((product) =>
        product._id === selectedEditProduct._id
          ? { 
              ...product, 
              qty: name === "qty" ? updatedValue : product.qty, 
              stockQuantity: name === "qty" ? updatedValue : product.stockQuantity, 
              discount: name === "discount" ? updatedValue : product.discount,
              hasDiscount: name === "discount" && updatedValue > 0,
              status: (name === "qty" ? updatedValue : product.qty) > 0 ? "In Stock" : "Out of Stock"
            }
          : product
      )
    );
  }
 
 
const saveProductChanges = async (productId, updatedData) => {
    if (!productId) {
        console.error("Product ID is undefined!");
        return;
    }

    // Calculate the final price after applying the discount
    const hasDiscount = updatedData.discount > 0;
    const discountAmount = hasDiscount ? (updatedData.price * updatedData.discount) / 100 : 0;
    const finalPrice = updatedData.price - discountAmount;

    const formData = new FormData();
    formData.append("name", updatedData.name);
    formData.append("price", finalPrice); // ✅ Send updated final price instead of original price
    formData.append("stockQuantity", updatedData.qty);
    formData.append("shortDescription", updatedData.shortDescription);
    formData.append("discount", updatedData.discount); 
    formData.append("hasDiscount", hasDiscount ? "true" : "false"); 

    let newImagePreview = updatedData.previewUrl || updatedData.photo; 

    if (updatedData.photo instanceof File) {
        formData.append("image", updatedData.photo);
    }

    try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
            method: "PUT",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to update product");
        }

        const updatedProduct = await response.json(); 

        console.log("Product updated successfully", updatedProduct);

        // ✅ Ensure frontend reflects the discount update
        setData((prevData) =>
            prevData.map((product) =>
                product._id === productId
                    ? { 
                        ...product, 
                        name: updatedData.name,
                        price: finalPrice, // ✅ Ensure frontend also uses the updated final price
                        stockQuantity: updatedData.qty,
                        shortDescription: updatedData.shortDescription,
                        discount: updatedData.discount, 
                        hasDiscount, 
                        status: updatedData.qty > 0 ? "In Stock" : "Out of Stock",
                        photo: updatedProduct.photo 
                            ? `http://localhost:5000/uploads/${updatedProduct.photo}`  
                            : newImagePreview,
                    }
                    : product
            )
        );

        setIsEditModalOpen(false);
    } catch (error) {
        console.error("Error updating product:", error);
    }
};


const deleteProduct = async (productId) => {
  if (!productId) {
    console.error("Product ID is undefined!");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    // Remove the deleted product from the data state
    setData((prevData) => prevData.filter((product) => product._id !== productId));
    setIsModalOpen(false); // Close the modal after deletion
    console.log("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};


  // Adding Loading state for fetching products
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/products/`);
      const products = await res.json();
      console.log("Fetched products:", products); // Debugging
      setData(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  fetchProducts();
}, []);


// Inside your render JSX, add loading state display
if (loading) {
  return <div>Loading products...</div>;
}

  
  

 
  

  function openModal(productId) {
    if (!productId) {
      console.error("Product ID is undefined!");
      return;
    }
  
    const product = data.find(product => product._id === productId);
    if (!product) {
      console.error("Product not found!");
      return;
    }
  
    setSelectedDeleteProduct(product);
    setIsModalOpen(true);
  }

  
  
  

  function closeModal() {
    setIsModalOpen(false);
  }

  // Handle list view
  const handleChangeView = () => {
    if (view === "list") {
      setView("grid");
    }
    if (view === "grid") {
      setView("list");
    }
  };
  

  return (
    
    <div>
      <PageTitle>All Products</PageTitle>

      {/* Breadcum */}
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

      {/* Sort */}
      <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All Products
              </p>

              <Label className="mx-3">
                <Select className="py-3">
                  <option>Sort by</option>
                  <option>Asc</option>
                  <option>Desc</option>
                </Select>
              </Label>

              <Label className="mx-3">
                <Select className="py-3">
                  <option>Filter by Category</option>
                  <option>Electronics</option>
                  <option>Cloths</option>
                  <option>Mobile Accerssories</option>
                </Select>
              </Label>

              <Label className="mr-8">
                {/* <!-- focus-within sets the color for the icon when input is focused --> */}
                <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                  <input
                    className="py-3 pr-5 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                    placeholder="Number of Results"
                    value={resultsPerPage}
                    onChange={(e) => setResultsPerPage(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center mr-3 pointer-events-none">
                    {/* <SearchIcon className="w-5 h-5" aria-hidden="true" /> */}
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
  className="max-h-[90vh] overflow-y-auto bg-white shadow-lg rounded-lg p-6 w-[800px]" // Increased width
>
  <ModalHeader>Edit Product</ModalHeader>
  <ModalBody>
    {selectedEditProduct && (
      <div className="grid grid-cols-2 gap-4"> {/* Two-column layout */}

        {/* Product Name */}
        <Label>
          <span>Product Name</span>
          <input
            name="name"
            value={selectedEditProduct.name || ""}
            onChange={handleEditChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </Label>

        {/* Price */}
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

        {/* Quantity */}
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

        {/* Status */}
        <Label>
          <span>Status</span>
          <select
            name="status"
            value={selectedEditProduct.qty > 0 ? "In Stock" : "Out of Stock"}
            className="w-full mt-1 p-2 border rounded"
            disabled // Prevent manual selection
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </Label>

        {/* Short Description (Full Width) */}
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

        {/* Discount */}
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

        {/* Image Upload (Full Width) */}
        <div className="col-span-2">
          <Label>
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              className="w-full mt-1 p-2 border rounded"
              onChange={(e) => handleEditChange(e)} // Handle image change
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
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.slice((page - 1) * resultsPerPage, page * resultsPerPage).map((product) => (
        <TableRow key={product._id}>
          <TableCell>
            <Avatar src={product.photo} size="large" />
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
  <div className="flex space-x-2">
    <Link
      to={{
        pathname: `/app/product/${product._id}`,
        state: { product }, // Passing full product data, including stockQuantity
      }}
    >
      <Button
        icon={EyeIcon}
        className="mr-3 p-2"
        aria-label="Preview"
        size="small"
      />
    </Link>

    {/* Edit Icon Button */}
    <Button
      icon={EditIcon}
      onClick={() => openEditModal(product)}
      className="p-2"
      size="small"
    />

    {/* Trash Icon Button */}
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
    <Pagination totalResults={totalResults} resultsPerPage={resultsPerPage} onChange={onPageChange} />
  </TableFooter>
</TableContainer>

        </>
      ) : (
        <>
     {/* Car list */}
<div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
  {data.map((product) => {
    const hasDiscount = product.discount && product.discount > 0;
    const discountAmount = hasDiscount ? (product.price * product.discount) / 100 : 0;
    const finalPrice = product.price - discountAmount;

    // Function to format price properly (removes trailing .0)
    const formatPrice = (price) => parseFloat(price.toFixed(2)).toString();

    return (
      <div className="" key={product.id}>
        <Card>
          <img
            className="object-cover w-full"
            src={product.photo ? product.photo : "../icons/megaphone.png"}
            alt="Image is loading"
          />

          <CardBody>
            {/* Product Name */}
            <p className="font-semibold truncate text-gray-600 dark:text-gray-300 mb-1">
              {product.name}
            </p>

            {/* Pricing Section */}
            <div className="flex items-center space-x-2 mb-2">
              {/* Display Final Price */}
              <p className="text-purple-500 font-bold text-lg">
                ${formatPrice(finalPrice)}
              </p>

              {/* Show Original Price and Discount Percentage only if discount applies */}
              {hasDiscount && (
                <>
                  <p className="text-gray-500 line-through text-sm">
                    ${formatPrice(product.price)}
                  </p>
                  <p className="text-green-500 text-sm">{product.discount}% OFF</p>
                </>
              )}
            </div>

            {/* Stock Status */}
            <Badge type={product.stockQuantity > 0 ? "success" : "danger"}>
              {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
            </Badge>

            {/* Description */}
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              {product.shortDescription}
            </p>

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
                  onClick={() => {
                    if (product && product._id) {
                      openModal(product._id);
                    } else {
                      console.error("Product ID is undefined or product is missing!");
                    }
                  }}
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
