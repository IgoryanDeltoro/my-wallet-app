export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2)
  return balance
}

export const cutString = (string) => {
  return (
    string.split("").slice(0, 5).join("") +
    "..." +
    string.split("").slice(-5).join("")
  );
};