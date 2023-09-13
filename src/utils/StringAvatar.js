const StringAvatar = (name) => {
    return {
      sx: {
        bgcolor: "rgb(99, 150, 240)",
        color: "white",
        fontWeight: "bold",
        textTransform: "uppercase"
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

export default StringAvatar