import { memo, useEffect, useContext, useState, useCallback, useMemo } from "react";

import rawItems from '../ShopData/item.json'


const Shop = memo(() => {

    const [isError, setIsError] = useState(false)
    const [items, setItems] = useState([...rawItems]) //ของร้านค้า เเละดึงค่ามา...
    const [cartItems, setCartItems] = useState([]) //ในตะกร้า
  
    const handleUpdateStockItems = useCallback((item) => {
        
        // ทั้งหมดมีกี่ชิ้น
        let inStockCount = 0;
        rawItems.forEach(_item => {
            if (_item.name === item.name) {
                inStockCount = _item.stock
            }
        })
        
        // ในตะกร้ากี่ชิ้น
        let inCartCount = 0;
        cartItems.forEach(_item => {
            if (_item.name === item.name) {
                inCartCount = _item.amount
            }
        })
        // ซื้อได้อีกกี่ชิ้น
        let canBuyAmount = inStockCount - inCartCount;

        //edit array
        let _items = [...items]

        _items = _items.map(_item => {
            if (_item.name === item.name) {
                return {
                    name: _item.name,
                    price: _item.price,
                    stock: canBuyAmount
                }
            }
            return _item
        })

        //เอาเข้าไป
        setItems(_items)

    }, [cartItems, items]) //ถ้าอะไรเปลี่ยนเเปลง 

    //ทำงานใหม่ rerender ตรงจำนวนที่เปลี่ยน
    useEffect(() => {
        rawItems.forEach(item => {
            handleUpdateStockItems(item)
        })
    }, [cartItems]) //มีการอับเดต

    const cartTotalCost = useMemo(() => {
        
        console.log(cartItems)
        let total = 0;
        cartItems.forEach(item => {
            total += item.price * item.amount;
        })
        return total;

    }, [cartItems])

    const handleIncreaseItemInCart = useCallback((item) => {
        
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

        console.log(_cartItems);

        setCartItems(_cartItems)
        // handleUpdateStockItems(item)

        
    }, [cartItems, handleUpdateStockItems])


    const handleDecreaseItemInCart = useCallback((item) => {
        let _cartItems = [...cartItems];

        _cartItems = _cartItems.map(_item => {
            if(item.name === _item.name) {
                if (item.amount === 1)
                    return undefined
                return {
                    name: item.name,
                    price: item.price,
                    amount: item.amount - 1
                }
            }
            return _item
        }).filter(e => e !== undefined)

        console.log(_cartItems);

        setCartItems(_cartItems)

        // handleUpdateStockItems(item)

        
    }, [cartItems, handleUpdateStockItems])

    const handleAddItemToCart = useCallback((item) => {

        //เช้คว่า item นั้นอยุในตะกร้ายัง
        let isAlreadyInCart = false;

        cartItems.forEach(incartitem => {
            if (item.name === incartitem.name) {
                isAlreadyInCart = true;
            }
        })

        if (isAlreadyInCart) {
            // เพิ่มสินค้าลงในตระกร้า
            handleIncreaseItemInCart(item)
        }
        else {
            setCartItems([...cartItems, {
                name: item.name,
                price: item.price,
                amount: 1,
            }])
        }

    }, [cartItems, handleIncreaseItemInCart])


    if (isError)
        return <>
            Error please restart
        </>

    return <>
        <div className="container">
            <div className="row mt-5">
                <div className="col">
                    <h1>
                        ร้านค้าสุดเทพของฟิม
                    </h1>
                </div>
            </div>
            <div className="border-bottom my-3">

            </div>
            <div className="row">
                <div className="col-8">

                    <div className="row">
                        {
                            items.map((item) => {
                                return <div className="col-3">
                                    <div className="card">
                                    <img src={item.img} />
                                        <div className="card-body">
                                            <div className="card-title">
                                                {item.name}
                                            </div>
                                            <p>Price : {item.price}</p>
                                            <p>Available items : {item.stock}</p>
                                            <button type="button" class="btn btn-primary" onClick={
                                                () => {
                                                    handleAddItemToCart(item)
                                                }
                                            }
                                            disabled={item.stock <= 0}
                                            >Add to cart</button>
                                        </div>

                                    </div>
                                </div>
                            })
                        }

                    </div>

                </div>
                <div className="col-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Cart</h5>

                            {
                                cartItems.map(item => {
                                    return <>
                                        <div className="row bg-light p-2 border">
                                            <div className="col-8">
                                                <p>{item.name}</p>
                                                <p>{item.price} x {item.amount} = {item.price * item.amount}</p>
                                            </div>
                                            <div className="col-4">
                                                <div className="row">
                                                    <div className="col-4">
                                                        <button type="button" class="btn btn-danger btn-sm" onClick={() => {
                                                                handleDecreaseItemInCart(item)
                                                            }
                                                        }
                                                        >-</button>
                                                    </div>
                                                     <div className="col-4">
                                                        <p> {item.amount} </p>
                                                    </div>
                                                    <div className="col-4">
                                                        <button type="button" class="btn btn-warning btn-sm"
                                                        onClick={() => {
                                                            handleIncreaseItemInCart(item)
                                                        }
                                                    }
                                                        >+</button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </>
                                })
                            }


                            <div className="row mt-3">
                                <div className="col-6">
                                    <p>Total</p>
                                </div>
                                <div className="col-6">
                                    <p>{cartTotalCost}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>

});

export default Shop;

