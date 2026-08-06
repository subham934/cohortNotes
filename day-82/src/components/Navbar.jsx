const Navbar = (props) => {
  // console.log(props);

  return (
    <div className="h-[10vh] w-full bg-emerald-600 flex justify-between items-center px-5">
      <h1 className="text-white text-3xl"> {props.brand}</h1>

      {props.children}
    </div>
  );
};

export default Navbar;
