import React from 'react';

const ProjectCard = (props) => {
  return (
    <>
      <div className="w-1/2 group hover:rounded-[50px] transition-all relative duration-200 overflow-hidden h-full ">
        <img className="h-full w-full object-cover" src={props.image1} alt="" />
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute top-0 left-0 w-full h-full bg-black/20 flex items-center justify-center">
          <h2 className="text-6xl font-[font1] text-white uppercase border-4 rounded-full pt-2 px-4 border-white">
            Vior la projets
          </h2>
        </div>
      </div>

      <div className="w-1/2 group hover:rounded-[50px] transition-all relative duration-200 overflow-hidden h-full ">
        <img className="h-full w-full object-cover" src={props.image2} alt="" />
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute top-0 left-0 w-full h-full bg-black/20 flex items-center justify-center">
          <h2 className="text-6xl font-[font1] text-white uppercase border-4 rounded-full pt-2 px-4 border-white">
            Vior la projets
          </h2>
        </div>
      </div>
    </>
  );
};

export default ProjectCard;
