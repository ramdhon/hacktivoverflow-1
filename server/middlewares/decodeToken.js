module.exports = (req, res, next) => {
  const { decoded } = req;
  res.status(200).json({ message: 'token decoded', decoded });
}