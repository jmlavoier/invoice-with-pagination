export const wait = (time: number = 1000) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
