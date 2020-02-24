const data = require("./educationsData.json");

module.exports = {
  filterEducations: filters =>
    Object.values(data).filter(education => {
      let filtered = true;

      if (filters.hasOwnProperty("isUniversity")) {
        filtered = filtered && education.university === filters.isUniversity;
      }

      if (filters.hasOwnProperty("attendedBefore")) {
        filtered = filtered && education.startYear < filters.attendedBefore;
      }

      return filtered;
    }),
  findEducation: name => data.hasOwnProperty(name) && data[name]
};
