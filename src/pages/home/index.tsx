import React from 'react';
import { useLoaderData } from 'react-router-dom';

const Home: React.FC = () => {
  const comments = useLoaderData();

  return <div className="text-red-500">{JSON.stringify(comments)}</div>;
};

export default Home;
