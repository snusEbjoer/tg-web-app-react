import React, { useState } from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import { useTelegram } from "../../hooks/useTelegram";
import { useCallback, useEffect } from "react";
import { useAtom, useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { cartAtom, totalPriceAtom } from "../../store";

const products = [
    {"id":1, "title":"BOTULAX",
    "src":"https://profiller.info/image/cache/catalog/01_in_des_(kris)/botulax-200-dermakor-russia1-1000x1000-1000x1000.jpeg",
    "price":3000,
    "description":"Форма выпуска: 200 единиц."},
    {"id":2, "title":"REFINEX",
    "src":"https://irecommend.ru/sites/default/files/imagecache/copyright1/user-images/1815965/hOMpveEpA3KzWb2bKbpgQ.JPG",
    "price":1800,
    "description":"Форма выпуска: 100 единиц."},
    {"id":3, "title":"INNOTOX",
    "src":"https://www.eco-cosmetic.com.ua/image/cache/catalog/Clever/01_innotox50_5v5f5f5f5f5-1000x1000-product_popup.png",
    "price":2100,
    "description":"Форма выпуска: 50 единиц."},
    {"id":4, "title":"RE N TOX",
    "src":"https://www.mimilips.com.ua/wp-content/uploads/2020/07/rentox-2.jpg",
    "price":2500,
    "description":"Форма выпуска: 100 единиц."},
    {"id":5, "title":"RE N TOX",
    "src":"https://shopme365.com/image/cache/wkseller/23229/b8-500x500.jpeg",
    "price":3700,
    "description":"Форма выпуска: 200 единиц."},
    {"id":6, "title":"NABOTA",
    "src":"https://www.cosmo-korea.com/web/image/product.template/1494/image_1024?unique=a4b1889",
    "price":2100,
    "description":"Форма выпуска: 100 единиц."},
    {"id":7, "title":"NABOTA",
    "src":"https://s.optlist.ru/i/40/14/172350ec19a79421-4014-1.jpg",
    "price":3500,
    "description":"Форма выпуска: 200 единиц."},
    {"id":8, "title":"NEURONOX",
    "src":"https://www.cosmo-korea.com/web/image/product.template/1491/image_512/%5B52009%5D%20Neuronox%20100ui?unique=657e80d",
    "price":2800,
    "description":"Форма выпуска: 100 единиц."},
    {"id":9, "title":"ТОХТА",
    "src":"https://shopme365.com/image/cache/wkseller/23229/b9-500x500.jpeg",
    "price":2000,
    "description":"Форма выпуска: 100 единиц."},
    {"id":10, "title":"LIZTOX",
    "src":"https://www.cosmo-korea.com/web/image/product.template/1781/image_1024?unique=04272a6",
    "price":2000,
    "description":"Форма выпуска: 100 единиц."},
    {"id":11, "title":"Wondertox",
    "src":"https://easemart.ph/web/image/product.template/815/image_1024?unique=4756043",
    "price":2000,
    "description":"Форма выпуска: 100 единиц."},
    {"id":12, "title":"Wondertox",
    "src":"https://mobimg.b-cdn.net/v3/fetch/94/94c56e15f13f1de4740a76742b0b594f.jpeg",
    "price":3200,
    "description":"Форма выпуска: 200 единиц."},
    {"id":13, "title":"МАСПОРТ",
    "src":"https://freshskin01.com/wp-content/uploads/2021/11/MASPORT-500-BOTAX1.jpg",
    "price":4300,
    "description":"Форма выпуска: 500 единиц."},
    {"id":14, "title":"МЕДИТОКСИН",
    "src":"https://www.cosmo-korea.com/web/image/product.template/2063/image_1024?unique=728833e",
    "price":2800,
    "description":"Форма выпуска: 100 единиц"},
    {"id":15, "title":"КАЙМАКС",
    "src":"https://www.youngskin.shop/wp-content/uploads/2021/09/kaimax-100-01.png",
    "price":2000,
    "description":"Форма выпуска: 100 единиц."},
    {"id":16, "title":"КАЙМАКС",
    "src":"https://www.youngskin.shop/wp-content/uploads/2022/03/kaimax-200-01.png",
    "price":3500,
    "description":"Форма выпуска: 200 единиц."},
]


const ProductList = () => {
    const [cart, setCart] = useAtom(cartAtom);
    const navigate = useNavigate();
    const totalPrice = useAtomValue(totalPriceAtom)

    const { tg } = useTelegram();

    const onSendData = useCallback(() => {
        navigate('/form');
    }, [])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    useEffect(() => {
        if (totalPrice === 0) {
            tg.MainButton.hide()
        } else {
            tg.MainButton.show()
        }
        tg.MainButton.setParams({
            text: `Купить ${totalPrice}`
        })
    }, [totalPrice])

    const onAdd = (product) => {
        const alreadyAdded = cart.find(item => item.id === product.id);
        let newItems = [];

        if (alreadyAdded) {
            newItems = cart.map(item => {
                if (item.id === product.id) {
                    return {
                        ...item,
                        count: item.count + 1
                    }
                }

                return item;
            });
        } else {
            newItems = [...cart, {
                ...product,
                count: 1
            }];
        }

        setCart(newItems)
    }

    const increaseCount = (id) => {
        const newItems = cart.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    count: item.count + 1
                }
            }

            return item;
        });

        setCart(newItems)
    }

    const decreaseCount = (id) => {
        const currentCount = cart.find(item => item.id === id)?.count || 0;
        if (currentCount === 1) {
            const newItems = cart.filter(item => item.id !== id);
            setCart(newItems)
            return;
        }
        const newItems = cart.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    count: item.count - 1
                }
            }

            return item;
        });

        setCart(newItems)
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    count={cart.find(cartItem => cartItem.id === item.id)?.count || 0}
                    increaseCount={increaseCount}
                    decreaseCount={decreaseCount}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;
