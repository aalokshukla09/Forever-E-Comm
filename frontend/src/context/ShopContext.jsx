import { createContext, useState, useEffect } from "react";
// import { products } from '../assets/assets'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = "$"
    const delivery_fee = 10
    const BackendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }
        // console.log("cartItems:", cartItems);
        // console.log("itemId:", itemId);
        // console.log("size:", size);
        let cartData = structuredClone(cartItems);
        // console.log("cartData:", cartData);
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;

        }
        setCartItems(cartData);
        // console.log("cartItems:", cartItems);
        toast.success('Product Added to Cart');
        if (token) {
            try {
                console.log(token)
                console.log(itemId)
                console.log(size)
                await axios.post(BackendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
            }
            catch (error) {
                console.log(error);
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    console.error('Error accessing cart item:', error);
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
        if (token) {
            try {
                await axios.post(BackendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
            }
            catch (error) {
                console.log(error);
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;

        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                const quantity = cartItems[itemId][size];

                if (quantity > 0) {
                    const product = products.find(
                        (p) => p._id === itemId
                    );

                    if (product) {
                        totalAmount += product.price * quantity;
                    }
                }
            }
        }

        return totalAmount;
    };

    const getProductsData = async () => {
        try {
            const response = await axios.get(BackendUrl + '/api/product/list')
            // console.log(response.data)
            if (response.data.success) {
                setProducts(response.data.products);
            }
            else {
                toast.error(response.data.message)
            }
        }
        catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(BackendUrl + '/api/cart/get', {}, { headers: { token } })
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        }
        catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    
    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        if (token) {
            getUserCart(token);
        }
    })

    // useEffect(() => {
    //     console.log(cartItems);
    // }, [cartItems]);

    // Structuring the value to be provided by the context
    const value = {
        products, currency, delivery_fee, search, showSearch, setShowSearch, setSearch,
        cartItems, addToCart, getCartCount, updateQuantity, navigate, getCartAmount,
        BackendUrl, setProducts, token, setToken, setCartItems
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;