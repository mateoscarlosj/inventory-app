import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Grid,
    Paper,
    Button,
    Box,
    Avatar,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import Inventory2Icon from '@mui/icons-material/Inventory2';

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useProducts } from "../context/ProductContext";
import ProductDialog from "./component/ProductDialog";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
        .required("Price is required")
        .min(0, "Price cannot be negative"),
    quantity: Yup.number()
        .required("Stock is required")
        .min(1, "Stock cannot be negative"),
});

const Dashboard: React.FC = () => {

    const { products, addProduct, editProduct, deleteProduct, fetchProducts } = useProducts();
    

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [darkMode, setDarkMode] = useState<boolean>(false);

    
    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setModalOpen(true);
        formik.resetForm();
    };

    
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: selectedProduct?.id ?? 0,
            name: selectedProduct?.name ?? "",
            description: selectedProduct?.description ?? "",
            price: selectedProduct?.price ?? 0,
            quantity: selectedProduct?.quantity ?? 0,
        },
        validationSchema,
        onSubmit: (values) => {
            if (selectedProduct) {
                editProduct({...values, id: selectedProduct?.id})
            } else {
                addProduct(values)
            }
            setModalOpen(false);
            setSelectedProduct(null);
            formik.resetForm();
        },
    });
    
    React.useEffect(() => {
        if (localStorage.getItem("token")){
            fetchProducts();
        }
            
    }, []);

    return (
        <Box sx={{ flexGrow: 1, bgcolor: darkMode ? "grey.900" : "background.default", minHeight: "100vh" }}>
        <AppBar position="static">
            <Toolbar>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                <Inventory2Icon />
            </Avatar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Inventory Management 
            </Typography>
            <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
            
            
            <Grid size={{ xs:12}}>
                <Paper sx={{ p: 2 }}>
                    
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                    <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setSelectedProduct(null);
                        setModalOpen(true);
                        formik.resetForm();
                    }}
                    >
                    Add Product
                    </Button>
                </Box>

                <TableContainer>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Descriptions</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>PHP {product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                            <IconButton onClick={() => handleEdit(product)} aria-label="edit">
                            <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => deleteProduct(product.id)} aria-label="delete">
                            <DeleteIcon />
                            </IconButton>
                        </TableCell>
                        </TableRow>
                    ))}
                    {products.length === 0 && (
                        <TableRow>
                        <TableCell colSpan={5} align="center">
                            No products found.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </TableContainer>

                </Paper>
            </Grid>
            </Grid>

            <ProductDialog 
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                selectedProduct={selectedProduct}
                formik={formik}
            />
            
        </Container>
        </Box>
    );
};

export default Dashboard;
