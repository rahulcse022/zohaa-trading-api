exports.getTimeDateFilters = (filterBy = "") => {
  if (filterBy === "today") {
    return this.getCurrentDateFilter();
  }
  if(filterBy === 'history'){
    return getHistory();
  }
  return {};
};
exports.getCurrentDateFilter = () => {
  // Get the current date
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for comparison

  // Define the date range for today
  const todayStartDate = currentDate; // Start of today (00:00:00.000)
  const todayEndDate = new Date(currentDate); // End of today (23:59:59.999)
  todayEndDate.setDate(todayEndDate.getDate() + 1); // Add one day and set time to 00:00:00.000
  return {
    createdAt: {
      $gte: todayStartDate,
      $lt: todayEndDate,
    },
  };
};
const getHistory = ()=>{
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  return {
    createdAt: {
      $gte: currentDate,
    },
  };
}
