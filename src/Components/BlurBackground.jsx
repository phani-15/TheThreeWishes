import React from "react";

export default function BlurBackground({ image, blur = "blur-sm" }) {
  return (
    <>
      <div
        className={`absolute inset-0 bg-cover bg-center ${blur} scale-110`}
        style={{ backgroundImage: `url('${image}')` }}
      ></div>
      <div className="absolute inset-0 bg-black/60"></div>
    </>
  );
}