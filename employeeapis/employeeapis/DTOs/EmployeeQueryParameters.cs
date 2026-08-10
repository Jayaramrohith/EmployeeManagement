using System.ComponentModel.DataAnnotations;

namespace employeeapis.DTOs;

public class EmployeeQueryParameters
{
    private const int MaxPageSize = 100;
    private int _pageSize = 10;

    [Range(1, int.MaxValue, ErrorMessage = "Page number must be at least 1.")]
    public int PageNumber { get; set; } = 1;

    [Range(1, MaxPageSize, ErrorMessage = "Page size must be between 1 and 100.")]
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }

    public string? SearchName { get; set; }
    public string? SearchDepartment { get; set; }

    [RegularExpression("^(name|salary)$", ErrorMessage = "SortBy must be 'name' or 'salary'.")]
    public string SortBy { get; set; } = "name";

    [RegularExpression("^(asc|desc)$", ErrorMessage = "SortOrder must be 'asc' or 'desc'.")]
    public string SortOrder { get; set; } = "asc";
}
