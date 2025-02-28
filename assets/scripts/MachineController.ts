import { _decorator, Component, Node, Vec3, input, Input, EventKeyboard, KeyCode } from 'cc';
import { Joystick } from './Joystick'; // Импортируем класс Joystick
const { ccclass, property } = _decorator;

@ccclass('MachineController')
export class MachineController extends Component {
    @property(Node)
    joystickNode: Node = null; // Узел, содержащий компонент Joystick
    
    @property()
    private maxspeed: number = 35;

    private speed: number = 0; // Постоянная скорость машины
    private JoystickPercentage: number = 0; // Значение наклона джойстика
    private joystick: Joystick = null;
    private movingForward: boolean = false; // Флаг для отслеживания движения
    private lastFrameTime: number = 0; // Время последнего кадра

    onLoad() {
        // Получаем компонент Joystick из узла
        this.joystick = this.joystickNode.getComponent(Joystick);
    }

    start() {
        //input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        //input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(deltaTime: number) {
        // Обновляем время последнего кадра
        const currentTime = performance.now();
        const frameTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        if (this.joystick) {
            // Вызываем публичный метод getJoystickPercentage() и получаем значение
            this.JoystickPercentage = this.joystick.getJoystickPercentage();
            this.movingForward = true; // Устанавливаем флаг движения
            //console.log("Current Y value from Joystick:", this.JoystickPercentage);
        }

        // Вычисляем скорость относительно наклона джойстика
        this.speed = (this.maxspeed * (this.JoystickPercentage)/100);

        // Вычисляем FPS
        /*const fps = 1000 / frameTime;

        // Вы можете использовать fps для изменения скорости или других параметров
        const adjustedSpeed = this.speed * (fps / 60); // корректируем скорость в зависимости от FPS
        // console.log("Current vehicle speed:", adjustedSpeed);
        
        if (this.movingForward) {
            // Изменяем позицию машины по оси X
            this.node.position = this.node.position.add(new Vec3(adjustedSpeed * deltaTime, 0, 0));
        }
        */
        if (this.movingForward) {
            // Изменяем позицию машины по оси X
            this.node.position = this.node.position.add(new Vec3(this.speed * deltaTime, 0, 0));
        }
    }
/*
    onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.KEY_W) { // Используем 'W' для движения вперед
            this.movingForward = true; // Устанавливаем флаг движения
        }
    }

    onKeyUp(event: EventKeyboard) {
        if (event.keyCode === KeyCode.KEY_W) { // Используем 'W' для остановки
            this.movingForward = false; // Сбрасываем флаг движения
        }
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
*/
}