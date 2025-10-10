import { NavLink } from 'react-router';

function NotFound() {
  console.log('page entering');
  return (
    <>
      <p>Page not found</p>
      <nav>
        <NavLink to={'/'}>Return Home</NavLink>
      </nav>
    </>
  );
}

export default NotFound;
