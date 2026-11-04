namespace Autoluguel.BuildingBlocks;

public sealed record RentalPeriod
{
    public DateOnly StartDate { get; }
    public DateOnly EndDate { get; }
    public int Days => EndDate.DayNumber - StartDate.DayNumber;

    public RentalPeriod(DateOnly startDate, DateOnly endDate)
    {
        var days = endDate.DayNumber - startDate.DayNumber;
        if (days is < 1 or > 30)
            throw new ArgumentOutOfRangeException(nameof(endDate), "O período deve ter entre 1 e 30 diárias.");

        StartDate = startDate;
        EndDate = endDate;
    }

    public bool Overlaps(RentalPeriod other)
    {
        ArgumentNullException.ThrowIfNull(other);
        return StartDate < other.EndDate && other.StartDate < EndDate;
    }
}
