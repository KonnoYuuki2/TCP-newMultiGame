class BaseManager {
  constructor() {
    if (new.target === BaseManager) {
      throw new Error(`Cannot construct BaseManager instance`);
    }
  }

  addPlayer(playerId, ...args) {
    throw new Error(`Method not implemented`);
  }

  removePlayer(playerId) {
    throw new Error(`Method not implemented`);
  }

  clearAll() {
    throw new Error(`Method not implemented`);
  }
}

export default BaseManager;
