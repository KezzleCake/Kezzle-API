export class RankResponseDto {
  readonly ranking: [];
  readonly startDate: string;
  readonly endDate: string;

  constructor(data: any, startDate, endDate) {
    this.ranking = data;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
