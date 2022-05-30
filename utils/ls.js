import ls from "localstorage-slim";

ls.config.encrypt = true;

export const myLS = {
  setItem: (name, value) => {
    ls.set(name, value, {
      encrypt: true,
    });
  },

  getItem: (name) =>
    ls.get(name, {
      decrypt: true,
    }),
};
