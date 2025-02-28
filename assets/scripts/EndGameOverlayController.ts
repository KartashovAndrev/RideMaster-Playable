import { _decorator, Component, Node, Sprite, find, Color } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('EndGameOverlay')
export class EndGameOverlay extends Component {
    @property(Node)
    private overlayNode: Node = null; // Узел с оверлеем окончания игры

    start() {
        // Показываем оверлей
        this.overlayNode.active = true; 
        }
}