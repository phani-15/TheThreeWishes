function TitleSection({ title, shrink, onTransitionEnd }) {
  return (
    <div
      className={`title-section ${shrink ? "shrink" : ""}`}
      onTransitionEnd={onTransitionEnd}
    >
      <h1 className="main-title">{title}</h1>
    </div>
  );
}

export default TitleSection;