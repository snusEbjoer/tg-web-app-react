import React from 'react';
import Button from "../Button/Button";
import './ProductItem.css';
import { useState } from "react";


const ProductItem = ({ product, className, onAdd, increaseCount, decreaseCount, count }) => {
    // If add button is clicked already, show plus and minus buttons
    const [isAdded, setIsAdded] = useState(false);
    
    const onAddHandler = () => {
        setIsAdded(true);
        onAdd(product);
    }

    return (
        <div className={'product ' + className}>
            <img className={'img'} src={product.src}/>
            <div className={'title'}>{product.title}</div>
            <div className={'description'}>{product.description}</div>
            <div className={'price'}>
                <span>Стоимость: <b>{product.price}₽</b></span>
            </div>
            {count > 0 ? (
                <div className={'count'}>
                    <Button className={'minus-btn'} onClick={() => decreaseCount(product.id)}>-</Button>
                    <span>{count}</span>
                    <Button className={'plus-btn'} onClick={() => increaseCount(product.id)}>+</Button>
                </div>
            ) : (
                <Button className={'add-btn'} onClick={onAddHandler}>
                    Добавить в корзину
                </Button>
            )}
        </div>
    );
};

export default ProductItem;
