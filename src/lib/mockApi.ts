export const mockApi = {
  getAccountBalance: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          balance: 12450.75,
          change: 2.5,
        });
      }, 500);
    });
  },
  getHappyPaisa: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          balance: 2450,
        });
      }, 500);
    });
  },
  getCashback: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          balance: 180.50,
        });
      }, 500);
    });
  },
  getThisMonth: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          spent: 8240,
        });
      }, 500);
    });
  },
};