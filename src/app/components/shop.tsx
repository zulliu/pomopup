import React, { useState } from 'react';
import {
  Card, Typography, Avatar, Button,
} from '@material-tailwind/react';
import { useGlobalState, useGlobalDispatch } from '../globalContext';
import { ACTIONS } from './stateManage';

const TABLE_HEAD = ['', 'Name', 'Price', 'Description'];
const SHOP_ITEMS = [
  {
    name: 'Rug',
    price: 20,
    description: "A luxurious rug to elevate your home's interior.",
    image: '/carpet.jpeg',
  },
  {
    name: 'Wallpaper',
    price: 30,
    description: 'Elegant wallpaper to give your walls a fresh look.',
    image: 'wall1.png',
  },
  {
    name: 'Coming Soon',
    price: 999,
    description: 'New Item coming soon',
    image: '/items/unknown.jpeg',
  },
  {
    name: 'Coming Soon ',
    price: 999,
    description: 'New Item coming soon',
    image: '/items/unknown.jpeg',
  },
];

function Shop() {
  const dispatch = useGlobalDispatch();
  const globalState = useGlobalState();
  const handlePurchase = (item) => {
    const newTomato = globalState?.tomatoNumber - item.price;

    console.log(item, item.name);
    if (newTomato < 0) {
      alert("You don't have enough tomatoes!");
      return;
    }

    if (item.name === 'Rug') {
      dispatch({
        type: ACTIONS.SET_RUG_TEXTURE,
        payload: item.image,
      });
    } else if (item.name === 'Wallpaper') {
      dispatch({
        type: ACTIONS.SET_WALL_TEXTURE,
        payload: item.image,
      });
    } else if (item.name === 'Collie') {
      dispatch({
        type: ACTIONS.SWITCH_DOG,
        payload: 'collie',
      });
    }
    dispatch({
      type: ACTIONS.SET_TOMATO_NUMBER,
      payload: newTomato,
    });
    dispatch({
      type: ACTIONS.ADD_PURCHASED_ITEM,
      payload: item.name,
    });
    dispatch({
      type: ACTIONS.SET_TOMATO_NUMBER,
      payload: newTomato,
    });

    dispatch({
      type: ACTIONS.ADD_PURCHASED_ITEM,
      payload: item.name,
    });
  };
  return (
    <div className="absolute w-[38rem] h-[36rem] -top-40 left-16 z-20 bg-white opacity-90 rounded-lg overflow-y-auto">
      <p className="ml-64 text-3xl mt-6">Shop</p>

      <Card className="h-full w-11/12 mx-auto overflow-scroll text-2xl">
        <div className="grid grid-cols-2 gap-4">
          {' '}
          {/* This creates a 2 column grid */}
          {SHOP_ITEMS.map((item) => (
            <div key={item.name} className="border p-4 rounded-lg items-center">
              <img src={item.image} alt={item.name} className="mx-auto w-32 h-32 object-cover rounded-lg" />
              <Typography variant="small" color="blue-gray" className="font-normal text-center mt-2">
                {item.name}
              </Typography>
              <Typography variant="small" color="blue-gray" className="font-normal text-center">
                Price:
                {' '}
                {item.price}
                {' '}
                Tomato
              </Typography>
              <Typography variant="small" color="blue-gray" className="font-normal text-center mt-1">
                {item.description}
              </Typography>
              <Button
                className="mx-16 bg-primary"
                onClick={() => handlePurchase(item)}
                disabled={globalState.purchasedItems.includes(item.name)}
              >
                {globalState.purchasedItems.includes(item.name) ? 'Purchased' : 'Purchase'}
              </Button>
            </div>
          ))}
          <div key="dog" className="border p-4 rounded-lg items-center">
            <img src="mobi.png" alt="mobi.png" className="mx-auto w-32 h-32 object-cover rounded-lg" />
            <Typography variant="small" color="blue-gray" className="font-normal text-center mt-2">
              A Collie
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-normal text-center">
              Price:
              {' '}
              30
              {' '}
              Tomato
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-normal text-center mt-1">
              {'It\'s time to bring home a new dog!'}
            </Typography>
            <Button
              className="mx-16 bg-primary"
              onClick={() => handlePurchase({ name: 'collie', price: 30 })}
              disabled={globalState.purchasedItems.includes('mobi')}
            >
              {globalState.purchasedItems.includes('mobi') ? 'Purchased' : 'Purchase'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Shop;
