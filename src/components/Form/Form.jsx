import React, { useCallback, useEffect, useState, useRef } from 'react';
import './Form.css';
import { useTelegram } from "../../hooks/useTelegram";
import { Formik, Form as FForm, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { shippingPriceAtom, cartAtom, totalPriceAtom } from "../../store";
import Cart from '../ProductList/cart';
import { useNavigate } from 'react-router-dom';

const Form = () => {
    const { tg, queryId, user } = useTelegram();
    const formRef = useRef(null)
    const cart = useAtomValue(cartAtom)
    const totalPrice = useAtomValue(totalPriceAtom)
    const navigate = useNavigate()
    const setShippingPrice = useSetAtom(shippingPriceAtom)
    const shippingPrice = useAtomValue(shippingPriceAtom)

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Обязательное поле'),
        email: Yup.string().email('Invalid email').required('Обязательное поле'),
        address: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Обязательное поле'),
        postIndex: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Обязательное поле'),
        phone: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Обязательное поле'),
        shippingVariant: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!'),
    })


    const onSendData = useCallback(async (values) => {
        try {
            const data = {
                user: {
                    ...values,
                },
                id: user.id,
                queryId,
                items: [...cart],
                totalPrice
            }
            await fetch('http://localhost:8000/web-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
        } catch (e) {
            console.error(e)
        }
    }, [])

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Отправить данные'
        })
        tg.onEvent('mainButtonClicked', () => {
            formRef.current.submitForm();
        })
    }, [])

    useEffect(() => {
        tg.MainButton.show();
    }, [])

    return (
        <React.Fragment>
        <Formik
            initialValues={{
                name: '',
                email: '',
                address: '',
                postIndex: '',
                phone: '',
                shippingVariant: ''
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    await onSendData(values)
                    setSubmitting(false);
                    tg.close();
                } catch (e) {
                    console.error(e)
                }

            }}
            className={'form'}
            innerRef={formRef}
        >
            <FForm className='fform'>
                <Field className="input" name="name" type="text" placeholder={'Имя'} />
                <div className="error">
                    <ErrorMessage name="name" />
                </div>
                <Field className="input" name="email" type="email" placeholder={'Email'} />
                <div className="error">
                    <ErrorMessage name="email" />
                </div>
                <Field className="input" name="address" type="text" placeholder={'Адрес'} />
                <div className="error">
                    <ErrorMessage name="address" />
                </div>
                <Field className="input" name="postIndex" type="text" placeholder={'Почтовый индекс'} />
                <div className="error">
                    <ErrorMessage name="postIndex" />
                </div>
                <Field className="input" name="phone" type="text" placeholder={'Телефон'} />
                <div className="error">
                </div>
                <ErrorMessage name="phone" />
                <Field className="selector" value="Почта России (400 руб.)" id="sel" name="shippingVariant" as="select" onChange={ () => {if (document.getElementById("sel").value == "СДЭК (оплата при получении)") {setShippingPrice(0);} else{setShippingPrice(400)}}}> 
                    <option id="1" value="Почта России (400 руб.)">Почта России (400 руб.)</option>
                    <option id="2" value="СДЭК (оплата при получении)">СДЭК (оплата при получении)</option>
                    <option id="3" value="Курьером по москве (400руб.">Курьером по москве (400руб.)</option>
                </Field>
                
            </FForm>
            
        </Formik>
            <div className='cart-parent'>
                <button className='redirect-button' onClick={() => navigate('/')}>Вернуться в корзину</button>
                <Cart cartAtom={cartAtom} totalPriceAtom={totalPriceAtom} shippingPriceAtom={shippingPriceAtom}/>
            </div>
        </React.Fragment>
    );
};

export default Form;
