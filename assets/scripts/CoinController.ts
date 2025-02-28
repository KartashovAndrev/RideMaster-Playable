import { _decorator, Component, Node, ITriggerEvent, Label, SphereCollider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CoinController')
export class CoinController extends Component {
    @property(Node)
    coinCountNode: Node = null; // Нода для отображения счётчика монет

    @property(Node)
    machineNode: Node = null; // Нода для объекта Machine

    private coinCountLabel: Label | null = null; // Переменная для хранения ссылки на Label

    onLoad() {
        // Получаем компонент Label из ноды coinCountNode
        this.coinCountLabel = this.coinCountNode.getComponent(Label);
    }

    start() {
        // Подписываемся на событие onTriggerEnter
        const collider = this.node.getComponent(SphereCollider);
        if (collider) {
            collider.on('onTriggerEnter', this.onTriggerEnter, this);
        }
    }

    onTriggerEnter(event: ITriggerEvent) {
        const otherCollider = event.otherCollider;

        // Проверяем, что столкновение произошло с объектом Machine
        if (otherCollider.node === this.machineNode) {
            this.addCoin();
            this.node.destroy(); // Удаляем монету после сбора
        }
    }

    private addCoin() {
        // Увеличиваем счёт на 1
        if (this.coinCountLabel) {
            let currentCount = parseInt(this.coinCountLabel.string) || 0; // Обрабатываем случай, если строка пустая
            this.coinCountLabel.string = (currentCount + 1).toString();
        }
    }
}