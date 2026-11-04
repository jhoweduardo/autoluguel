using Autoluguel.BuildingBlocks;
using Xunit;

namespace Autoluguel.UnitTests;

public sealed class RentalRulesTests
{
    private static readonly DateOnly Start = new(2026, 10, 20);

    [Theory]
    [InlineData(1)]
    [InlineData(3)]
    [InlineData(30)]
    public void DurationExcludesReturnDate(int days)
    {
        Assert.Equal(days, new RentalPeriod(Start, Start.AddDays(days)).Days);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(0)]
    [InlineData(31)]
    public void InvalidDurationIsRejected(int days)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => new RentalPeriod(Start, Start.AddDays(days)));
    }

    [Theory]
    [InlineData(3, 5, false)]
    [InlineData(-2, 0, false)]
    [InlineData(2, 5, true)]
    [InlineData(1, 2, true)]
    [InlineData(0, 3, true)]
    public void OverlapIsSymmetricAndAllowsAdjacentBookings(int startOffset, int endOffset, bool expected)
    {
        var first = new RentalPeriod(Start, Start.AddDays(3));
        var second = new RentalPeriod(Start.AddDays(startOffset), Start.AddDays(endOffset));
        Assert.Equal(expected, first.Overlaps(second));
        Assert.Equal(expected, second.Overlaps(first));
    }

    [Fact]
    public void LeapDayCountsAsOneDay()
    {
        Assert.Equal(2, new RentalPeriod(new DateOnly(2028, 2, 28), new DateOnly(2028, 3, 1)).Days);
    }

    [Theory]
    [InlineData(12_000, 3, 36_000)]
    [InlineData(1, 1, 1)]
    [InlineData(10_000_000, 30, 300_000_000)]
    public void TotalUsesExactCents(long dailyRate, int days, long expected)
    {
        Assert.Equal(expected, RentalPrice.CalculateTotalCents(dailyRate, new RentalPeriod(Start, Start.AddDays(days))));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(10_000_001)]
    public void InvalidRateIsRejected(long dailyRate)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => RentalPrice.CalculateTotalCents(dailyRate, new RentalPeriod(Start, Start.AddDays(1))));
    }
}
