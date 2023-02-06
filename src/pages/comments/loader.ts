import { LoaderFunctionArgs } from 'react-router-dom';

export default async function ({ params }: LoaderFunctionArgs) {
  const res = await fetch('https://jsonplaceholder.typicode.com/comments');

  return res.json();
}
