import Phaser from "phaser";
import AnimationKeys from "~/const/AnimationKeys";
import AudioKeys from "~/const/AudioKeys";
import TextureKeys from "~/const/TextureKeys";

export enum CharacterState {
  Small,
  Big,
  Blossom,
  Dead,
}

export default class Mario extends Phaser.GameObjects.Container {
  private isJumping = false;
  private facedLeft = false;
  private isWinning = false;

  private marioState = CharacterState.Small;
  private mario: Phaser.GameObjects.Sprite;
  private marioBody!: Phaser.Physics.Arcade.Body;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  // private testOnce = true;

  constructor(scene: Phaser.Scene, x: number, y: number, newScale: number) {
    super(scene, x, y);

    this.mario = scene.add
      .sprite(0, 0, TextureKeys.Mario)
      .setOrigin(0.5, 1)
      .setScale(newScale);
    this.add(this.mario);

    scene.physics.add.existing(this);

    const body = <Phaser.Physics.Arcade.Body>this.body;
    this.marioBody = body;
    body.setGravityY(2000);
    body.setSize(
      this.mario.width * newScale * 0.9,
      this.mario.height * newScale
    );
    body.setOffset(
      this.mario.width * -0.5 * newScale,
      -this.mario.height * newScale
    );
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  updateAnimations(
    body: Phaser.Physics.Arcade.Body,
    walk: AnimationKeys,
    jump: AnimationKeys,
    idle: AnimationKeys
  ) {
    if (body.blocked.down) {
      this.isJumping = false;
      if (body.velocity.x > 0) {
        if (this.facedLeft) {
          this.mario.scaleX *= -1;
          this.facedLeft = false;
        }
        this.mario.play(walk, true);
      } else if (body.velocity.x < 0) {
        if (!this.facedLeft) {
          this.mario.scaleX *= -1;
          this.facedLeft = true;
        }
        this.mario.play(walk, true);
      } else {
        this.mario.anims.stop();
        // if(this.testOnce){
        //   console.log(idle);
        //   this.testOnce = false
        // }
        this.mario.play(idle);
      }
      if (this.cursors.up?.isDown) {
        body.setVelocityY(-1000);
        this.isJumping = true;
        this.marioState == CharacterState.Small
          ? this.PlaySound(AudioKeys.Jump)
          : this.PlaySound(AudioKeys.BigJump);
        this.mario.play(jump, true);
      }
      if (this.cursors.space?.isDown) {
        console.log(this.x, this.y);
      }
    }
  }

  bouncing() {
    this.marioBody.setVelocityY(-300);
  }

  dying() {
    if(this.marioState == CharacterState.Dead) return;
    const marioDie = this.scene.sound.add(AudioKeys.MarioDie);
    marioDie.play();
    this.marioState = CharacterState.Dead;
    const body = <Phaser.Physics.Arcade.Body>this.body;
    body.velocity.x = 0;
    body.setVelocityY(-600);
    this.mario.anims.stop();
    this.mario.play(AnimationKeys.MarioDead, true);
    this.scene.time.delayedCall(
      2000,
      () => {
        this.mario.destroy();
      },
      [],
      this
    );
  }

  IsJumping() {
    return this.isJumping;
  }

  MarioState() {
    return this.marioState;
  }

  GetBig() {
    this.marioState = CharacterState.Big;
    this.mario.setTexture(TextureKeys.BigMario, 1);
    // this.testOnce = true;
    this.PlaySound(AudioKeys.GetBig);
  }

  PlaySound(key: AudioKeys) {
    const sound = this.scene.sound.add(key);
    sound.play();
  }

  GoHome(){
    if(this.isWinning== true) return;
    this.isWinning = true;
    const body = <Phaser.Physics.Arcade.Body>this.body;
    body.setVelocityX(200);
    this.scene.game.sound.stopAll();
    this.PlaySound(AudioKeys.WorldClear);
  }

  preUpdate() {
    // if(this.testOnce == true){
    //   this.testOnce = false;
    //   console.log(this.mario.texture);
    // }

    const body = <Phaser.Physics.Arcade.Body>this.body;
    if (this.cursors.left?.isDown) {
      body.setVelocityX(-300);
    }
    if (this.cursors.right?.isDown) {
      body.setVelocityX(300);
    }
    switch (this.marioState) {
      case CharacterState.Small: {
        this.updateAnimations(
          body,
          AnimationKeys.MarioWalk,
          AnimationKeys.MarioJump,
          AnimationKeys.MarioIdle
        );
      }
      case CharacterState.Big: {
        this.updateAnimations(
          body,
          AnimationKeys.BigMarioWalk,
          AnimationKeys.BigMarioJump,
          AnimationKeys.BigMarioIdle
        );
      }
    }
  }

}
