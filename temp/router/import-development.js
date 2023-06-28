// module.exports = file => require("@/views/" + file + ".vue").default;
export default file => require(`@/views/${file}`).default;
