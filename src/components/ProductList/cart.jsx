import { useAtom, useAtomValue } from 'jotai';
import { cartAtom, totalPriceAtom, shippingPriceAtom} from "../../store";
import './cart.css'




const Cart = ({cartAtom, totalPriceAtom, shippingPriceAtom}) => {
    const [cart, setCart] = useAtom(cartAtom);
    const totalPrice = useAtomValue(totalPriceAtom)
    const shippingPrice = useAtomValue(shippingPriceAtom)
    return (
        <div className='cart-items'>
                {cart.map(item => (
                    <div className='cart-wrapper'>
                        <img className='cart-img' src={item.src} />
                            <div className='cart-title'>{item.title} <p>{item.count}x</p><span>{item.description}</span></div>
                            <div className='cart-item-price'>{item.price * item.count}₽</div>
                        </div>
            ))}
            <div className='shipping-price'>Цена доставки: {shippingPrice}₽</div>
            <div className='cart-total-price'>Итого: {totalPrice + shippingPrice}₽</div>
        </div>
         
    )
    
}

export default Cart;