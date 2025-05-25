import React from "react";
import {
  Typography,
  TextField,
  Button,
  Modal,
  styled,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import { FormikProps } from "formik";
import Textarea from "@mui/joy/Textarea";
import { Product } from "../Dashboard";

interface ProductDialogProps {
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  selectedProduct: Product | null;
  formik: FormikProps<Product>;
}

const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ProductDialog: React.FC<ProductDialogProps> = ({
  modalOpen,
  setModalOpen,
  selectedProduct,
  formik
}) => {


  return (
    <StyledModal open={modalOpen} onClose={() => setModalOpen(false)}>
    <Paper sx={{ p: 4, maxWidth: 500, width: "100%" }}>
        <Typography variant="h6" gutterBottom>
        {selectedProduct ? "Edit Product" : "Add Product"}
        </Typography>
        <Divider orientation="horizontal"  sx={{mb: 2, mt: 2}}/>

        <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
            <Grid size={{ xs:12}}>
            <TextField
                fullWidth
                id="name"
                name="name"
                label="Product Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
            />
            </Grid>

            <Grid size={{ xs:12}}>
            <Textarea
                color="neutral"
                minRows={2}
                placeholder="Descriptions....."
                size="lg"
                variant="outlined"
                name="description"
                id="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
            />
            </Grid>

            <Grid size={{ xs:6}}>
            <TextField
                fullWidth
                id="price"
                name="price"
                label="Price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
            />
            </Grid>

            <Grid size={{ xs:6, sm:6 }}>
                <TextField
                    fullWidth
                    id="quantity"
                    name="quantity"
                    label="Stock"
                    type="number"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                    helperText={formik.touched.quantity && formik.errors.quantity}
                />
            </Grid>

            <Grid size={{ xs:12}}>
            <Button color="primary" variant="contained" fullWidth type="submit">
                Save
            </Button>
            </Grid>
        </Grid>
        </form>
    </Paper>
    </StyledModal>
  );
};

export default ProductDialog;
