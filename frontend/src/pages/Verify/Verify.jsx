import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../Context/storeContext';
import axios from "axios";
const Verify = () => {

    // to find the url params to see that order is verify successfully or not we 
    const [searchParams,setSearchParams]=useSearchParams();
    const success=searchParams.get("success")
    const orderId=searchParams.get("orderId")
    const navigate=useNavigate();
    console.log(success ,orderId);

    // now we will get the data from the backend api 
    const {url}=useContext(StoreContext);
    const verifyPayment=async()=>{
        const response=await axios.post(url+'/api/order/verify',{success,orderId});
        if(response.data.success){
            navigate('/myorders');
        }
        else{
            navigate('/');
        }
    }
    useEffect(()=>{
        verifyPayment();
    },[]);
  return (
    <div className='verify'>
        <div className="spinner">
            
        </div>
    </div>
  )
}

export default Verify