// /lib/value-objects/date-time.ts

export class DateTime {
    constructor(private readonly value: Date) {}

    static fromJSDate(date: Date): DateTime {
        return new DateTime(date);
    }

    toJSDate(): Date {
        return this.value;
    }

    toISO(): string {
        return this.value.toISOString();
    }

    // ... autres méthodes utiles
}
