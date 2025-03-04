import { _decorator, Component, Node, Vec2, EventTouch, v2, Vec3, Sprite, Color } from 'cc';
import { MachineCrashController } from './MachineCrashController'; // убедитесь, что путь правильный
import { StartAnimationController } from './StartAnimationController'; // Импортируйте ваш контроллер анимации
const { ccclass, property } = _decorator;

@ccclass('Joystick')
export class Joystick extends Component {
    @property(Node)
    stick: Node = null; // Узел, представляющий рычаг джойстика

    @property(Node)
    machineCrashControllerNode: Node = null; // Узел, представляющий MachineCrashController

    @property(Node)
    nodeToRemove: Node = null; // Узел, который нужно удалить при поломке машины
    @property(StartAnimationController)
    startAnimationController: StartAnimationController = null;

    private _startPos: Vec2 = v2(0, -120);
    private _radius: number = 7; // Радиус области джойстика
    private _direction: Vec2 = v2(0, 0); // Направление движения
    private _stickYValue: number = -120; // Значение y стика

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        this._startPos = event.getLocation();
        //this.stick.setPosition(this.node.position); // Установка рычага в центр

        if (this.startAnimationController) {

            this.startAnimationController.setIsRunning(false); // Останавливаем анимацию
        }
    }

    onTouchMove(event: EventTouch) {
        const currentPos = event.getLocation();
        this._direction = currentPos.subtract(this._startPos).normalize();
        this._direction.x = 0; // Отключаем движение по оси X

        const distance = Vec2.distance(this._startPos, currentPos);
        if (distance > this._radius) {
            this._direction = this._direction.multiplyScalar(this._radius);
        }

        const newPosition = this.node.position.add(new Vec3(this._direction.x, this._direction.y, 0));
        if (newPosition.y >= 120) {
            newPosition.y = 120;
        }
        if (newPosition.y <= -120) {
            newPosition.y = -120;
        }
        this.stick.setPosition(newPosition);
        this._stickYValue = newPosition.y;
    }

    onTouchEnd() {
        //this.stick.setPosition(this.node.position); // Возврат рычага в центр
        this._direction = v2(0, 0); // Сбрасываем направление
    }

    public getJoystickPercentage(): number {
        const min = -120;
        const max = 120;

        // Получаем компонент MachineCrashController
        const machineCrashController = this.machineCrashControllerNode.getComponent(MachineCrashController);
        
        // Проверяем состояние isBroken
        if (machineCrashController && machineCrashController.isBroken) {
            this.removeLeverUI(); // Удаляем указанную ноду, если isBroken
            return 0; // Возвращаем 0, если машина сломана
        }

        const normalizedValue = (this._stickYValue - min) / (max - min);
        const percentageValue = Math.round(normalizedValue * 100);
        return Math.max(0, Math.min(percentageValue, 100));
    }

    private removeLeverUI() {
        if (this.nodeToRemove) {
            // Проходим по всем дочерним нодам
            this.nodeToRemove.children.forEach(child => {
                // Получаем компонент Sprite с явным указанием типа
                const sprite = child.getComponent(Sprite) as Sprite;
                if (sprite) {
                    // Получаем текущий цвет
                    const currentColor = sprite.color;
                    // Создаем новый цвет с альфа-каналом 0
                    const newColor = new Color(currentColor.r, currentColor.g, currentColor.b, 0);
                    // Применяем новый цвет
                    sprite.color = newColor;
                }
            });
        }
    }
}