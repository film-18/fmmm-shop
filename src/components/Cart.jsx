import { memo, useEffect, useContext, useState, useCallback, useMemo } from "react";

import rawItem from '../ShopData/item.json';

const Cart = memo(() => {

    const [isError, setIsError] = useState(false)
    const [items, setItems] = useState([...rawItem])
    const [cartItems, setCartItems] = useState([])

    const updateStock = useCallback((item) => {

        //all
        let inStockCount = 0;
        rawItem.forEach(_item => {
            if (_item.name === item.name) {
                inStockCount = _item.stock
            }
        })

        //ในตะกร้า
        let inCartCount = 0;
        cartItems.forEach(_item => {
            if (_item.name === item.name) {
                inCartCount = _item.amount
            }
        })


        let canBuyAmount =  inStockCount - inCartCount;
        let _items = [...items]

        //กำหนดเพื่อออออออออออออออ
        _items = _items.map(_item => {
            if (_item.name === item.name) {
                return {
                    name: _item.name,
                    price: _item.price,
                    stock: canBuyAmount,
                    img: _item.img
                }
            }
            return _item
        })

        setItems(_items)

    }, [cartItems, items])

    //???
    useEffect(() => {
        rawItem.forEach(item => {
            updateStock(item)
        })
    }, [cartItems])

    const increaseItemToCart = useCallback((item) => {

        let _cartItems = [...cartItems];

        _cartItems = _cartItems.map(_item => {
            if(item.name === _item.name) {
                return {
                    name: _item.name,
                    price: _item.price,
                    amount: _item.amount + 1
                }
            }
            return _item
        })
        setCartItems(_cartItems)
    }, [cartItems, updateStock])

    const decreaseItemToCart = useCallback((item) => {

        let _cartItems = [...cartItems];

        _cartItems = _cartItems.map(_item => {
            if(item.name === _item.name) {
                if (item.amount === 1)
                    return undefined
                return {
                    name: _item.name,
                    price: _item.price,
                    amount: _item.amount - 1
                }
            }
            return _item
        }).filter(e => e !== undefined)

        setCartItems(_cartItems)

    }, [cartItems, updateStock])




    const addItemToCart = useCallback((item) => {
        let isAlreadyInCart = false;

        cartItems.forEach(inCartItem => {
            if (item.name === inCartItem.name) {
                isAlreadyInCart = true;
            }
        })
        if (isAlreadyInCart) {
            //add iphone in cart
            increaseItemToCart(item)
        }
        else {
            setCartItems([...cartItems, {
                name: item.name,
                price: item.price,
                amount: 1,
            }])
        }
    }, [cartItems, increaseItemToCart])




    const cartTotalCost = useMemo(() => {

        let total = 0;
        cartItems.forEach(item => {
            total += item.price * item.amount;
        })
        return total;
    }, [cartItems])


    if(isError)
        return <>
            Error Jaaaaaaaaaaaaaaaaaaaaaaaaaa
        </>
    
    return <>
        <div className="container">
            <div className="row mt-5">
                <div className="col border rounded-pill border-success">
                    <h1 className="text-uppercase fw-bold">
                        fmmm shopping store 🧃🥝🍵🍏🥑🌲
                    </h1>
                </div>
            </div>
            <div className="border-bottom my-3 border-success border-4"></div>
            <div className="row">
                <div className="col-8">
                    <div className="row">
                        {
                            items.map((item => {
                                return <div className="col-4">
                                    <div className="border-right border-success">
                                        <img src={item.img} className="card-img-top"/>
                                        <div className="card-body">
                                            <div className="card-title">
                                                <p>{item.name}</p>
                                                <p>Starting at ฿ {item.price}</p>
                                                <p>Available items : {item.stock}</p>
                                                <button type="button" className="btn btn-dark btn-sm" onClick={() => {
                                                    addItemToCart(item)
                                                }}
                                                >Add to Cart</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                
                            }))
                        }

                    </div>
                </div>

                <div className="col-4">
                    <div className="card border-success">
                        <div className="card-header border-success bg-success text-light">
                            Your Cart
                        </div>
                        <div className="card-body">
                           {
                               cartItems.map((item => {
                                   return <>
                                        <div className="row bg-light border-pill">
                                            <div className="col-8">
                                                <h1>{item.name}</h1>
                                                <h6>{item.price} x {item.amount} = {item.price * item.amount} </h6>
                                            </div>
                                            <div className="col-4">
                                                    <div className="row">
                                                        <div className="col-4">
                                                            <button type="button" className="btn btn-danger btn-sm text-center" onClick={() => {
                                                                decreaseItemToCart(item)
                                                            }
                                                            }
                                                        >-</button>
                                                        </div>
                                                        <div className="col-4">
                                                            <p>{item.amount}</p>
                                                        </div>
                                                        <div className="col-4">
                                                            <button type="button" className="btn btn-warning btn-sm text-center" onClick={() => {
                                                                increaseItemToCart(item)
                                                            }}>+</button>
                                                        </div>
                                                    </div>
                                           
                                            </div>
                                        </div>
                                   </>
                               }))
                           }

                           <div className="row mt-5">
                               <div className="col-6">
                                   <p>Total </p>
                               </div>
                               <div className="col-6">
                                <p>฿ {cartTotalCost} </p>
                               </div>
                           </div>
                            
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </>

});

export default Cart;