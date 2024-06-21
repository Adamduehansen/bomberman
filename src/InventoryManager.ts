class InventoryManager {
  laneLength: number = 2;

  upgradeLaneLength(): void {
    this.laneLength += 1;
  }
}

const inventoryManager = new InventoryManager();

export default inventoryManager;
