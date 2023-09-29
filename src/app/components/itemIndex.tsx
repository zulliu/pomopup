import React, { useState, useEffect } from 'react';
import { Card, Typography, Avatar } from '@material-tailwind/react';
import axios from 'axios';
import { useGlobalState } from '../globalContext';

const TABLE_HEAD = ['', 'Name', 'Description'];

function ItemIndex() {
  const [fullItemList, setFullItemList] = useState([]);

  useEffect(() => {
    // Fetch the full item list from the backend when the component mounts
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/getAllItems');
        setFullItemList(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    };

    fetchItems();
  }, []);

  const { userItems } = useGlobalState(); // Get user items from the global state

  return (
    <div className="absolute w-[38rem] h-[36rem] -top-40 left-16 z-20 bg-white opacity-80 rounded-lg overflow-y-auto">
      <p className="ml-60 text-3xl mt-6">Item Index</p>

      <Card className="h-full w-11/12 mx-auto overflow-scroll text-2xl">
        <table className="w-11/12 table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-center">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70 text-center"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fullItemList.map((item) => {
              const isUserItem = userItems.some((userItem) => userItem.item_id === item.item_id);

              return (
                <tr key={item.item_id} className="even:bg-blue-gray-50/50">
                  <td className="px-1">
                    <Avatar
                      src={isUserItem ? `/items/${item.item_id}.png` : '/items/unknown.jpeg'}
                      alt={isUserItem ? item.item_id : '???'}
                      size="md"
                      className="border border-blue-gray-50 w-12 h-12 object-contain p-1"
                    />
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal text-center">
                      {isUserItem ? item.name : '???'}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal text-center">
                      {isUserItem ? item.description : '???'}
                    </Typography>
                  </td>
                </tr>
              );
            })}
            <tr className="even:bg-blue-gray-50/50">
              <td className="px-1">
                <Avatar
                  src="/items/unknown.jpeg"
                  alt="???"
                  size="md"
                  className="border border-blue-gray-50 w-12 h-12 object-contain p-1"
                />
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal text-center">
                  ???
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal text-center">
                  ???
                </Typography>
              </td>
            </tr>
            <tr className="even:bg-blue-gray-50/50">
              <td className="px-1">
                <Avatar
                  src="/items/unknown.jpeg"
                  alt="???"
                  size="md"
                  className="border border-blue-gray-50 w-12 h-12 object-contain p-1"
                />
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal text-center">
                  ???
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal text-center">
                  ???
                </Typography>
              </td>
            </tr>
            <tr className="even:bg-blue-gray-50/50">
              <td className="px-1">
                <Avatar
                  src="/items/unknown.jpeg"
                  alt="???"
                  size="md"
                  className="border border-blue-gray-50 w-12 h-12 object-contain p-1"
                />
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal text-center">
                  ???
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal text-center">
                  ???
                </Typography>
              </td>
            </tr>
            <tr className="even:bg-blue-gray-50/50">
              <td className="px-1">
                <Avatar
                  src="/items/unknown.jpeg"
                  alt="???"
                  size="md"
                  className="border border-blue-gray-50 w-12 h-12 object-contain p-1"
                />
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal text-center">
                  ???
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal text-center">
                  ???
                </Typography>
              </td>
            </tr>
            <tr className="even:bg-blue-gray-50/50">
              <td className="px-1">
                <Avatar
                  src="/items/unknown.jpeg"
                  alt="???"
                  size="md"
                  className="border border-blue-gray-50 w-12 h-12 object-contain p-1"
                />
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal text-center">
                  ???
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal text-center">
                  ???
                </Typography>
              </td>
            </tr>
            <tr className="even:bg-blue-gray-50/50">
              <td className="px-1">
                <Avatar
                  src="/items/unknown.jpeg"
                  alt="???"
                  size="md"
                  className="border border-blue-gray-50 w-12 h-12 object-contain p-1"
                />
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal text-center">
                  ???
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal text-center">
                  ???
                </Typography>
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default ItemIndex;
