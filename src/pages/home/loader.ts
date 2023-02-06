export default async function (...args) {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');

  return res.json();
}
