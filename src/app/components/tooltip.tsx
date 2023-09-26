import React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from '@material-tailwind/react';

export default function ToolTip(item) {
  return (
    <Card className="w-48 h-44 opacity-70">
      <div className="text-4xl mt-2 mx-auto">
        {item.item}
      </div>
      <div className="text-2xl mt-0 mx-2">
        {item.text}
      </div>
    </Card>
  );
}
