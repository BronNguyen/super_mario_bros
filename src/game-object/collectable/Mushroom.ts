import Phaser from "phaser";
import TextureKeys from "~/const/TextureKeys";

export default class Mushroom extends Phaser.GameObjects.Container {
  private vel = 200;
  private mushroom!: Phaser.GameObjects.Sprite;
  constructor(scene: Phaser.Scene, x: number, y: number, newScale: number) {
    super(scene, x, y);

    this.mushroom = scene.add
      .sprite(0, 0, TextureKeys.Mushroom).setFrame(1)
      .setOrigin(0.5, 1)
      .setScale(newScale);

    this.add(this.mushroom);

    scene.physics.add.existing(this);

    const body = <Phaser.Physics.Arcade.Body>this.body;
    body.setGravityY(2000);
    body.setSize(
      this.mushroom.width * newScale,
      this.mushroom.height * newScale
    );
    body.setOffset(
      this.mushroom.width * -0.5 * newScale,
      -this.mushroom.height * newScale
    );
  }

  preUpdate() {
    const body = <Phaser.Physics.Arcade.Body>this.body;

    body.setVelocityX(this.vel);
  }

  changeDirection() {
    this.vel *= -1;
  }
}
