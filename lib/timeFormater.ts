export const formatDate = (rawDate: Date) => {
  const year = rawDate.getFullYear();
  const month = String(rawDate.getMonth() + 1).padStart(2, "0");
  const day = String(rawDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatTime = (rawDate: Date) => {
  return rawDate
    .toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase(); // PM/AM বড় হাতের করার জন্য
};
