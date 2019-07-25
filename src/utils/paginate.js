// import _ from "lodash";

export function paginate(items, pageNumber, pageSize) {
  const startIndex = (pageNumber - 1) * pageSize;

  // return _(items) // lodash wrapper object that enables methods chaining
  //   .slice(startIndex)
  //   .take(pageSize) // pageSize is the nr of items from the lodash wrapper obj that we want to use
  //   .value(); // turn lodash wrapper object into an array

  return items.slice(startIndex, startIndex + pageSize);
}