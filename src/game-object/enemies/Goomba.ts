import Phaser, { Time } from "phaser";
import AnimationKeys from "~/const/AnimationKeys";
import TextureKeys from "~/const/TextureKeys";

export default class Goomba extends Phaser.GameObjects.Container {
  private alive = true;
  private vel = -100;
  private goomba!: Phaser.GameObjects.Sprite;
  constructor(scene: Phaser.Scene, x: number, y: number, newScale: number) {
    super(scene, x, y);

    this.goomba = scene.add
      .sprite(0, 0, TextureKeys.Goomba)
      .setOrigin(0.5, 1)
      .setScale(newScale);

    this.add(this.goomba);

    scene.physics.add.existing(this);

    const body = <Phaser.Physics.Arcade.Body>this.body;
    body.setGravityY(2000);
    body.setSize(this.goomba.width * newScale, this.goomba.height * newScale);
    body.setOffset(
      this.goomba.width * -0.5 * newScale,
      -this.goomba.height * newScale
    );
  }

  preUpdate() {
    const body = <Phaser.Physics.Arcade.Body>this.body;
    if (this.alive) {
      this.goomba.play(AnimationKeys.GoombaWalk, true);
    }
    body.setVelocityX(this.vel);
  }

  changeDirection() {
    this.vel *= -1;
    this.goomba.scaleX *= -1;
  }

  dying() {
    this.alive = false;
    this.vel = 0;
    this.goomba.play(AnimationKeys.GoombaDead, true);
    const game = <Phaser.Game>this.scene.game;
    this.scene.time.delayedCall(200,()=>{
        this.destroy();
    },[],this)
  }
  
}
