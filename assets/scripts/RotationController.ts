import { _decorator, Component, tween, Vec3, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RotationController')
export class RotateNode extends Component {
    @property
    rotationSpeedCoefficient: number = 1; // Коэффициент скорости вращения

    @property
    rotationX: number = 1; // выбранная ось вращения
    @property
    rotationY: number = 0; // выбранная ось вращения
    @property
    rotationZ: number = 0; // выбранная ось вращения

    @property(Node) // Предполагаем, что Joystick - это Node
    joystickNode: Node = null; // Узел джойстика

    private joystick: any; // Ссылка на экземпляр Joystick
    public JoystickPercentage: number = 0; // Переменная для хранения значения джойстика

    start() {
        this.joystick = this.joystickNode.getComponent('Joystick'); // Получаем компонент Joystick
    }

    update(deltaTime: number) {
        // Получаем значение JoystickPercentage
        if (this.joystick) {
            this.JoystickPercentage = this.joystick.getJoystickPercentage();
        }

        // Проверяем, если JoystickPercentage ненулевое
        if (this.JoystickPercentage !== 0) {
            this.rotateNode(); // Запускаем вращение
        }
    }

    rotateNode() {
        // Рассчитываем скорость вращения
        const actualRotationSpeed = this.rotationSpeedCoefficient * this.JoystickPercentage / 10;

        // Создаем анимацию вращения
        tween(this.node)
            .to(1, { eulerAngles: new Vec3(
                this.node.eulerAngles.x + (360 * this.rotationX * actualRotationSpeed),
                this.node.eulerAngles.y + (360 * this.rotationY * actualRotationSpeed),
                this.node.eulerAngles.z + (360 * this.rotationZ * actualRotationSpeed)
            ) }) // Вращение на 360 градусов с учетом скорости
            .call(() => {
                // После завершения анимации запускаем её снова
                this.rotateNode();
            })
            .start();
    }
}