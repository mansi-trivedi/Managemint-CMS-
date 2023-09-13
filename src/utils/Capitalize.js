const Capitalize = (field) => {
    const newField = field.replaceAll("_", " ");
    const arr = newField.split(" ");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str2 = arr.join(" ");
    return str2;
  };

  export default Capitalize