import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // cart  which contains the items that are seleceted and counter incremented
  const [cartItems, setCartItems] = useState({});
  const url="https://food-circuit-backend.onrender.com";
  const [token,setToken]=useState("");
  const [food_list,setFoodList]=useState([]);

  const addToCart = async(itemId) => {
    // if item incremente first time then give it to one
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      // it item item incremented previously now this time increase its counter by 1
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    // if user is logedin we will update the cart in the database as well 
    if(token){
      await axios.post(url+"/api/cart/add",{itemId},{headers:{token}});
    }
  };

  const removeFromCart = async(itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(token){
      await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}});
    }
  };

  // useEffect(()=>{
  //     console.log(cartItems);
  // },[cartItems]);

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };


  const fetchFoodList=async()=>{
    const response=await axios.get(url+'/api/food/list');
    console.log(response.data.data);
    setFoodList(response.data.data);
  }

  const loadCartData=async(token)=>{
    const response=await axios.post(url+"/api/cart/get",{},{headers:{token}});
    setCartItems(response.data.cartData);
  }

  // when user refresh we will no logged out the user , user remain logged in 
  useEffect(()=>{
   

    // to load the food 
    async function loadData(){
      await fetchFoodList();
      if(localStorage.getItem('token')){
        setToken(localStorage.getItem('token'));

        // update the cart item whenever the pages reloads
        await loadCartData(localStorage.getItem('token'));
      }
    }
    loadData();
  },[]);

  // food list
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
