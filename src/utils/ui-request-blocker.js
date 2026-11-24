import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

let blocker = null;
let activeRequests = 0;

const getBlocker = () => {
  if (!blocker) {
    blocker = new UiBlocker({
      lowerLimit: 0,
      upperLimit: 350,
    });
  }

  return blocker;
};

export const isUiRequestPending = () => activeRequests > 0;

export const runWithBlockedUi = async (request) => {
  const uiBlocker = getBlocker();

  if (activeRequests === 0) {
    uiBlocker.block();
  }

  activeRequests += 1;

  try {
    return await request();
  } finally {
    activeRequests -= 1;

    if (activeRequests === 0) {
      uiBlocker.unblock();
    }
  }
};
