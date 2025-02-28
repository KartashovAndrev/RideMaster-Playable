import { _decorator, Component, Node, tween, Vec3, Quat } from 'cc';

const { ccclass } = _decorator;

@ccclass('CoinAnimation')
export class CoinAnimation extends Component {
    private rotationSpeed: number = 180; // Скорость вращения в градусах в секунду
    private moveDistance: number = 0.5; // Расстояние перемещения вверх и вниз
    private moveDuration: number = 1; // Длительность перемещения

    start() {
        this.startTween();
    }

    update(deltaTime: number) {
        // Вращаем монету вокруг своей оси
        const rotationQuat = new Quat();
        Quat.fromEuler(rotationQuat, 0, this.rotationSpeed * deltaTime, 0);
        this.node.rotate(rotationQuat);
    }

    private startTween() {
        const originalPosition = this.node.position.clone();
        const targetPosition = originalPosition.clone().add(new Vec3(0, this.moveDistance, 0));

        // Перемещение вверх
        tween(this.node)
            .to(this.moveDuration, { position: targetPosition })
            .to(this.moveDuration, { position: originalPosition })
            .union() // Объединяем анимации
            .repeatForever() // Повторяем анимацию бесконечно
            .start();
    }
}