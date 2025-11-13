import React, {useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { useNavigate } from 'react-router-dom'
import { StoreContext } from "../../Context/storeContext";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext);
  
  // whenever this block will be executed then we will be navigated to the cart page 
  const navigate=useNavigate();
  useEffect(()=>{
    if(!token){
      navigate('/cart');
    }
    else if(getTotalCartAmount()===0){
      navigate('/cart');
    }
  },[token])



  const [data,setData]=useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })

  const onChangeHandler=(event)=>{
      const name=event.target.name;
      const value=event.target.value;
      setData(data=>({...data,[name]:value}));
      
  }

  const placeOrder=async(event)=>{
      event.preventDefault();
      // before calling the backend we have to call have to destructute the data 
      let orderItems=[];
      // take the item from the food list 
      food_list.map((item)=>{
          // check is the user cart have the product with this id 
          if(cartItems[item._id]>0){
              let itemInfo=item;
              itemInfo['quantity']=cartItems[item._id];
              orderItems.push(itemInfo);
          }
      })
      console.log(orderItems);
      
      let orderData={
        address:data,
        items:orderItems,
        amount:getTotalCartAmount()+2
      }

      let response=await axios.post(url+"/api/order/place",orderData,{headers:{token}});
      if(response.data.success){
        // if its true we will get a session url which will be true of false 
        const {session_url}=response.data;
        window.location.replace(session_url);

      }
      else{
        alert("Error");
      }
  }




  return (
    <form  onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-field">
          <input
            type="text"
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            placeholder="First name"
            required
          />
          <input
            type="text"
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            placeholder="Last name"
            required
          />
        </div>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          placeholder="Email address"
          required
        />
        <input
          type="text"
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          placeholder="Street"
          required
        />
        <div className="multi-field">
          <input
            type="text"
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            placeholder="City"
            required
          />
          <input
            type="text"
            name="state"
            value={data.state}
            onChange={onChangeHandler}
            placeholder="State"
            required
          />
        </div>
        <div className="multi-field">
          <input
            type="text"
            name="zipcode"
           value={data.zipcode}
           onChange={onChangeHandler}
            placeholder="Zip code"
            required
          />
          <input
            type="text"
            name="country"
            value={data.country}
            onChange={onChangeHandler}
            placeholder="Country"
            required
          />
        </div>
        <input
          type="text"
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          placeholder="Phone"
          required
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>
                $
                {getTotalCartAmount()}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>
               $
                {getTotalCartAmount() === 0 ? 0 : 2}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
               $
                {getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>
        </div>
        <button  className="place-order-submit" type="submit">
          PROCEED FOR PAYMENT
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
