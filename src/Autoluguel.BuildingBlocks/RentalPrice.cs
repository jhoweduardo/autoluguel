namespace Autoluguel.BuildingBlocks;

public static class RentalPrice
{
    public const long MaximumDailyRateCents = 10_000_000;

    public static long CalculateTotalCents(long dailyRateCents, RentalPeriod period)
    {
        ArgumentNullException.ThrowIfNull(period);
        if (dailyRateCents is < 1 or > MaximumDailyRateCents)
            throw new ArgumentOutOfRangeException(nameof(dailyRateCents));

        return checked(dailyRateCents * period.Days);
    }
}
