import React from "react";

function TitleSection({ shrink, onTransitionEnd }) {
  return (
    <div
      className={`title-section ${shrink ? "shrink" : ""}`}
      onTransitionEnd={onTransitionEnd}
    >
      <h1 className="main-title">THE THREE WISHES</h1>
    </div>
  );
}

export default TitleSection;
