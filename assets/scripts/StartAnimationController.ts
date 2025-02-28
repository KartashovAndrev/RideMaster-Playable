import { _decorator, Component, Animation, Node, input, Input, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartAnimationController')
export class AnimationController extends Component {
    @property(Node) handNode: Node = null; // Узел Hand
    @property(Node) draggableNode: Node = null; // Узел Draggable

    private animationComponentHand: Animation = null;
    private animationComponentDraggable: Animation = null;

    private isRunning: boolean = true;
    private isLeverPositionChangePlaying: boolean = false; // Флаг для отслеживания состояния анимации

    start() {
        this.animationComponentHand = this.handNode.getComponent(Animation);
        this.animationComponentDraggable = this.draggableNode.getComponent(Animation);
        this.runAnimations();
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    private async runAnimations() {
        while (this.isRunning) {
            await this.playAnimation(this.animationComponentHand, 'HandOpacityChange');
            await Promise.all([
                this.playAnimation(this.animationComponentHand, 'HandPositionChange'),
                this.playAnimation(this.animationComponentDraggable, 'LeverPositionChange')
            ]);
        }
    }

    private playAnimation(animationComponent: Animation, animationName: string): Promise<void> {
        return new Promise((resolve) => {
            animationComponent.play(animationName);
            if (animationName === 'LeverPositionChange') {
                this.isLeverPositionChangePlaying = true; // Устанавливаем флаг
            }
            animationComponent.once(Animation.EventType.FINISHED, () => {
                if (animationName === 'LeverPositionChange') {
                    this.isLeverPositionChangePlaying = false; // Сбрасываем флаг
                }
                resolve();
            });
        });
    }

    private onTouchStart(event: EventTouch) {
        this.isRunning = false;
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    
        if (this.handNode) {
            this.handNode.destroy(); // Удаляем узел Hand
        }
    
        // Возвращаем lever на позицию y = -120
        if (this.draggableNode) {
            this.draggableNode.setPosition(this.draggableNode.position.x, -120, this.draggableNode.position.z);
        }
    
        // Останавливаем анимацию LeverPositionChange, если она воспроизводится
        if (this.isLeverPositionChangePlaying && this.animationComponentDraggable) {
            this.animationComponentDraggable.stop(); // Останавливаем только LeverPositionChange
        }
    }
}