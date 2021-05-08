import Phaser, { Time } from "phaser";
import AnimationKeys from "~/const/AnimationKeys";
import TextureKeys from "~/const/TextureKeys";

export enum State {
  Alive = "alive",
  Vulnerable = "vulnerable",
  Dead = "dead",
}

export class Koopa extends Phaser.GameObjects.Container {
  state = State.Alive;
  private vel = -100;
  private lastVel = 0;
  private koopa!: Phaser.GameObjects.Sprite;
  constructor(scene: Phaser.Scene, x: number, y: number, newScale: number) {
    super(scene, x, y);

    this.koopa = scene.add
      .sprite(0, 0, TextureKeys.Koopa)
      .setOrigin(0.5, 1)
      .setScale(newScale);

    this.add(this.koopa);

    scene.physics.add.existing(this);

    const body = <Phaser.Physics.Arcade.Body>this.body;
    body.setGravityY(2000);
    body.setSize(
      (this.koopa.width * newScale) / 1.7,
      (this.koopa.height * newScale) / 1.7
    );
    body.setOffset(
      this.koopa.width * 0.25 * newScale,
      -this.koopa.height * newScale * 0.7
    );
  }

  preUpdate() {
    const body = <Phaser.Physics.Arcade.Body>this.body;
    if (this.state == State.Alive) {
      this.koopa.play(AnimationKeys.KoopaWalk, true);
    }
    body.setVelocityX(this.vel);
    if (body.velocity.x < 0 && this.scaleX > 0) {
      this.scaleX *= -1;
    }
  }

  changeDirection() {
    this.vel *= -1;
    this.koopa.scaleX *= -1;
  }

  pushed(left: boolean) {
      if(left){
        this.vel = -1000;
      } 
      else {
          this.vel = 1000;
      }
      this.koopa.play(AnimationKeys.KoopaCaveIn,true);
  }

  attacked() {
    if (this.state == State.Alive) {
      this.caveIn();
    } else {
        return;
    }
  }

  caveIn() {
    this.lastVel = this.vel;
    this.vel = 0;
    this.state = State.Vulnerable;
    this.koopa.play(AnimationKeys.KoopaCaveIn, true);
    this.scene.time.delayedCall(
      4000,
      () => {
        this.comeBack();
      },
      [],
      this
    );
  }

  comeBack() {
    this.koopa.play(AnimationKeys.KoopaCaveOut, true);
    this.scene.time.delayedCall(
      2000,
      () => {
        this.walkAgain();
      },
      [],
      this
    );
  }

  walkAgain() {
    this.vel = this.lastVel;
    this.lastVel = 0;
    this.state = State.Alive;
  }
}
