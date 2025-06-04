import { NodeStateManager } from "../state/nodeStateManager";
import { MessageHandler } from "../messaging/messageHandler";

export async function onSelectionChange(): Promise<void> {
    const stateManager = NodeStateManager.getInstance();
    const messageHandler = MessageHandler.getInstance();
    
    const stateEvent = await stateManager.handleSelectionChange();
    messageHandler.handleStateChange(stateEvent);
}