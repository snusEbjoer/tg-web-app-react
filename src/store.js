import { atom } from 'jotai';

export const cartAtom = atom([]);
export const shippingPriceAtom = atom(400);

export const totalPriceAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((acc, item) => {
    return acc += item.price * item.count
  }, 0)
});

