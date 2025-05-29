export default class CreateScheduleExceptionDto {
    readonly id_schedule_consultant: number;
    readonly date_exception: string;
    readonly day_week: number;
    readonly unavailable_time: string;
    readonly reason: string;
}
