const validateFields = (fields) => {
  return Object.entries(fields)
    .filter(
      ([_, value]) =>
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
    )
    .map(([key]) => key);
};

export { validateFields };
