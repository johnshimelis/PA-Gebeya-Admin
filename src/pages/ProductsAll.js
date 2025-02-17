import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Link, NavLink } from "react-router-dom";
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
    setSelectedEditProduct(product);
    setIsEditModalOpen(true);
  }
  function handleEditChange(e) {
    const { name, value } = e.target;
    setSelectedEditProduct((prev) => ({ ...prev, [name]: value }));
  }
  function saveProductChanges() {
    setData((prevData) =>
      prevData.map((p) => (p.id === selectedEditProduct.id ? selectedEditProduct : p))
    );
    setIsEditModalOpen(false);
  }
  function deleteProduct(productId) {
    setData((prevData) => prevData.filter((product) => product.id !== productId));
    setIsModalOpen(false);
  }
    

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [page, resultsPerPage]);

  // Delete action model
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeleteProduct, setSelectedDeleteProduct] = useState(null);
  async function openModal(productId) {
    let product = await data.filter((product) => product.id === productId)[0];
    // console.log(product);
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
  className="max-h-[90vh] overflow-y-auto bg-white shadow-lg rounded-lg p-6"
>
  <ModalHeader>Edit Product</ModalHeader>
  <ModalBody>
    {selectedEditProduct && (
      <div className="space-y-3">
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
          <span>Short Description</span>
          <textarea
            name="shortDescription"
            value={selectedEditProduct.shortDescription || ""}
            onChange={handleEditChange}
            className="w-full mt-1 p-2 border rounded"
            rows="3"
          />
        </Label>

        <Label>
          <span>Status</span>
          <select
            name="status"
            value={selectedEditProduct.qty > 0 ? "In Stock" : "Out of Stock"}
            onChange={handleEditChange}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </Label>

        <Label>
          <span>Upload Image</span>
          <input
            type="file"
            className="w-full mt-1 p-2 border rounded"
            onChange={(e) => {
              const file = e.target.files[0];
              setSelectedEditProduct((prev) => ({
                ...prev,
                photo: URL.createObjectURL(file),
              }));
            }}
          />
        </Label>
      </div>
    )}
  </ModalBody>
  <ModalFooter>
    <Button layout="outline" onClick={() => setIsEditModalOpen(false)}>
      Cancel
    </Button>
    <Button onClick={saveProductChanges}>Update</Button>
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
    <Button onClick={() => deleteProduct(selectedDeleteProduct.id)}>Delete</Button>
  </ModalFooter>
</Modal>


      {/* Product Views */}
      {view === "list" ? (
        <>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Name</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>QTY</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Action</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {data.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Avatar
                          className="hidden mr-4 md:block"
                          src={product.photo}
                          alt="Product image"
                        />
                        <div>
                          <p className="font-semibold">{product.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge type={product.qty > 0 ? "success" : "danger"}>
                        {product.qty > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {genRating(product.rating, product.reviews.length, 5)}
                    </TableCell>
                    <TableCell className="text-sm">{product.qty}</TableCell>
                    <TableCell className="text-sm">{product.price}</TableCell>
                    <TableCell>
                      <div className="flex">
                        <Link to={`/app/product/${product.id}`}>
                          <Button
                            icon={EyeIcon}
                            className="mr-3"
                            aria-label="Preview"
                          />
                        </Link>
                        <Button
  icon={EditIcon}
  className="mr-3"
  layout="outline"
  aria-label="Edit"
  onClick={() => openEditModal(product)}
/>

                        <Button
                          icon={TrashIcon}
                          layout="outline"
                          onClick={() => openModal(product.id)}
                          aria-label="Delete"
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
                label="Table navigation"
                onChange={onPageChange}
              />
            </TableFooter>
          </TableContainer>
        </>
      ) : (
        <>
          {/* Car list */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
            {data.map((product) => (
              <div className="" key={product.id}>
                <Card>
                  <img
                    className="object-cover w-full"
                    src={product.photo}
                    alt="product"
                  />
                  <CardBody>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-semibold truncate  text-gray-600 dark:text-gray-300">
                        {product.name}
                      </p>
                      <Badge
                        type={product.qty > 0 ? "success" : "danger"}
                        className="whitespace-nowrap"
                      >
                        <p className="break-normal">
                          {product.qty > 0 ? `In Stock` : "Out of Stock"}
                        </p>
                      </Badge>
                    </div>

                    <p className="mb-2 text-purple-500 font-bold text-lg">
                      {product.price}
                    </p>

                    <p className="mb-8 text-gray-600 dark:text-gray-400">
                      {product.shortDescription}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <Link to={`/app/product/${product.id}`}>
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
                          aria-label="Delete"
                          onClick={() => openModal(product.id)}
                          size="small"
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
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
