import { Body } from "matter";
import Phaser, { Actions, Physics } from "phaser";
import AudioKeys from "~/const/AudioKeys";
import MapKeys from "~/const/MapKeys";
import SceneKeys from "~/const/SceneKeys";
import TextureKeys from "~/const/TextureKeys";
import Mario, { CharacterState } from "~/game-object/characters/Mario";
import Mushroom from "~/game-object/collectable/Mushroom";
import Goomba from "~/game-object/enemies/Goomba";
import { State as KoopaState, Koopa } from "~/game-object/enemies/Koopa";

export default class Stage1 extends Phaser.Scene {
  private newScale = 1;
  private player!: Mario;
  private body!: Phaser.Physics.Arcade.Body;
  private goombas: Goomba[] = [];
  private koopas: Koopa[] = [];
  private mushrooms: Mushroom[] = [];
  private flag!: Phaser.GameObjects.Sprite;
  // private platformStanding!: Phaser.Physics.Arcade.Collider;
  private themeMusic!: Phaser.Sound.BaseSound;
  constructor() {
    super(SceneKeys.Stage1);
  }

  create() {
    this.themeMusic = this.sound.add(AudioKeys.Theme);
    this.themeMusic.play({ volume: 0.5 });

    const map = this.make.tilemap({ key: MapKeys.stage1 });
    const tileset = map.addTilesetImage("tileset", TextureKeys.TileSet);

    const bgLayer = map.createLayer("background", tileset);
    const activeLayer = map.createLayer("stage1", tileset);
    const obstacleLayer = map.createLayer("obstacle", tileset);
    const brickLayer = map.createLayer("brick", tileset);
    const brickTiles = [] as Phaser.Tilemaps.Tile[];
    brickLayer.forEachTile((tile) => {
      tile.properties.hasOwnProperty("breakAble")
        ? brickTiles.push(tile)
        : true;
    });

    const questionBoxLayer = map.createLayer("questionbox", tileset);
    const questionBoxTiles = [] as Phaser.Tilemaps.Tile[];
    questionBoxLayer.forEachTile((tile) => {
      tile.properties.hasOwnProperty("collider")
        ? questionBoxTiles.push(tile)
        : true;
    });

    const emptyBoxes = [] as Phaser.Tilemaps.Tile[];
    const emptyBoxLayer = map.createLayer("emptybox", tileset);
    emptyBoxLayer.forEachTile((tile) => {
      if (tile.properties.hasOwnProperty("changeAble")) {
        emptyBoxes.push(tile);
        tile.setAlpha(0);
      }
    });

    const layers = [
      bgLayer,
      activeLayer,
      brickLayer,
      questionBoxLayer,
      emptyBoxLayer,
      obstacleLayer,
    ];

    this.newScale = this.scale.height / bgLayer.height;
    this.player = new Mario(this, 100, 514, this.newScale);
    this.add.existing(this.player);

    
    this.flag = 
    this.physics.add
    .sprite(8100, 514,TextureKeys.Flag)
    .setOrigin(0.5,1)
    .setDepth(1)
    .setScale(this.newScale)
    .setImmovable(true);

    const homeTrigger = this.physics.add.collider(this.player,this.flag,()=>{
      this.Winning();
      this.physics.world.removeCollider(homeTrigger);
    })

    layers.map((layer) => {
      layer.setScale(this.newScale);
      layer.setCollisionByProperty({ collider: true });
      function distance(tile, playerBody) {
        return Math.sqrt(
          Math.pow(tile.x - playerBody.x, 2) +
            Math.pow(tile.y - playerBody.y, 2)
        );
      }
      this.physics.add.collider(this.player, layer, (_player, _layer) => {
        if (
          layer == brickLayer &&
          (this.player.body as Phaser.Physics.Arcade.Body).blocked.up
        ) {
          if (this.player.MarioState() == CharacterState.Small) {
            this.player.PlaySound(AudioKeys.Bump);
          }
          if (this.player.MarioState() == CharacterState.Big) {
            this.player.PlaySound(AudioKeys.BreakBlock);
            brickTiles
              .reduce((a, b) =>
                distance(layer.tileToWorldXY(a.x, a.y), _player.body) <
                distance(layer.tileToWorldXY(b.x, b.y), _player.body)
                  ? a
                  : b
              )
              .setAlpha(0)
              .setCollision(false);
          }
        }
        if (
          layer == questionBoxLayer &&
          (this.player.body as Phaser.Physics.Arcade.Body).blocked.up
        ) {
          let disabledTile = questionBoxTiles
            .reduce((a, b) =>
              distance(layer.tileToWorldXY(a.x, a.y), _player.body) <
              distance(layer.tileToWorldXY(b.x, b.y), _player.body)
                ? a
                : b
            )
            .setAlpha(0)
            .setCollision(false);
          emptyBoxes
            .filter(
              (tile) => tile.x == disabledTile.x && tile.y == disabledTile.y
            )[0]
            .setAlpha(1);
          if (disabledTile.properties.provide == "coin") {
            this.player.PlaySound(AudioKeys.Coin);
          } else if (disabledTile.properties.provide == "mushroom") {
            this.player.PlaySound(AudioKeys.Mushroom);
            this.mushrooms.push(
              new Mushroom(
                this,
                layer.tileToWorldX(disabledTile.x),
                layer.tileToWorldY(disabledTile.y),
                this.newScale
              )
            );
            this.mushrooms.map((mushroom) => {
              this.add.existing(mushroom);
              layers.forEach((layer) => {
                this.physics.add.collider(mushroom, layer, () => {
                  if (layer == obstacleLayer) {
                    mushroom.changeDirection();
                  }
                });
              });
              this.physics.add.collider(mushroom, this.player, () => {
                this.player.GetBig();
                mushroom.destroy();
              });
            });
          }
        }
      });
      this.physics.add.collider(this.goombas, layer, (_goomba, _layer) => {
        if (layer == obstacleLayer)
          this.goombas
            .filter((g) => g.body == _goomba.body)[0]
            .changeDirection();
      });
      this.physics.add.collider(this.koopas, layer, (_koopa, _layer) => {
        if (layer == obstacleLayer)
          this.koopas
            .filter((g) => g.body == _koopa.body)[0]
            .changeDirection();
      });
      this.physics.add.collider(this.flag, layer);
    });

    // const debugGraphics = this.add.graphics().setAlpha(0.7);
    // activeLayer.renderDebug(debugGraphics,{
    //     tileColor:null,
    //     collidingTileColor: new Phaser.Display.Color(243,234,40,255),
    //     faceColor: new Phaser.Display.Color(40,39,37,255)
    // })

    this.body = <Phaser.Physics.Arcade.Body>this.player.body;

    this.body.setCollideWorldBounds(true);
    this.physics.world.setBounds(
      0,
      -500,
      activeLayer.width * this.newScale,
      this.scale.height * 2
    );

    // this.physics.world.on('worldbounds', ()=>{
    //   this.player.dying();
    // });

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(
      0,
      0,
      activeLayer.width * this.newScale,
      this.scale.height
    );

    this.goombas.push(new Goomba(this, 780, 514, this.newScale));
    this.goombas.push(new Goomba(this, 1807, 514, this.newScale));

    this.goombas.push(new Goomba(this, 2155, 514, this.newScale));
    this.goombas.push(new Goomba(this, 2255, 514, this.newScale));

    this.goombas.push(new Goomba(this, 3477, 342, this.newScale));
    this.goombas.push(new Goomba(this, 3377, 342, this.newScale));
    this.goombas.push(new Goomba(this, 3327, 342, this.newScale));
    this.goombas.push(new Goomba(this, 3262, 342, this.newScale));
    this.goombas.push(new Goomba(this, 3217, 342, this.newScale));
    this.goombas.push(new Goomba(this, 3152, 342, this.newScale));

    this.goombas != []
      ? this.goombas.map((goomba) => {
          this.add.existing(goomba);
          this.physics.add.collider(goomba, activeLayer);
          this.physics.add.collider(goomba, this.player, (_goomba, _player) => {
            if (this.player.MarioState() == CharacterState.Dead) return;
            if (_goomba.body.touching.up) {
              goomba.dying();
              this.player.PlaySound(AudioKeys.Stomp);
              this.player.bouncing();
            }
            if (!_goomba.body.touching.up) {
              this.PlayerDying();
            }
          });
          this.physics.add.collider(goomba, this.koopas, (_goomba, _koopa) => {
            goomba.changeDirection();
            if (Math.abs(_koopa.body.velocity.x) > 300) {
              _goomba.destroy();
            } else if (Math.abs(_koopa.body.velocity.x) < 20) {
              return;
            }
            //todo: insert koopa change direction here!
            else return;
          });
        })
      : true;

    this.koopas.push(new Koopa(this, 680, 342, this.newScale));
    this.koopas.push(new Koopa(this, 3680, 342, this.newScale));

    this.koopas != []
      ? this.koopas.map((koopa) => {
          this.add.existing(koopa);
          this.physics.add.collider(
            koopa,
            activeLayer,
            (_koopa, _activeLayer) => {
              if (_koopa.body.touching.left || _koopa.body.touching.right) {
                koopa.changeDirection();
              }
            }
          );
          this.physics.add.collider(koopa, this.player, (_koopa, _player) => {
            if (this.player.MarioState() == CharacterState.Dead) return;
            if (_koopa.body.touching.up) {
              this.player.bouncing();
              this.player.PlaySound(AudioKeys.Kick);
              if (koopa.state != KoopaState.Alive) {
                this.player.PlaySound(AudioKeys.Kick);
                koopa.pushed(false);
                return;
              }
              koopa.attacked();
            }
            if (!_koopa.body.touching.up) {
              if (koopa.state == KoopaState.Alive) {
                this.PlayerDying();
              } else {
                if(Math.abs(_koopa.body.velocity.x)>300){
                  this.PlayerDying();
                }
                if (_koopa.body.touching.right) {
                  this.player.PlaySound(AudioKeys.Kick);
                  koopa.pushed(true);
                }
                if (_koopa.body.touching.left) {
                  this.player.PlaySound(AudioKeys.Kick);
                  koopa.pushed(false);
                }
              }
            }
          });
          this.physics.add.collider(koopa, this.goombas, (_koopa, _goomba) => {
            if (Math.abs(koopa.body.velocity.x) > 300) {
              _goomba.destroy();
            } else if (Math.abs(koopa.body.velocity.x) < 20) {
              return;
            } else koopa.changeDirection();
          });
          this.physics.add.collider(
            this.goombas,
            this.goombas,
            (_goomba1, _goomba2) => {
              this.goombas
                .filter((g) => g.body == _goomba1.body)[0]
                .changeDirection();
            }
          );
        })
      : true;
  }

  PlayerDying() {
    this.themeMusic.stop();
    this.player.dying();
    this.time.delayedCall(
      2000,
      () => {
        this.scene.start(SceneKeys.GameOver);
      },
      [],
      this
    );
  }

  Winning() {
    this.player.GoHome();
    this.time.delayedCall(4000,()=>{
      this.scene.start(SceneKeys.GameOver);
    })
  }

  update() {
    this.body.setVelocityX(0);
  }
}
