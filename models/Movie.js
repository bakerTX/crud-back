module.exports = (sequelize, DataTypes) => {
  return sequelize.define("movie", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    rating: DataTypes.INTEGER,
  })
}
