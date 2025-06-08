export const formatDateTime = (dateString) => {
  if (!dateString) return "Invalid Date";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  return date.toLocaleString("en-US", {
    //year: "numeric",
     day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
  });
};
