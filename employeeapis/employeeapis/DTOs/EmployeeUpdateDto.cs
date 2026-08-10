using System.ComponentModel.DataAnnotations;

namespace employeeapis.DTOs;

public class EmployeeUpdateDto
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    [StringLength(150, ErrorMessage = "Email cannot exceed 150 characters.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Department is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Department must be between 2 and 100 characters.")]
    public string Department { get; set; } = string.Empty;

    [Required(ErrorMessage = "Salary is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Salary must be greater than zero.")]
    public decimal Salary { get; set; }
}
