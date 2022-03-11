import { Socket } from 'socket.io';
import Consts from '../game_consts';

class Paddle {
  private _x: number;
  private _y: number;
  private _padSpeed: number;
  
  constructor(x: number) {
    this._x = x;
    this._y = Consts.PADDLE_INIT_Y;
    this._padSpeed = 0;
  }

  public getX(): number {
    return this._x;
  }
  public getY(): number {
    return this._y;
  }
  public setY(newPos: number): void {
    this._y = newPos;
  }
  public getPadSpeed(): number {
    return this._padSpeed;
  }
  public setPadSpeed(pad_speed: number): void {
    this._padSpeed = pad_speed;
  }

  //* move the paddle
  public movePaddle() {
    if (this._padSpeed === 0) return;
    this._y += this._padSpeed;
    if (this._y + Consts.PADDLE_H > Consts.CANVAS_H) {
      console.log('hana');
      this._padSpeed = 0;
      this._y = Consts.CANVAS_H - Consts.PADDLE_H;
      return;
    }
    if (this._y <= 0) {
      this._padSpeed = 0;
      this._y = 0;
      return;
    }
  }
  
  public isLeft() {
    return this._x - Consts.PADDLE_W <= 0;
  }
  public resetPaddle(): void {
    this._y = Consts.PADDLE_INIT_Y;
    //TODO reset Length too later
  }

  public move_forward(key: string): void {
    if (key === 'down') {
      this._padSpeed = -Consts.PADDLE_DIFF;
    } else {
      this._padSpeed = 0;
    }
  }
  
  public move_backward(key: string): void {
    if (key === 'down') {
      this._padSpeed = Consts.PADDLE_DIFF;
    } else {
      this._padSpeed = 0;
    }
  }
}

export default Paddle;
