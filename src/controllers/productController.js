import productService from "../services/productService";

const productController = {
    handleGetAllProducts: async (req, res) => {
        const allProducts = await productService.handleGetAllProductService();
        return res.status(200).json({
            errorCode: 0,
            message: 'Ok',
            data: allProducts,
        })
    }
};

module.exports = productController;
