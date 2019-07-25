import React from "react";

const ListGroup = props => {
  const {
    items,
    valueProperty,
    textProperty,
    selectedItem,
    onItemSelect
  } = props;
  return (
    <div className="list-group">
      {items.map(item => (
        <button
          type="button"
          onClick={() => onItemSelect(item)}
          key={item[valueProperty]}
          className={
            item === selectedItem ? "list-group-item active" : "list-group-item"
          }
        >
          {item[textProperty]}
        </button>
      ))}
    </div>
  );
};

ListGroup.defaultProps = {
  textProperty: "name",
  valueProperty: "_id"
};
export default ListGroup;
