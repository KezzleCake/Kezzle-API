export class AnniversaryDto {
  readonly _id: string;
  readonly name: string;
  readonly dday: string;
  readonly ment: string;
  readonly images: string[];

  constructor(anniversary, images, day) {
    this._id = anniversary.id;
    this.name = anniversary.name;
    this.ment = anniversary.ment;
    this.dday = `D-${day}`;
    this.images = images;
  }
}
